import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#4CAF50', '#2196F3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="leaf" size={80} color="#fff" accessibilityLabel="Logo EcoPasso" />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title} accessibilityRole="header">EcoPasso</Text>
          <Text style={styles.subtitle}>
            Il tuo percorso verso un futuro sostenibile
          </Text>
          <Text style={styles.infoText}>
            Unisciti alla nostra community e inizia a monitorare il tuo impatto ambientale.
            Insieme possiamo fare la differenza per il nostro pianeta.
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="login" size={size} color={Platform.OS === 'android' ? '#4CAF50' : color} />
            )}
            onPress={() => router.push("/login")}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonText}
            accessibilityLabel="Accedi"
            accessibilityRole="button"
          >
            Accedi
          </Button>
          
          <Button
            mode="outlined"
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="account-plus" size={size} color="#fff" />
            )}
            onPress={() => router.push("/registration")}
            style={[styles.button, styles.registerButton]}
            contentStyle={styles.buttonContent}
            labelStyle={[styles.buttonText, styles.registerButtonText]}
            accessibilityLabel="Registrati"
            accessibilityRole="button"
          >
            Registrati
          </Button>
        </View>

        <View style={styles.footer}>
          <MaterialCommunityIcons name="earth" size={24} color="rgba(255,255,255,0.6)" accessibilityLabel="Icona Terra" />
          <Text style={styles.footerText}>© 2025 EcoPasso</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.85,
    maxWidth: width * 0.85,
    marginBottom: 8,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 16,
  },
  button: {
    borderRadius: 14,
    elevation: 4,
    backgroundColor: '#fff',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonContent: {
    height: 56,
    flexDirection: 'row-reverse',
  },
  buttonText: {
    fontSize: 18,
    letterSpacing: 1,
    color: '#4CAF50',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 2,
  },
  registerButtonText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.6,
  },
});

export default HomeScreen;
