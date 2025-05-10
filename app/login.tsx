import SERVER from '@/constants/Api';
import { useAuthContext } from '@/utils/authContext';
import { LinearGradient } from 'expo-linear-gradient'; // Import for linear gradient
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface LoginFormState {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormState>({
    email: 'maxpopovschii@gmail.com',
    password: 'Dom200598!',
  });
  const router = useRouter();
  const {setToken} = useAuthContext();

  const handleChange = (name: keyof LoginFormState, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${SERVER}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Data error.");

      const token = await response.text();
      setToken(token);
      router.navigate("/(tabs)");
    } catch (error) {
      Alert.alert('Login Failed', (error as Error).message);
    }
  };
  return (
    <LinearGradient
      colors={['#4CAF50', '#2196F3']} 
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formContainer}>
            <Text style={styles.header}>Sign In</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              style={styles.textInput}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)} // Update email
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              style={styles.textInput}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)} // Update password
            />
            <TouchableOpacity style={styles.btnContainer} onPress={handleLogin}>
              <Text style={styles.btnText}>Entra</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  formContainer: {
    width: '100%',
    height: "95%",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background for the form
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 36,
    marginBottom: 24,
    color: '#fff', // White header text
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    height: 50,
    borderColor: '#fff', // White border for text inputs
    borderBottomWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#fff', // White text color for inputs
  },
  btnContainer: {
    width: '80%',
    marginTop: 20,
    backgroundColor: '#4caf50', // Green button color
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 50,
  },
  btnText: {
    color: '#fff', // White text color for button
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
