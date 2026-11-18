import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, getDefaultApiUrl } from '../config/apiConfig';

const api = axios.create({
  baseURL: getDefaultApiUrl(),
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de requisição: injeta dinamicamente o baseURL salvo e o access_token
api.interceptors.request.use(
  async (config) => {
    try {
      const dynamicBaseUrl = await getApiBaseUrl();
      if (dynamicBaseUrl) {
        config.baseURL = dynamicBaseUrl;
      }

      const token = await AsyncStorage.getItem('@edublog_access_token');
      if (token) {
        config.headers['access_token'] = token;
      }
    } catch (e) {
      console.warn('Erro ao configurar headers na requisição:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
