import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AVAILABLE_GOALS = [
  {
    id: 1,
    name: "Streak Settimanale",
    description: "Registra attività per 7 giorni consecutivi",
    icon: "streak-flame",
    requirementType: "streak",
    requirementValue: 7,
  },
  {
    id: 2,
    name: "Eco Warrior",
    description: "Registra 30 attività eco-friendly",
    icon: "nature-people",
    requirementType: "total",
    requirementValue: 30,
  },
  // Aggiungi altri obiettivi qui
];

interface GoalSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectGoal: (goalId: number) => Promise<void>;
}

export const GoalSelectionModal: React.FC<GoalSelectionModalProps> = ({
  visible,
  onClose,
  onSelectGoal,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Scegli un Obiettivo</Text>
          
          <FlatList
            data={AVAILABLE_GOALS}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.goalItem}
                onPress={() => onSelectGoal(item.id)}
              >
                <MaterialIcons name={item.icon as any} size={32} color="#4CAF50" />
                <View style={styles.goalInfo}>
                  <Text style={styles.goalName}>{item.name}</Text>
                  <Text style={styles.goalDescription}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  goalInfo: {
    marginLeft: 15,
    flex: 1,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});