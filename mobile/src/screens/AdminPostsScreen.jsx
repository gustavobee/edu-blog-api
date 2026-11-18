import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { PostCard } from '../components/PostCard';
import { EmptyState } from '../components/EmptyState';
import { ConfirmModal } from '../components/ConfirmModal';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

export const AdminPostsScreen = ({ navigation }) => {
  const { isTeacher } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      const data = await postService.getPosts(true);
      setPosts(data);
      applyStatusFilter(data, statusFilter);
    } catch (error) {
      console.warn('Erro ao carregar posts administrativos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPosts();
    });
    return unsubscribe;
  }, [navigation, loadPosts]);

  const applyStatusFilter = (list, filter) => {
    if (filter === 'todos') {
      setFilteredPosts(list);
    } else {
      setFilteredPosts(list.filter((p) => p.status === filter));
    }
  };

  const handleFilterChange = (filterKey) => {
    setStatusFilter(filterKey);
    applyStatusFilter(posts, filterKey);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await postService.deletePost(postToDelete.id);
      const updated = posts.filter((p) => p.id !== postToDelete.id);
      setPosts(updated);
      applyStatusFilter(updated, statusFilter);
      setPostToDelete(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o post.');
    } finally {
      setIsDeleting(false);
    }
  };

  const counts = {
    todos: posts.length,
    publicado: posts.filter((p) => p.status === 'publicado').length,
    rascunho: posts.filter((p) => p.status === 'rascunho').length,
    arquivado: posts.filter((p) => p.status === 'arquivado').length,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gestão de Postagens</Text>
          <Text style={styles.headerSubtitle}>
            Painel Administrativo do Docente
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newPostBtn}
          onPress={() => navigation.navigate('PostForm')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newPostBtnText}>Novo Post</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs de Filtro por Status */}
      <View style={styles.filterTabs}>
        {[
          { key: 'todos', label: 'Todos', count: counts.todos },
          { key: 'publicado', label: 'Publicados', count: counts.publicado },
          { key: 'rascunho', label: 'Rascunhos', count: counts.rascunho },
          { key: 'arquivado', label: 'Arquivados', count: counts.arquivado },
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => handleFilterChange(tab.key)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isActive && styles.filterTabTextActive,
                ]}
              >
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista de postagens */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando painel...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              showAdminActions={true}
              onPress={() => navigation.navigate('PostDetails', { id: item.id, post: item })}
              onEdit={(post) => navigation.navigate('PostForm', { post })}
              onDelete={(post) => setPostToDelete(post)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title="Nenhuma postagem nesta categoria"
              subtitle="Crie uma nova postagem ou alterne entre os filtros de status."
            />
          }
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        visible={!!postToDelete}
        title="Excluir postagem?"
        message={`Deseja realmente excluir a postagem "${postToDelete?.title}"?`}
        confirmText="Excluir Definitivamente"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPostToDelete(null)}
        loading={isDeleting}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  newPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  newPostBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  filterTabActive: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTabTextActive: {
    color: COLORS.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
