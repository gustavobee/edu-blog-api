import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_STUDENTS } from './mockData';

const STORAGE_KEY_STUDENTS = '@edublog_cached_students';

const getLocalStudents = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_STUDENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erro ao ler estudantes do AsyncStorage:', e);
  }
  await saveLocalStudents(INITIAL_STUDENTS);
  return INITIAL_STUDENTS;
};

const saveLocalStudents = async (students) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.warn('Erro ao salvar estudantes no AsyncStorage:', e);
  }
};

export const studentService = {
  async getStudents(page = 1, limit = 4) {
    try {
      const response = await api.get(`/alunos?page=${page}&limit=${limit}`);
      if (response.data && response.data.data) {
        return response.data;
      }
    } catch (error) {
      console.log('API /alunos indisponível, utilizando dados locais:', error.message);
    }

    const local = await getLocalStudents();
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

  async getStudentById(id) {
    try {
      const response = await api.get(`/alunos/${id}`);
      if (response.data) return response.data;
    } catch (error) {
      console.log(`API /alunos/${id} indisponível, buscando local:`, error.message);
    }
    const local = await getLocalStudents();
    const found = local.find((s) => String(s.id) === String(id));
    if (found) return found;
    throw new Error('Aluno não encontrado.');
  },

  async createStudent(data) {
    try {
      const response = await api.post('/alunos', data);
      if (response.data) {
        const local = await getLocalStudents();
        local.unshift(response.data);
        await saveLocalStudents(local);
        return response.data;
      }
    } catch (error) {
      console.log('API /alunos (POST) indisponível, simulando criação local:', error.message);
    }
    const local = await getLocalStudents();
    const newStudent = {
      ...data,
      id: Date.now(),
      registration: data.registration || `ALU-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    local.unshift(newStudent);
    await saveLocalStudents(local);
    return newStudent;
  },

  async updateStudent(id, updatedData) {
    try {
      const response = await api.put(`/alunos/${id}`, updatedData);
      if (response.data) {
        const local = await getLocalStudents();
        const index = local.findIndex((s) => String(s.id) === String(id));
        if (index !== -1) {
          local[index] = { ...local[index], ...response.data };
          await saveLocalStudents(local);
        }
        return response.data;
      }
    } catch (error) {
      console.log(`API /alunos/${id} (PUT) indisponível, atualizando local:`, error.message);
    }
    const local = await getLocalStudents();
    const index = local.findIndex((s) => String(s.id) === String(id));
    if (index !== -1) {
      local[index] = { ...local[index], ...updatedData };
      await saveLocalStudents(local);
      return local[index];
    }
    throw new Error('Aluno não encontrado para atualização.');
  },

  async deleteStudent(id) {
    try {
      await api.delete(`/alunos/${id}`);
    } catch (error) {
      console.log(`API /alunos/${id} (DELETE) indisponível, removendo local:`, error.message);
    }
    const local = await getLocalStudents();
    const filtered = local.filter((s) => String(s.id) !== String(id));
    await saveLocalStudents(filtered);
    return { success: true };
  },
};
