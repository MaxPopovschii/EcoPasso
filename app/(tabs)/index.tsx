import HomePageComponent from '@/components/HomePageComponent';
import { useAuthContext } from '@/contexts/authContext';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const DashboardScreen: React.FC = () => {
  const {user} = useAuthContext();
  return (
    <SafeAreaView style={{flex: 1}}>
      <HomePageComponent
        email={user?.email as string}
        avatar={user?.avatar}
      />
    </SafeAreaView>
  );
};


export default DashboardScreen;
