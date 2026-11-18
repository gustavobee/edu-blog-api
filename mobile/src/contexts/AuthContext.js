import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext();

const STORAGE_KEY_TOKEN = '@edublog_access_token';
const STORAGE_KEY_USER = '@edublog_user_info';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inicializa o estado de autenticação a partir do AsyncStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEY_TOKEN);
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY_USER);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          // Padrão inicial: Visitante/Estudante padrão para visualização pública
          setUser({
            name: 'Estudante Visitante',
            email: 'aluno@fiap.com.br',
            role: 'Aluno',
            permissions: {
              canCreatePost: false,
              canEditPost: false,
              canDeletePost: false,
              canManageTeachers: false,
              canManageStudents: false,
              canComment: true,
            },
          });
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.warn('Erro ao restaurar sessão de autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password, role = 'Professor') => {
    setLoading(true);
    try {
      let authResult = null;
      try {
        const response = await api.post('/auth/login', { email, password, role });
        if (response.data && response.data.token) {
          authResult = response.data;
        }
      } catch (err) {
        console.log('Backend /auth/login indisponível, simulando autenticação local:', err.message);
      }

      const isTeacherRole = role === 'Professor';
      const defaultToken = isTeacherRole ? 'simulated_token' : 'student_token';
      const cleanEmail = email || (isTeacherRole ? 'professor@fiap.com.br' : 'aluno@fiap.com.br');
      const userName = cleanEmail.split('@')[0];

      const authenticatedUser = (authResult && authResult.user) ? authResult.user : {
        email: cleanEmail,
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        role: isTeacherRole ? 'Professor' : 'Aluno',
        permissions: {
          canCreatePost: isTeacherRole,
          canEditPost: isTeacherRole,
          canDeletePost: isTeacherRole,
          canManageTeachers: isTeacherRole,
          canManageStudents: isTeacherRole,
          canComment: true,
        },
      };

      const finalToken = (authResult && authResult.token) ? authResult.token : defaultToken;

      await AsyncStorage.setItem(STORAGE_KEY_TOKEN, finalToken);
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authenticatedUser));

      setToken(finalToken);
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      return { success: true, user: authenticatedUser };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Falha na autenticação' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.warn('Erro ao limpar storage no logout:', e);
    }

    setToken(null);
    setIsAuthenticated(false);
    setUser({
      name: 'Estudante Visitante',
      email: 'aluno@fiap.com.br',
      role: 'Aluno',
      permissions: {
        canCreatePost: false,
        canEditPost: false,
        canDeletePost: false,
        canManageTeachers: false,
        canManageStudents: false,
        canComment: true,
      },
    });
  };

  const isTeacher = isAuthenticated && user && user.role === 'Professor';
  const isStudent = !isTeacher;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isTeacher,
        isStudent,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
