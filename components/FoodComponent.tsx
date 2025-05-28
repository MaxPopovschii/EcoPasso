import ActivityDataInterface from '@/constants/ActivityDataInterface';
import ActivityTypes from '@/constants/ActivityTypes';
import SERVER from '@/constants/Api';
import { useAuthContext } from '@/utils/authContext';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const FoodComponent = () => {
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

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const handleConfirm = (selectedDate: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

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

    const payload: ActivityDataInterface = {
      userEmail: user?.email,
      activityTypeId: activityType.key,
      note: `Hai mangiato ${dishName} (${quantity}g) a ${meal}`,
      data: [
        { field_name: 'meal_type', field_value: meal },
        { field_name: 'quantity', field_value: quantity },
        { field_name: 'consumption_date', field_value: formatDate(date) },
        { field_name: 'dish_name', field_value: dishName },
        { field_name: 'food_type', field_value: foodType }
      ]
    };

    try {
      const response = await fetch(`${SERVER}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message ?? 'Errore nell\'invio dei dati');
      }

      Alert.alert("Successo", "Attività alimentare salvata.");
      handleReset();
    } catch (error) {
      Alert.alert("Errore", error.message ?? 'Errore sconosciuto');
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
      <Text style={styles.header}>
        <MaterialCommunityIcons name="food" size={24} color="#4CAF50" /> Inserisci Pasto
      </Text>

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
          zIndex={1000}
        />
      </View>

      <View style={styles.inputIconRow}>
        <MaterialIcons name="restaurant-menu" size={22} color="#2196F3" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nome piatto"
          value={dishName}
          onChangeText={setDishName}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputIconRow}>
        <MaterialCommunityIcons name="weight-gram" size={22} color="#2196F3" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Quantità (grammi)"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputIconRow}>
        <MaterialIcons name="local-dining" size={22} color="#2196F3" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Tipo pasto (es. pranzo)"
          value={meal}
          onChangeText={setMeal}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.dateRow}>
        <MaterialIcons name="event" size={22} color="#2196F3" style={{ marginRight: 8 }} />
        <Text style={{ marginRight: 10 }}>Data consumo:</Text>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowDatePicker(true)}
          accessibilityRole="button"
          accessibilityLabel="Seleziona data"
        >
          <Text style={styles.dateBtnText}>{formatDate(date)}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setShowDatePicker(false)}
          maximumDate={new Date()}
          locale="it-IT"
          is24Hour={true}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
          <MaterialIcons name="check-circle" size={22} color="#fff" />
          <Text style={styles.saveBtnText}>Salva</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <MaterialIcons name="refresh" size={22} color="#4CAF50" />
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    elevation: 2,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#4CAF50',
    letterSpacing: 1,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '90%',
    marginBottom: 18,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dropdownList: {
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  inputIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#222',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    width: '90%',
  },
  dateBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dateBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    marginTop: 18,
    gap: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    gap: 8,
  },
  resetBtnText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FoodComponent;
