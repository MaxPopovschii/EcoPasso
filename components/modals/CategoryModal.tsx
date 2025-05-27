import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, category, onClose }) => {
  const getCategoryIcon = () => {
    switch (category) {
      case 'Trasporti':
        return 'directions-car';
      case 'Casa':
        return 'home';
      case 'Alimentazione':
        return 'restaurant';
      case 'Altro':
        return 'more-horiz';
      default:
        return 'help-outline';
    }
  };

  const renderCategoryContent = useCallback(() => {
    switch (category) {
      case 'Trasporti':
        return (
          <View style={styles.componentWrapper}>
            <TransportComponent />
          </View>
        );
      case 'Casa':
        return (
          <View style={styles.componentWrapper}>
            <HomeComponent />
          </View>
        );
      case 'Alimentazione':
        return (
          <View style={styles.componentWrapper}>
            <FoodComponent />
          </View>
        );
      case 'Altro':
        return (
          <View style={styles.componentWrapper}>
            <OtherComponent />
          </View>
        );
      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Categoria sconosciuta</Text>
          </View>
        );
    }
  }, [category]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessible
      accessibilityViewIsModal
      accessibilityLabel={`Modal categoria ${category}`}
    >
      <TouchableWithoutFeedback onPress={onClose} accessible={false}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={['#4CAF50', '#2196F3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
              >
                <View style={styles.headerContent}>
                  <MaterialIcons
                    name={getCategoryIcon()}
                    size={24}
                    color="white"
                    accessibilityLabel="Icona categoria"
                  />
                  <Text style={styles.header}>
                    {category ? category.toUpperCase() : 'CATEGORIA'}
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeIcon}
                    accessibilityLabel="Chiudi modale"
                    accessibilityRole="button"
                  >
                    <MaterialIcons
                      name="close"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </LinearGradient>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator
                bounces={false}
                keyboardShouldPersistTaps="handled"
              >
                {renderCategoryContent()}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
  modalContainer: {
    width: '95%',
    height: windowHeight * 0.9,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerGradient: {
    padding: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  closeIcon: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 15,
  },
  componentWrapper: {
    flex: 1,
    minHeight: windowHeight * 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CategoryModal;
