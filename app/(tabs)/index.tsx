import HomePageComponent from '@/components/HomePageComponent';
import { useAuthContext } from '@/utils/authContext';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const DashboardScreen: React.FC = () => {
  const userStats = {
    week: [10, 20, 30, 40, 50, 60, 70], // Dati settimanali
    month: [150, 200, 180, 220], // Dati mensili
  };
  const {user} = useAuthContext();
  return (
    <SafeAreaView style={{flex: 1}}>
      <HomePageComponent
        userName={user?.firstName + ' ' + user?.lastName}
        avatar={user?.avatar}
        statistics={userStats}
      />
    </SafeAreaView>
  );
};


export default DashboardScreen;
