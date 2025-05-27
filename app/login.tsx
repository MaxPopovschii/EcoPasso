import SERVER from '@/constants/Api';
import { useAuthContext } from '@/utils/authContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';


interface LoginFormState {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setToken } = useAuthContext();

  const handleChange = (name: keyof LoginFormState, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Attenzione', 'Inserisci email e password');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${SERVER}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Email o password errati.");
        }
        throw new Error("Errore di rete o dati non validi.");
      }

      const token = await response.text();
      setToken(token);
      router.navigate("/(tabs)");
    } catch (error) {
      Alert.alert('Login fallito', (error as Error).message);
    } finally {
      setLoading(false);
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
        style={styles.inner}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="leaf" size={60} color="#fff" />
              <Text style={styles.header}>Bentornato</Text>
              <Text style={styles.subHeader}>Accedi al tuo account</Text>
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={24} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                accessibilityLabel="Campo email"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={24} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={[styles.textInput, { flex: 1 }]}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                accessibilityLabel="Campo password"
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
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

            <TouchableOpacity
              style={[styles.btnContainer, (!formData.email || !formData.password || loading) && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={!formData.email || !formData.password || loading}
              accessibilityRole="button"
              accessibilityLabel="Accedi"
            >
              <Text style={styles.btnText}>{loading ? "Attendi..." : "Accedi"}</Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => router.push('/registration')}
              accessibilityRole="button"
              accessibilityLabel="Vai alla registrazione"
            >
              <Text style={styles.registerText}>
                Non hai un account? <Text style={styles.registerHighlight}>Registrati</Text>
              </Text>
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
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 8,
  },
  btnContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  registerHighlight: {
    color: '#fff',
    fontWeight: '600',
  },
  passwordToggle: {
    padding: 8,
    marginLeft: 8,
  },
});

export default LoginScreen;
