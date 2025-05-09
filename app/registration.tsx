import SERVER from '@/constants/Api';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Button } from 'react-native-paper';

interface RegFormState {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  passwordConfirm: string;
}

const RegisterScreen = () => {
  const [formData, setFormData] = useState<RegFormState>({
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    passwordConfirm: '',
  });
  const [otp, setOtp] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [error, setError] = useState('');

  const handleChange = (name: keyof RegFormState, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, passwordHash, passwordConfirm } = formData;
    if (!firstName || !lastName || !email || !passwordHash || !passwordConfirm) {
      setError('All fields are required.');
      return;
    }
    if (passwordHash !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const response = await fetch(`${SERVER}/auth/send-otp?email=${email}`, { method: 'POST' });
      if (response.ok) {
        setModalVisible(true);
      } else {
        Alert.alert('Error', 'Failed to send OTP.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`${SERVER}/auth/verify-otp?otp=${otp}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData})
      });
      if (!response.ok) throw new Error(await response.text());
      Alert.alert('Success', 'OTP Verified Successfully!');
      setModalVisible(false);
      setTimeout(() => router.navigate('/login'), 2000);
    } catch (error) {
      Alert.alert('Error');
    }
  };

  return (
    <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formContainer}>
            <Text style={styles.header}>Sign Up</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TextInput placeholder="Name" style={styles.textInput} value={formData.firstName} onChangeText={(text) => handleChange('firstName', text)} placeholderTextColor="#aaa"/>
            <TextInput placeholder="Surname" style={styles.textInput} value={formData.lastName} onChangeText={(text) => handleChange('lastName', text)} placeholderTextColor="#aaa"/>
            <TextInput placeholder="Email" style={styles.textInput} keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={(text) => handleChange('email', text)} placeholderTextColor="#aaa"/>
            <TextInput placeholder="Password" style={styles.textInput} secureTextEntry value={formData.passwordHash} onChangeText={(text) => handleChange('passwordHash', text)} placeholderTextColor="#aaa"/>
            <TextInput placeholder="Confirm Password" style={styles.textInput} secureTextEntry value={formData.passwordConfirm} onChangeText={(text) => handleChange('passwordConfirm', text)} placeholderTextColor="#aaa"/>
            <Button mode="contained" onPress={handleSubmit} style={styles.button}>Sign Up</Button>
            <TouchableOpacity onPress={() => router.navigate('/login')}>
              <Text style={styles.loginLink}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Enter OTP</Text>
            <TextInput style={styles.textInput} placeholder="Enter OTP" keyboardType="numeric" value={otp} onChangeText={setOtp} />
            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.backButton}>Back</Button>
              <Button mode="contained" onPress={verifyOtp} style={styles.buttonVerify}>Verify</Button>
            </View>
          </View>
        </View>
      </Modal>
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
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  header: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    marginVertical: 10,
  },
  loginLink: {
    color: '#4CAF50',
    fontSize: 16,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalTextInput: {
    width: '100%',
    height: 45,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  buttonVerify: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  }
});


export default RegisterScreen;
