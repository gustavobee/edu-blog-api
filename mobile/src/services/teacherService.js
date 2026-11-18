import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_TEACHERS } from './mockData';

const STORAGE_KEY_TEACHERS = '@edublog_cached_teachers';

const getLocalTeachers = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_TEACHERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erro ao ler professores do AsyncStorage:', e);
  }
  await saveLocalTeachers(INITIAL_TEACHERS);
  return INITIAL_TEACHERS;
};

const saveLocalTeachers = async (teachers) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
  } catch (e) {
    console.warn('Erro ao salvar professores no AsyncStorage:', e);
  }
};

export const teacherService = {
  async getTeachers(page = 1, limit = 4) {
    try {
      const response = await api.get(`/professores?page=${page}&limit=${limit}`);
      if (response.data && response.data.data) {
        return response.data;
      }
    } catch (error) {
      console.log('API /professores indisponível, utilizando dados locais:', error.message);
    }

    const local = await getLocalTeachers();
    const startIndex = (page - 1) * limit;
    const paginatedItems = local.slice(startIndex, startIndex + limit);

    return {
      data: paginatedItems,
      total: local.length,
      page,
      limit,
      totalPages: Math.ceil(local.length / limit) || 1,
    };
  },

  async getTeacherById(id) {
    try {
      const response = await api.get(`/professores/${id}`);
      if (response.data) return response.data;
    } catch (error) {
      console.log(`API /professores/${id} indisponível, buscando local:`, error.message);
    }
    const local = await getLocalTeachers();
    const found = local.find((t) => String(t.id) === String(id));
    if (found) return found;
    throw new Error('Professor não encontrado.');
  },

  async createTeacher(data) {
    try {
      const response = await api.post('/professores', data);
      if (response.data) {
        const local = await getLocalTeachers();
        local.unshift(response.data);
        await saveLocalTeachers(local);
        return response.data;
      }
    } catch (error) {
      console.log('API /professores (POST) indisponível, simulando criação local:', error.message);
    }
    const local = await getLocalTeachers();
    const newTeacher = {
      ...data,
      id: Date.now(),
      registration: data.registration || `DOC-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    local.unshift(newTeacher);
    await saveLocalTeachers(local);
    return newTeacher;
  },

  async updateTeacher(id, updatedData) {
    try {
      const response = await api.put(`/professores/${id}`, updatedData);
      if (response.data) {
        const local = await getLocalTeachers();
        const index = local.findIndex((t) => String(t.id) === String(id));
        if (index !== -1) {
          local[index] = { ...local[index], ...response.data };
          await saveLocalTeachers(local);
        }
        return response.data;
      }
    } catch (error) {
      console.log(`API /professores/${id} (PUT) indisponível, atualizando local:`, error.message);
    }
    const local = await getLocalTeachers();
    const index = local.findIndex((t) => String(t.id) === String(id));
    if (index !== -1) {
      local[index] = { ...local[index], ...updatedData };
      await saveLocalTeachers(local);
      return local[index];
    }
    throw new Error('Professor não encontrado para atualização.');
  },

  async deleteTeacher(id) {
    try {
      await api.delete(`/professores/${id}`);
    } catch (error) {
      console.log(`API /professores/${id} (DELETE) indisponível, removendo local:`, error.message);
    }
    const local = await getLocalTeachers();
    const filtered = local.filter((t) => String(t.id) !== String(id));
    await saveLocalTeachers(filtered);
    return { success: true };
  },
};
