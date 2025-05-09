import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';

interface AuthContextType {
  token: string | null;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const [token, setToken] = useState<string | null>(null);

  // Save token to AsyncStorage and update state
  const login = useCallback(async (newToken: string) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }, []);

  // Remove token from AsyncStorage and update state
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }, []);

  // Load token from AsyncStorage on component mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };

    loadToken();
  }, []);

  return { token, login, logout };
};
