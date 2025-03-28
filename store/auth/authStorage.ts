import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const TOKEN_KEY = 'jws';

export async function getStoredAuth() {
  if (Platform.OS === 'web') {
    const jws = localStorage.getItem(TOKEN_KEY);
    return jws;
  }
  else {
    const jws = await SecureStore.getItemAsync(TOKEN_KEY);
    return jws;
  }
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
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}