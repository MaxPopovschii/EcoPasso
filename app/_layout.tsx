import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/utils/authContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#4CAF50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
            },
            headerShadowVisible: false,
            animation: 'slide_from_right',
          }}>
            <Stack.Screen 
              name="(tabs)" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="index" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="login"
              options={{
                title: 'Accedi',
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="registration"
              options={{
                title: 'Registrati',
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="+not-found"
              options={{
                title: 'Pagina non trovata',
                presentation: 'modal',
              }}
            />
          </Stack>
          <StatusBar 
            style={colorScheme === 'dark' ? 'light' : 'dark'} 
            backgroundColor="transparent" 
            translucent 
          />
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
}
