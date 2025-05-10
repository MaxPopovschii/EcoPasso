import HomePageComponent from '@/components/HomePageComponent';
import { useAuthContext } from '@/utils/authContext';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const DashboardScreen: React.FC = () => {
  const userStats = {
    week: [10, 20, 30, 40, 50, 60, 70], 
    month: [150, 200, 180, 220], 
  };
  const {user} = useAuthContext();
  console.log('user', user);
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
