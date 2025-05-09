import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export const HomeComponent = () => {
  // Stati per il dropdown
  const [open, setOpen] = useState(false);
  const [billType, setBillType] = useState(null);
  const [billTypeItems, setBillTypeItems] = useState([
    { label: 'Luce (kWh)', value: 'electricity' },
    { label: 'Gas (m³)', value: 'gas' },
    { label: 'Acqua (m³)', value: 'water' },
  ]);

  const [consumption, setConsumption] = useState('');
  
  // Stati per date picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Funzione per ottenere l'unità di misura corretta
  const getUnit = () => {
    if (billType === 'electricity') {
      return 'kWh';
    } else {
      return 'm³';
    }
  };

  // Funzione per formattare la data
  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Handle date changes
  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  // Handle the calculate action
  const handleCalculate = async () => {
    if (!billType || !consumption || isNaN(parseFloat(consumption)) || parseFloat(consumption) <= 0) {
      Alert.alert("Errore", "Per favore inserisci un tipo di bolletta valido e un consumo.");
      return;
    }

    if (endDate < startDate) {
      Alert.alert("Errore", "La data di fine deve essere successiva alla data di inizio.");
      return;
    }

    try {
      const response = await fetch('https://tuo-server-api.com/calculate-ecofootprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billType: billType,
          consumption: parseFloat(consumption),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }),
      });

      const data = await response.json();

      if (!response.ok) Alert.alert("Errore", "Si è verificato un errore durante il calcolo.");
    } catch (error) {
      console.error(error);
      Alert.alert("Errore", "Impossibile raggiungere il server.");
    }
  };

  // Handle the reset action
  const handleReset = () => {
    setBillType(null);
    setConsumption('');
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <View style={styles.container}>
        {/* Date inputs */}
        <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Data Inizio:</Text>
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Data Fine:</Text>
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      </View>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={billType}
          items={billTypeItems}
          setOpen={setOpen}
          setValue={setBillType}
          setItems={setBillTypeItems}
          placeholder="Seleziona tipo di bolletta..."
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          listMode="SCROLLVIEW"
          zIndex={1000}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder={billType ? `Consumo (${getUnit()})` : 'Consumo'}
        keyboardType="numeric"
        value={consumption}
        onChangeText={setConsumption}
      />

      <Text style={styles.result}>
        {consumption ? `Risultato: ${consumption} ${getUnit()} da ${formatDate(startDate)} a ${formatDate(endDate)}` : 'Non hai messo un consumo.'}
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Reset" onPress={handleReset} color="gray" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 80
  },
  header: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 25 
  },
  dropdownContainer: {
    width: '80%',
    marginBottom: 20,
    zIndex: 1000
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    paddingHorizontal: 10
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderColor: '#ccc'
  },
  input: { 
    width: '80%', 
    padding: 10, 
    borderWidth: 1, 
    borderRadius: 5, 
    marginBottom: 20,
    backgroundColor: '#fff',
    borderColor: '#ccc'
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 30
  },
  dateLabel: {
    width: '30%',
    fontSize: 16
  },
  dateInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#ccc'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginTop: 10,
    marginBottom: 20
  },
  result: { 
    marginTop: 20, 
    fontSize: 18, 
    fontWeight: 'bold' 
  }
});

export default HomeComponent;