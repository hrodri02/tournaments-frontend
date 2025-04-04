import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from '@/types/auth';

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

export async function getStoredAuth(): Promise<{ token: string | null; user: User | null }> {
  const [token, userStr] = await Promise.all([
    getStorageItemAsync(TOKEN_KEY),
    getStorageItemAsync(USER_KEY),
  ]);

  return {
    token,
    user: userStr ? JSON.parse(userStr) : null,
  };
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value === null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export async function getStorageItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  
  return await SecureStore.getItemAsync(key);
}

export async function clearStoredAuth() {
  await Promise.all([
    setStorageItemAsync(TOKEN_KEY, null),
    setStorageItemAsync(USER_KEY, null),
  ]);
}