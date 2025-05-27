import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  // Usa useRef per evitare di ricreare l'Animated.Value ad ogni render
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container} accessible accessibilityLabel="Pagina non trovata">
        <Animated.View style={[styles.iconContainer, { opacity: fadeAnim }]}>
          <MaterialIcons name="error-outline" size={80} color="#00796b" accessibilityLabel="Errore" />
        </Animated.View>
        <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
          <ThemedText type="title" style={styles.title}>
            Oops! Pagina non trovata.
          </ThemedText>
          <Text style={styles.subtitle}>
            La pagina che cerchi non esiste o è stata spostata.
          </Text>
        </Animated.View>
        <View style={styles.linkContainer}>
          <Link href="/" style={styles.link} accessibilityRole="button" accessibilityLabel="Torna alla home">
            <Text style={styles.linkText}>Torna alla home</Text>
          </Link>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#e0f7fa',
  },
  iconContainer: {
    marginBottom: 18,
  },
  titleContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#004d40',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#00695c',
    textAlign: 'center',
    marginTop: 2,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  link: {
    backgroundColor: '#00796b',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#00796b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  linkText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
