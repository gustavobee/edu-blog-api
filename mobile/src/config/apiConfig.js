import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_API_URL = '@edublog_api_base_url';

export const getDefaultApiUrl = () => {
  // No emulador Android, 10.0.2.2 aponta para o host do computador
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  // No iOS ou Web
  return 'http://localhost:3000';
};

let cachedApiUrl = null;

export const getApiBaseUrl = async () => {
  if (cachedApiUrl) return cachedApiUrl;
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY_API_URL);
    if (saved) {
      cachedApiUrl = saved;
      return saved;
    }
  } catch (error) {
    console.warn('Erro ao carregar URL da API salva:', error);
  }
  cachedApiUrl = getDefaultApiUrl();
  return cachedApiUrl;
};

export const setApiBaseUrl = async (newUrl) => {
  let cleaned = (newUrl || '').trim();
  if (cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  cachedApiUrl = cleaned || getDefaultApiUrl();
  try {
    await AsyncStorage.setItem(STORAGE_KEY_API_URL, cachedApiUrl);
  } catch (error) {
    console.warn('Erro ao salvar URL da API:', error);
  }
  return cachedApiUrl;
};
