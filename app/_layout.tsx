import { AuthProvider } from '@/contexts/authContext';
import { BadgeProvider } from '@/contexts/BadgeContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

import { GlobalBadgeModal } from '@/components/GlobalBadgeModal';

// Mantieni la splash screen finché la UI non è pronta
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Nascondi la splash screen dopo il montaggio
    SplashScreen.hideAsync();
  }, []);

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const backgroundColor = colorScheme === 'dark' ? '#1a1a1a' : '#f4f6fa';

  return (
    <AuthProvider>
      <BadgeProvider>
        <ThemeProvider value={theme}>
          <View
            style={{ flex: 1, backgroundColor }}
            accessible
            accessibilityLabel="EcoPasso Main Container"
          >
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#4CAF50',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontSize: 18,
                },
                headerShadowVisible: false,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
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
        <GlobalBadgeModal />
      </BadgeProvider>
    </AuthProvider>
  );
}
