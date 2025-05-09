import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient from Expo
import { Button } from 'react-native-paper';
import { router } from 'expo-router';

const HomeScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#4CAF50', '#2196F3']} // Green to Blue gradient
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          {/* <Image
            source={require('./assets/logo.png')} // Add a logo image if available
            style={styles.logo}
          /> */}
        </View>

        <Text style={styles.title}>Benvenuti to EcoPasso</Text>
        <Text style={styles.subtitle}>
          Track your ecological footprint and make a difference!
        </Text>
        
        <Text style={styles.infoText}>
          Join our community to monitor your eco-impact. Reduce waste, track consumption, and make eco-friendly choices.
        </Text>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon="login"
            onPress={() => router.navigate("/login")}
            style={[styles.button, styles.loginButton]}
            labelStyle={styles.buttonText}
          >
            Login
          </Button>
          <Button
            mode="contained"
            icon="account-plus"
            onPress={() => router.navigate("/registration")}
            style={[styles.button, styles.registerButton]}
            labelStyle={styles.buttonText}
          >
            Register
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 EcoTrack. All rights reserved.</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 30,
    height: '80%',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Light overlay for readability
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
  },
  registerButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.6,
  },
});

export default HomeScreen;
