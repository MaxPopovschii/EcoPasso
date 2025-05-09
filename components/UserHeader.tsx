import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuthContext } from '@/utils/authContext'; // Presuming you have an auth context
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView
import { Colors } from '@/constants/Colors';

const UserHeader: React.FC = () => {
  const { user } = useAuthContext(); // Fetch user from context
  const avatarUri = user?.avatar || 'https://example.com/default-avatar.jpg'; // Default avatar
  const email = user?.email || 'email@example.com'; // Default email

  return (
    <SafeAreaView style={styles.safeAreaContainer}> {/* Wrap in SafeAreaView */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{user?.name || 'Nome Utente'}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 0, // Ensures the SafeAreaView doesn't take up unnecessary space
    backgroundColor: Colors.light.background, // Background color based on theme
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15, // Added padding to ensure space around the header
    paddingHorizontal: 20,
    height: 100, // Increased height to make sure it’s visible
    borderBottomWidth: 1, // Added a border to the bottom for visual separation
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50, // Avatar size
    height: 50,
    borderRadius: 25, // Circular avatar
    marginRight: 15, // Space between avatar and text
  },
  textContainer: {
    flexDirection: 'column', // Aligns text vertically
  },
  userName: {
    fontSize: 18, // Font size for name
    fontWeight: 'bold',
    color: Colors.light.text, // Text color based on theme
  },
  email: {
    fontSize: 14,
    color: Colors.light.text, // Text color based on theme
  },
});

export default UserHeader;
