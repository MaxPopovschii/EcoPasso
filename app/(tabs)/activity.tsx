import GestioneAttivitaComponent from '@/components/GestioneAttivitàComponent';
import CategoryModal from '@/components/modals/CategoryModal';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivityScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState<string>("");

  // Se vuoi gestire le attività, puoi spostare lo stato e la logica in un context o in un componente superiore

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
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
