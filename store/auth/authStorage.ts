import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from '@/entities/auth';

export const REFRESH_TOKEN_KEY = 'refresh_token';
export const ACCESS_TOKEN_KEY = 'access_token';
export const USER_KEY = 'auth_user';

export async function getStoredAuth(): Promise<{ accessToken: string | null; refreshToken: string | null; user: User | null }> {
  const [accessToken, refreshToken, userStr] = await Promise.all([
    getStorageItemAsync(ACCESS_TOKEN_KEY),
    getStorageItemAsync(REFRESH_TOKEN_KEY),
    getStorageItemAsync(USER_KEY),
  ]);

  return {
    accessToken,
    refreshToken,
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
    setStorageItemAsync(ACCESS_TOKEN_KEY, null),
    setStorageItemAsync(REFRESH_TOKEN_KEY, null),
    setStorageItemAsync(USER_KEY, null),
  ]);
}