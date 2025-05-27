import CustomModal from '@/components/modals/ReusableModal';
import SERVER from '@/constants/Api';
import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/utils/authContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ProfileScreen() {
  const { user, token } = useAuthContext();
  const { logout } = useAuth();
  const [formData, setFormData] = useState<FormState>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);

  // Carica i dati utente all'avvio
  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${SERVER}/api/users/${user?.email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Errore nel caricamento dei dati');
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setFormData(data);
        if (data.avatar) setAvatar(data.avatar);
      } else {
        const text = await response.text();
        console.warn('Risposta non JSON:', text);
      }
    } catch (error) {
      console.error('Errore nel caricamento dei dati utente:', error);
      Alert.alert('Errore', 'Impossibile caricare i dati utente');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permessi negati',
          'Per favore abilita l\'accesso alle foto nelle impostazioni del dispositivo.',
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      if (!result.assets || !result.assets[0]) {
        Alert.alert(
          'Errore',
          'Nessuna immagine selezionata. Per favore seleziona un\'immagine valida.',
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      const selectedAsset = result.assets[0];
      setAvatar(selectedAsset.uri);

      // Upload avatar
      const uploadData = new FormData();
      uploadData.append('avatar', {
        uri: selectedAsset.uri,
        type: 'image/jpeg',
        name: 'profile-avatar.jpg',
      } as any);

      try {
        const response = await fetch(`${SERVER}/api/users/${user?.email}/avatar`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: uploadData,
        });

        if (!response.ok) throw new Error('Errore nel caricamento dell\'immagine');

        // Aggiorna avatar dopo upload
        const updated = await response.json();
        if (updated.avatar) setAvatar(updated.avatar);

        Alert.alert('Successo', 'Avatar aggiornato con successo');
      } catch (uploadError) {
        console.error('Errore durante l\'upload dell\'avatar:', uploadError);
        Alert.alert(
          'Errore',
          'Impossibile caricare l\'immagine sul server. L\'avatar verrà aggiornato solo localmente.'
        );
      }
    } catch (error: any) {
      if (error && error.code === 'E_PICKER_CANCELLED') {
        // User cancelled the picker, do nothing
        return;
      }
      Alert.alert(
        'Errore selezione immagine',
        'Non è stato possibile accedere alla galleria. Verifica che l\'app abbia i permessi necessari.',
        [
          { text: 'OK', style: 'default' },
          { text: 'Riprova', onPress: pickImage, style: 'cancel' }
        ]
      );
    }
  };

  const handleUpdate = async () => {
    try {
      // Validazione password
      if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
          Alert.alert('Errore', 'Inserisci la password attuale');
          return;
        }
        if (!formData.newPassword) {
          Alert.alert('Errore', 'Inserisci la nuova password');
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          Alert.alert('Errore', 'Le password non coincidono');
          return;
        }
        if (formData.newPassword.length < 6) {
          Alert.alert('Errore', 'La password deve essere di almeno 6 caratteri');
          return;
        }
      }

      const response = await fetch(`${SERVER}/api/users/${user?.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          avatar
        }),
      });

      if (!response.ok) throw new Error('Errore nell\'aggiornamento');

      Alert.alert('Successo', 'Profilo aggiornato con successo');
      setModalVisible(false);

      // Pulisci i campi password
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del profilo:', error);
      Alert.alert('Errore', 'Impossibile aggiornare il profilo');
    }
  };

  const handleLogout = () => {
    logout();
    router.back();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#4CAF50', '#2196F3']}
        style={styles.mainGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <MaterialIcons name="person" size={40} color="#fff" />
            )}
            <View style={styles.avatarBadge}>
              <MaterialIcons name="camera-alt" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userEmail}>{formData.email}</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="edit" size={24} color="#4CAF50" />
            <Text>Modifica Profilo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color="#ff5252" />
            <Text style={{ color: '#ff5252' }}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>

        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifica Profilo</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                placeholder="Nome"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                placeholder="Cognome"
              />
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Cambia Password</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.currentPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
                placeholder="Password Attuale"
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.newPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
                placeholder="Nuova Password"
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                placeholder="Conferma Nuova Password"
                secureTextEntry
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annulla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Salva</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  mainGradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  avatar: {
    width: 114,
    height: 114,
    borderRadius: 57,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  userEmail: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#ff5252',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
});
