import CustomModal from '@/components/modals/ReusableModal';
import ProfilePage from '@/components/ProfilePage';
import SERVER from '@/constants/Api';
import { useAuthContext } from '@/utils/authContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function TabTwoScreen() {
  const { user, setToken } = useAuthContext();
  const [formData, setFormData] = useState<FormState>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: 'Giovannitraini1995!',
    newPassword: 'GiovanniGiovanni1995!',
    confirmPassword: 'GiovanniGiovanni1995!'
  });
  const [modalVisible, setModalVisible] = useState(false);
  const {token} = useAuthContext();
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${SERVER}/api/users/${user?.email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("" + response.status);
      
      const userData = await response.json();
      
      // Check if data is in an array or direct object
      const info = Array.isArray(userData) ? userData[0] : userData;
      
      setFormData(prevData => ({
        ...prevData,
        firstName: info.firstName || '',
        lastName: info.lastName || ''
      }));
    } catch (error) {
      Alert.alert('Request error', (error as Error).message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (name: keyof FormState, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileEdit = () => {
    setModalVisible(true);
  };

  const handlePasswordChange = () => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All password fields are required.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }

    // Simulating API call to change password
    // In a real app, you'd make an API call here
    changePassword();
  };

  const changePassword = async () => {
    try {
      const changeDto = {
        oldPass:formData.currentPassword,
        newPass:formData.newPassword,
      }
      const response = await fetch(`${SERVER}/api/users/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`},
        body: JSON.stringify(changeDto),
      });

      if (!response.ok) throw new Error("" + response.status);
      
      const res = await response.text();
      
    } catch (error) {
      Alert.alert('Request error', (error as Error).message);
    }
  };

  const handleProfileUpdate = async () => {
    const { firstName, lastName, email } = formData;
    
    if (!firstName || !lastName || !email) {
      Alert.alert("Error", "Name and email are required.");
      return;
    }
    
    // Here you would make an API call to update the profile
    // For now, just show success
    Alert.alert("Success", "Profile updated successfully!");
    
    // If password fields are filled, also handle password change
    if (formData.currentPassword && formData.newPassword && formData.confirmPassword) {
      handlePasswordChange();
    } else {
      setModalVisible(false);
    }
  };

  const handleLogout = () => {
    setToken(null)
    router.back()
    router.back()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProfilePage
        fullName={`${formData.firstName} ${formData.lastName}`.trim()}
        email={formData.email}
        profilePicture={user?.avatar}
        onEditProfile={handleProfileEdit}
        onLogout={handleLogout}
      />
      
      {/* Profile edit modal */}
      <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text style={styles.modalTitle}>Edit Profile</Text>

        <TextInput
          style={styles.input}
          value={formData.firstName}
          onChangeText={(text) => handleChange('firstName', text)}
          placeholder="First Name"
        />

        <TextInput
          style={styles.input}
          value={formData.lastName}
          onChangeText={(text) => handleChange('lastName', text)}
          placeholder="Last Name"
        />

        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Email"
          keyboardType="email-address"
        />

        <Text style={styles.sectionTitle}>Change Password (Optional)</Text>

        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          value={formData.currentPassword}
          onChangeText={(text) => handleChange('currentPassword', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={formData.newPassword}
          onChangeText={(text) => handleChange('newPassword', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
        />

        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleProfileUpdate} />
          <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
        </View>
      </CustomModal>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
