import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

interface User {
  email: string;
  name?: string;
  // aggiungi altri campi se necessario
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (newToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Save token & user to AsyncStorage and update state
  const login = useCallback(async (newToken: string, userObj: User) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userObj));
      setToken(newToken);
      setUser(userObj);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  }, []);

  // Remove token & user from AsyncStorage and update state
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  }, []);

  // Load token & user from AsyncStorage on component mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    };
    loadAuth();
  }, []);

  return { token, user, login, logout };
};
