import SERVER from '@/constants/Api';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (name: keyof RegFormState, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPasswordStrong = (password: string) =>
    password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    isEmailValid(formData.email) &&
    isPasswordStrong(formData.passwordHash) &&
    formData.passwordHash === formData.passwordConfirm;

  const handleSubmit = async () => {
    const { firstName, lastName, email, passwordHash, passwordConfirm } = formData;
    if (!firstName || !lastName || !email || !passwordHash || !passwordConfirm) {
      setError('Tutti i campi sono obbligatori.');
      return;
    }
    if (!isEmailValid(email)) {
      setError('Inserisci una email valida.');
      return;
    }
    if (!isPasswordStrong(passwordHash)) {
      setError('La password deve avere almeno 8 caratteri, una maiuscola e un numero.');
      return;
    }
    if (passwordHash !== passwordConfirm) {
      setError('Le password non coincidono.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${SERVER}/email/send-otp?email=${email}`, {
        method: 'POST',
      });
      if (response.ok) {
        setModalVisible(true);
      } else {
        Alert.alert('Errore', 'Invio OTP fallito.');
      }
    } catch (error) {
      console.error('Errore durante l\'invio OTP:', error);
      Alert.alert('Errore', 'Si è verificato un problema.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Inserisci un codice OTP valido.');
      return;
    }
    setOtpLoading(true);
    try {
      const otpResponse = await fetch(`${SERVER}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      if (!otpResponse.ok) {
        const errorText = await otpResponse.text();
        throw new Error(errorText);
      }
      const registerResponse = await fetch(`${SERVER}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.firstName,
          surname: formData.lastName,
          email: formData.email,
          password: formData.passwordHash,
        }),
      });

      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        throw new Error(`OTP valido, ma errore registrazione: ${errorText}`);
      }

      Alert.alert('Successo', 'Registrazione completata!');
      setModalVisible(false);
      setTimeout(() => router.navigate('/login'), 2000);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore durante la registrazione';
      Alert.alert('Errore', message);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#4CAF50', '#2196F3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="leaf" size={60} color="#fff" />
              <Text style={styles.header}>Benvenuto</Text>
              <Text style={styles.subHeader}>Crea il tuo account</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" size={24} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Nome"
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
                placeholderTextColor="rgba(255,255,255,0.7)"
                accessibilityLabel="Nome"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" size={24} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Cognome"
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
                placeholderTextColor="rgba(255,255,255,0.7)"
                accessibilityLabel="Cognome"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={24} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholderTextColor="rgba(255,255,255,0.7)"
                accessibilityLabel="Email"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={24} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                style={[styles.input, { flex: 1 }]}
                secureTextEntry={!showPassword}
                value={formData.passwordHash}
                onChangeText={(text) => handleChange('passwordHash', text)}
                placeholderTextColor="rgba(255,255,255,0.7)"
                accessibilityLabel="Password"
                autoCapitalize="none"
                autoComplete="password"
                textContentType="newPassword"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
                accessibilityLabel={showPassword ? "Nascondi password" : "Mostra password"}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={24} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Conferma Password"
                style={[styles.input, { flex: 1 }]}
                secureTextEntry={!showConfirmPassword}
                value={formData.passwordConfirm}
                onChangeText={(text) => handleChange('passwordConfirm', text)}
                placeholderTextColor="rgba(255,255,255,0.7)"
                accessibilityLabel="Conferma Password"
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.passwordToggle}
                accessibilityLabel={showConfirmPassword ? "Nascondi password" : "Mostra password"}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              contentStyle={styles.buttonContent}
              disabled={!isFormValid || loading}
              loading={loading}
              accessibilityLabel="Registrati"
              accessibilityRole="button"
            >
              Registrati
            </Button>

            <TouchableOpacity
              onPress={() => router.navigate('/login')}
              style={styles.loginLinkContainer}
              accessibilityRole="button"
              accessibilityLabel="Vai al login"
            >
              <Text style={styles.loginLink}>
                Hai già un account? <Text style={styles.loginLinkBold}>Accedi</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Inserisci il Codice OTP</Text>
            <Text style={styles.otpInfo}>
              Abbiamo inviato un codice di verifica al tuo indirizzo email.
              Controlla la tua casella di posta e inserisci il codice di 6 cifre
              qui sotto per completare la registrazione.
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Inserisci OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              accessibilityLabel="Codice OTP"
            />
            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.backButton}>
                Indietro
              </Button>
              <Button mode="contained" onPress={verifyOtp} style={styles.buttonVerify} loading={otpLoading}>
                Verifica
              </Button>
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
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    width: '100%',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  header: {
    fontSize: 32,
    marginTop: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 12,
    color: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 8,
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  buttonContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginLinkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginLink: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 300,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  otpInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
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
    color: '#333',
  },
  buttonVerify: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  passwordToggle: {
    padding: 8,
  },
});

export default RegisterScreen;
