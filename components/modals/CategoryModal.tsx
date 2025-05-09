import React from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FoodComponent from '../FoodComponent';
import HomeComponent from '../HomeComponent';
import { OtherComponent } from '../OtherComponent';
import TransportComponent from '../TransportComponents';



interface CategoryModalProps {
  visible: boolean;
  category: string;
  onClose: () => void;
}

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, category, onClose }) => {
  const renderCategoryContent = () => {
    switch (category) {
      case 'Trasporti':
        return <TransportComponent />;
      case 'Casa':
        return <HomeComponent />;
      case 'Alimentazione':
        return <FoodComponent />;
      case 'Altro':
        return <OtherComponent />;
      default:
        return <Text>Unknown category</Text>;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.header}>{category?.toUpperCase()}</Text>
          {renderCategoryContent()}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity style={styles.addButton} onPress={() => {}}>
              <Text style={styles.addText}>Aggiungi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    maxHeight: windowHeight * 0.75,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  addButton: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CategoryModal;
