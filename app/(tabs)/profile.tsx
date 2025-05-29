import { GoalSelectionModal } from '@/components/modals/GoalSelectionModal';
import CustomModal from '@/components/modals/ReusableModal';
import { TestBadgeComponent } from '@/components/TestBadgeComponent';
import SERVER from '@/constants/Api';
import { useAuthContext } from '@/contexts/authContext';
import { useAuth } from '@/hooks/useAuth';
import { useBadgeTracker } from '@/hooks/useBadgeTracker';
import { Badge } from '@/types/Badge';
import { Goal } from '@/types/Goal';
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


export default function ProfileScreen() {
  const { user, token } = useAuthContext();
  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'badges' | 'goals'>('badges');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goal, setGoal] = useState<Goal>(null);
  const __DEV__ = true; // Set to true if you want to show the test badge in development mode
  // Form state for profile editing
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  // Fetch badges and goals
  /*
  const fetchUserData = async () => {
    if (!user?.email || !token) return;
    
    try {
      const [badgesRes, goalsRes] = await Promise.all([
        fetch(`${SERVER}/badges/user/${user.email}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        
        fetch(`${SERVER}/goals/progress/${user.email}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!badgesRes.ok || !goalsRes.ok) {
        throw new Error('Errore nel caricamento dei dati');
      }

      const [badgesData, goalsData] = await Promise.all([
        badgesRes.json(),
        goalsRes.json()
      ]);

      setBadges(badgesData);
      setGoals(goalsData);
    } catch (error) {
      console.error('Errore nel caricamento dei dati del profilo:', error);
      Alert.alert(
        'Errore',
        'Impossibile caricare i dati del profilo. Riprova più tardi.'
      );
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?.email, token]);

  const { progress } = useBadgeTracker(token, user?.email);

  useEffect(() => {
    if (progress.currentStreak === 5) {
      Alert.alert(
        'Nuovo Badge Sbloccato!',
        'Hai ottenuto il badge "Eco Rookie" per aver effettuato l\'accesso per 5 giorni consecutivi!',
        [{ text: 'OK', onPress: () => fetchUserData() }]
      );
    }
  }, [progress.currentStreak]);
*/
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
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          throw new Error('Inserisci la password attuale');
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('Le password non coincidono');
        }
        if (formData.newPassword.length < 6) {
          throw new Error('La password deve essere di almeno 6 caratteri');
        }
      }

      const response = await fetch(`${SERVER}/api/users/${user?.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          avatar
        }),
      });

      if (!response.ok) throw new Error('Errore nell\'aggiornamento del profilo');
      setModalVisible(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      Alert.alert('Successo', 'Profilo aggiornato con successo');
    } catch (error) {
      Alert.alert('Errore', error instanceof Error ? error.message : 'Errore imprevisto');
    }
  };

  const handleLogout = () => {
    logout();
    router.back();
    router.back();
  };

  const handleSelectGoal = async (goal: any) => {
    try {
      setGoal({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
        measureUnit: goal.measureUnite,
        startDate: goal.startDate,
        status: goal.status,
        type: goal.type
      })
      const response = await fetch(`${SERVER}/goals/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({goal}),
      });

      if (!response.ok) throw new Error('Errore nella creazione dell\'obiettivo');

      //await fetchUserData(); // Ricarica i goal dopo l'aggiunta
      setShowGoalModal(false);
      Alert.alert('Successo', 'Nuovo obiettivo aggiunto! Inizia a tracciare le tue attività.');
    } catch (error) {
      console.error('Errore durante l\'aggiunta dell\'obiettivo:', error);
      Alert.alert('Errore', 'Impossibile aggiungere l\'obiettivo');
    }
  };

  const renderBadges = () => (
    <View style={styles.badgesContainer}>
      {badges.map((badge) => (
        <TouchableOpacity 
          key={badge.id} 
          style={[styles.badge, !badge.achieved && styles.badgeLockedOverlay]}
        >
          <MaterialIcons 
            name={badge.icon as any} 
            size={32} 
            color={badge.achieved ? '#4CAF50' : '#bdbdbd'} 
          />
          <Text style={styles.badgeName}>{badge.name}</Text>
          {badge.progress && (
            <Text style={styles.badgeProgress}>{badge.progress}%</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderGoals = () => (
    <View style={styles.goalsContainer}>
      <TouchableOpacity 
        style={styles.addGoalButton}
        onPress={() => setShowGoalModal(true)}
      >
        <MaterialIcons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addGoalButtonText}>Nuovo Obiettivo</Text>
      </TouchableOpacity>
      
      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={styles.goalDescription}>{goal.description}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(goal.currentValue / goal.targetValue) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.goalProgress}>
            Progresso: {goal.currentValue} / {goal.targetValue} {goal.measureUnit}
          </Text>
          {goal.endDate && (
            <Text style={styles.goalDeadline}>
              Scadenza: {new Date(goal.endDate).toLocaleDateString()}
            </Text>
          )}
          {(() => {
            let statusLabel = '';
            if (goal.status === 'active') {
              statusLabel = 'In corso';
            } else if (goal.status === 'completed') {
              statusLabel = 'Completato';
            } else {
              statusLabel = 'Non riuscito';
            }
            return (
              <Text style={styles.goalStatus}>
                Stato: {statusLabel}
              </Text>
            );
          })()}
        </View>
      ))}

      <GoalSelectionModal
        visible={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSelectGoal={handleSelectGoal}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#4CAF50', '#2196F3']}
        style={styles.container}
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
          <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        {__DEV__ && <TestBadgeComponent />}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
            onPress={() => setActiveTab('badges')}
          >
            <Text style={styles.tabText}>Badge</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'goals' && styles.activeTab]}
            onPress={() => setActiveTab('goals')}
          >
            <Text style={styles.tabText}>Obiettivi</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {activeTab === 'badges' ? renderBadges() : renderGoals()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="edit" size={24} color="#fff" />
            <Text style={styles.buttonText}>Modifica Profilo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color="#fff" />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

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
  container: {
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
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#fff',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  badge: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  badgeLockedOverlay: {
    opacity: 0.5,
  },
  badgeName: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
  },
  badgeProgress: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  goalsContainer: {
    padding: 16,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  goalProgress: {
    fontSize: 14,
    color: '#666',
  },
  goalDeadline: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  goalStatus: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff5252',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
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
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addGoalButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
