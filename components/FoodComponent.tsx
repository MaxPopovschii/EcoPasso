import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import ActivityTypes from '@/constants/ActivityTypes';
import SERVER from '@/constants/Api';
import { useAuthContext } from '@/utils/authContext';

export const FoodComponent = () => {
  const { user, token } = useAuthContext();

  const [openFood, setOpenFood] = useState(false);
  const [foodType, setFoodType] = useState(null);
  const [foodItems, setFoodItems] = useState([
    { label: 'Carne', value: 'Carne' },
    { label: 'Vegetariano', value: 'Vegetariano' },
  ]);

  const [meal, setMeal] = useState('');
  const [dishName, setDishName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const handleSubmit = async () => {
    if (!foodType || !dishName || !quantity || isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0 || !meal) {
      Alert.alert("Errore", "Compila tutti i campi correttamente.");
      return;
    }

    const activityType = ActivityTypes.find(item => item.value.toLowerCase() === foodType.toLowerCase());
    if (!activityType) {
      Alert.alert("Errore", "Tipo alimento non riconosciuto in ActivityTypes.");
      return;
    }

    const payload = {
      userEmail: user?.email,
      activityTypeId: activityType.key,
      note: `Hai mangiato ${dishName} (${quantity}g) a ${meal}`,
      data: [
        { field_name: 'meal_type', field_value: meal },
        { field_name: 'quantity', field_value: quantity },
        { field_name: 'consumption_date', field_value: formatDate(date) },
      ]
    };

    try {
      const response = await fetch(`${SERVER}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Errore nell\'invio dei dati');
      }

      Alert.alert("Successo", "Attività alimentare salvata.");
      handleReset();
    } catch (error) {
      Alert.alert("Errore", error.message || 'Errore sconosciuto');
    }
  };

  const handleReset = () => {
    setFoodType(null);
    setDishName('');
    setQuantity('');
    setMeal('');
    setDate(new Date());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inserisci Pasto</Text>

      {/* Dropdown allineato */}
      <View style={styles.inputWrapper}>
        <DropDownPicker
          open={openFood}
          value={foodType}
          items={foodItems}
          setOpen={setOpenFood}
          setValue={setFoodType}
          setItems={setFoodItems}
          placeholder="Seleziona tipo di alimento"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          listMode="MODAL"
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nome piatto"
        value={dishName}
        onChangeText={setDishName}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantità (grammi)"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TextInput
        style={styles.input}
        placeholder="Tipo pasto (es. pranzo)"
        value={meal}
        onChangeText={setMeal}
      />

      <View style={styles.dateRow}>
        <Text style={{ marginRight: 10 }}>Data consumo:</Text>
        <Button title={formatDate(date)} onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={styles.buttonRow}>
        <Button title="Salva" onPress={handleSubmit} color="#4CAF50" />
        <View style={{ width: 10 }} />
        <Button title="Reset" onPress={handleReset} color="gray" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    alignItems: 'center',
    padding: 20
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25
  },
  inputWrapper: {
    width: '80%',
    marginBottom: 20,
    zIndex: 1000
  },
  dropdown: {
    borderColor: '#ccc',
    backgroundColor: '#fff'
  },
  dropdownList: {
    borderColor: '#ccc',
    backgroundColor: '#fff'
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: '#ccc',
    backgroundColor: '#fff'
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginTop: 10
  }
});

export default FoodComponent;


