
import GestioneAttivitaComponent from '@/components/GestioneAttivitàComponent';
import CategoryModal from '@/components/modals/CategoryModal';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabThirdScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activities, setActivities] = useState<
    { name: string; consumption: string; date: Date }[]
  >([]);
  const [category, setCategory] = useState<string>("");

  const handleAddActivity = (activity: {
    name: string;
    consumption: string;
    date: Date;
  }) => {
    setActivities([...activities, activity]);
  };

  const handleCategorySelect = (category: string) => {
    setCategory(category);
    setModalVisible(true);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestioneAttivitaComponent onCategorySelect={handleCategorySelect} />
      <CategoryModal
        visible={modalVisible}
        category={category}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
