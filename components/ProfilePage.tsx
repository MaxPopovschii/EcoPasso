import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileProps {
  fullName: string;
  email: string;
  profilePicture?: string;
  onEditProfile: () => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfileProps> = ({
  fullName,
  email,
  profilePicture = "https://via.placeholder.com/150",
  onEditProfile,
  onLogout,
}) => {
  return (
    <LinearGradient
              colors={['#4CAF50', '#2196F3']} 
              style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.email}>{email}</Text>
        <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logOutButton} onPress={onLogout}>
          <Text style={styles.logOutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
  </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  editButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logOutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d80101',
    borderRadius: 5,
  },
  logOutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
