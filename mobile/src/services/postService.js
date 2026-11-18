import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_POSTS } from './mockData';

const STORAGE_KEY_POSTS = '@edublog_cached_posts';

// Carrega o cache local se o backend estiver inacessível
const getLocalPosts = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_POSTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erro ao ler posts do AsyncStorage:', e);
  }
  // Se vazio, salva os iniciais
  await saveLocalPosts(INITIAL_POSTS);
  return INITIAL_POSTS;
};

const saveLocalPosts = async (posts) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.warn('Erro ao salvar posts no AsyncStorage:', e);
  }
};

export const postService = {
  async getPosts(includeAll = false) {
    try {
      const response = await api.get('/posts');
      if (Array.isArray(response.data) && response.data.length > 0) {
        await saveLocalPosts(response.data);
        return includeAll
          ? response.data
          : response.data.filter((p) => p.status === 'publicado');
      }
    } catch (error) {
      console.log('API /posts indisponível, utilizando cache local:', error.message);
    }
    const local = await getLocalPosts();
    if (!includeAll) {
      return local.filter((p) => p.status === 'publicado');
    }
    return local;
  },

  async getPostById(id) {
    try {
      const response = await api.get(`/posts/${id}`);
      if (response.data) return response.data;
    } catch (error) {
      console.log(`API /posts/${id} indisponível, buscando no cache local:`, error.message);
    }
    const local = await getLocalPosts();
    const found = local.find((p) => String(p.id) === String(id));
    if (found) return found;
    throw new Error('Post não encontrado');
  },

  async searchPosts(term) {
    if (!term || !term.trim()) {
      return this.getPosts(false);
    }
    try {
      const response = await api.get(`/posts/search?term=${encodeURIComponent(term)}`);
      if (Array.isArray(response.data)) return response.data;
    } catch (error) {
      console.log('API /posts/search indisponível, buscando no cache local:', error.message);
    }
    const local = await getLocalPosts();
    const lower = term.toLowerCase();
    return local.filter(
      (p) =>
        (p.status === 'publicado') &&
        ((p.title && p.title.toLowerCase().includes(lower)) ||
          (p.content && p.content.toLowerCase().includes(lower)) ||
          (p.description && p.description.toLowerCase().includes(lower)) ||
          (p.author && p.author.toLowerCase().includes(lower)))
    );
  },

  async createPost(postData) {
    try {
      const response = await api.post('/posts', postData);
      if (response.data) {
        // Atualiza cache local
        const local = await getLocalPosts();
        local.unshift(response.data);
        await saveLocalPosts(local);
        return response.data;
      }
    } catch (error) {
      console.log('API /posts (POST) indisponível, simulando criação local:', error.message);
    }
    const local = await getLocalPosts();
    const newPost = {
      ...postData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      comments: [],
    };
    local.unshift(newPost);
    await saveLocalPosts(local);
    return newPost;
  },

  async updatePost(id, updatedData) {
    try {
      const response = await api.put(`/posts/${id}`, updatedData);
      if (response.data) {
        const local = await getLocalPosts();
        const index = local.findIndex((p) => String(p.id) === String(id));
        if (index !== -1) {
          local[index] = { ...local[index], ...response.data };
          await saveLocalPosts(local);
        }
        return response.data;
      }
    } catch (error) {
      console.log(`API /posts/${id} (PUT) indisponível, simulando atualização local:`, error.message);
    }
    const local = await getLocalPosts();
    const index = local.findIndex((p) => String(p.id) === String(id));
    if (index !== -1) {
      local[index] = { ...local[index], ...updatedData, updatedAt: new Date().toISOString() };
      await saveLocalPosts(local);
      return local[index];
    }
    throw new Error('Post não encontrado para atualização');
  },

  async deletePost(id) {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      console.log(`API /posts/${id} (DELETE) indisponível, simulando exclusão local:`, error.message);
    }
    const local = await getLocalPosts();
    const filtered = local.filter((p) => String(p.id) !== String(id));
    await saveLocalPosts(filtered);
    return { success: true };
  },

  async addComment(postId, commentData) {
    // Adiciona comentário local ao post
    const local = await getLocalPosts();
    const post = local.find((p) => String(p.id) === String(postId));
    if (post) {
      if (!post.comments) post.comments = [];
      const newComment = {
        id: Date.now(),
        author: commentData.author || 'Estudante',
        text: commentData.text,
        createdAt: new Date().toISOString(),
      };
      post.comments.push(newComment);
      await saveLocalPosts(local);
      return newComment;
    }
    throw new Error('Post não encontrado');
  },
};
