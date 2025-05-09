import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Animated, Text } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

export default function NotFoundScreen() {
  // Animated opacity for the "Oops!" text to make it feel more dynamic
  const fadeAnim = new Animated.Value(0);

  // Start fade-in animation when screen loads
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
          <ThemedText type="title" style={styles.title}>
            This screen doesn't exist.
          </ThemedText>
        </Animated.View>
        
        <View style={styles.linkContainer}>
          <Link href="/" style={styles.link}>
            <Text style={styles.linkText}>Go to home screen</Text>
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
    backgroundColor: '#e0f7fa', // Light cyan background for fresh feel
  },
  titleContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800', // Heavier weight for more impact
    color: '#004d40', // Deep teal for good contrast and readability
    textAlign: 'center',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  link: {
    backgroundColor: '#00796b', // Dark teal background for the link
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 6, // Shadow effect for a floating button look
    shadowColor: '#00796b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  linkText: {
    fontSize: 18,
    fontWeight: '600', // Slightly bold text
    color: '#fff',
    textAlign: 'center',
  },
});
