import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; // Per scegliere il tipo di cibo

export const FoodComponent = () => {
  const [mealType, setMealType] = useState('');
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dish, setDish] = useState('');
  const [consumptionDate, setConsumptionDate] = useState('');

  // Opzioni per il tipo di pasto
  const mealOptions = [
    { label: 'Colazione', value: 'colazione' },
    { label: 'Pranzo', value: 'pranzo' },
    { label: 'Cena', value: 'cena' },
  ];

  // Opzioni per il tipo di cibo
  const foodTypeOptions = [
    { label: 'Frutta', value: 'frutta' },
    { label: 'Verdura', value: 'verdura' },
    { label: 'Carne', value: 'carne' },
    { label: 'Latticini', value: 'latticini' },
    { label: 'Cereali', value: 'cereali' },
    { label: 'Altro', value: 'altro' },
  ];

  const handleSubmit = async () => {
    if (!mealType || !foodType || !quantity || isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0 || !dish) {
      Alert.alert("Errore", "Per favore compila tutti i campi correttamente.");
      return;
    }

    try {
      const response = await fetch('https://tuo-server-api.com/food-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mealType,
          foodType,
          dish,
          quantity: parseFloat(quantity),
          consumptionDate,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Errore", "Si è verificato un errore durante l'invio dei dati.");
      } else {
        Alert.alert("Successo", "I dati sono stati inviati correttamente.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Errore", "Impossibile raggiungere il server.");
    }
  };

  const handleReset = () => {
    setMealType('');
    setFoodType('');
    setQuantity('');
    setDish('');
    setConsumptionDate('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inserisci Pasti e Cibo</Text>

      {/* Seleziona il tipo di pasto */}
      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setMealType(value)}
        items={mealOptions}
        placeholder={{ label: 'Seleziona tipo di pasto...', value: null }}
      />

      {/* Seleziona il tipo di cibo */}
      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setFoodType(value)}
        items={foodTypeOptions}
        placeholder={{ label: 'Seleziona tipo di cibo...', value: null }}
      />

      {/* Nome del piatto */}
      <TextInput
        style={styles.input}
        placeholder="Nome del piatto"
        value={dish}
        onChangeText={setDish}
      />

      {/* Quantità */}
      <TextInput
        style={styles.input}
        placeholder="Quantità (grammi)"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      {/* Data di consumo (opzionale) */}
      <TextInput
        style={styles.input}
        placeholder="Data di consumo (opzionale)"
        value={consumptionDate}
        onChangeText={setConsumptionDate}
      />

      {/* Bottone Invia */}
      <Button title="Invia" onPress={handleSubmit} />

      {/* Bottone Reset */}
      <Button title="Reset" onPress={handleReset} color="gray" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { width: '80%', padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 15 },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  inputIOS: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
});

export default FoodComponent;
