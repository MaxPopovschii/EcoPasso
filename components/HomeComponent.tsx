import ActivityTypes from '@/constants/ActivityTypes';
import SERVER from '@/constants/Api';
import { useAuthContext } from '@/utils/authContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export const HomeComponent = () => {
  const { user } = useAuthContext();

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
  const {token} = useAuthContext();
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
      let id;
      ActivityTypes.forEach(item => {
        if (item.value == billType) {
          id = item.key
        }
      })
      const activityData = {
        userEmail: user?.email,
        activityTypeId: id,
        data: [
          {
            field_name: 'startDate',
            field_value: startDate,
          },
          {
            field_name: 'startDate',
            field_value: startDate,
          }
        ],
        notes: `Consumo ${billType}: ${consumption} ${getUnit()} dal ${formatDate(startDate)} al ${formatDate(endDate)}`
      };

      // Chiamata per creare l'Activity
      const activityResponse = await fetch(`${SERVER}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(activityData),
      });

      if (!activityResponse.ok) {
        throw new Error('Errore nella creazione dell\'attività');
      }

      const activityResult = await activityResponse.json();
      Alert.alert(activityResult);
      handleReset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      Alert.alert("Errore", "Impossibile salvare il consumo: " + errorMessage);
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
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Data Inizio:</Text>
        <View style={styles.pickerWrapper}>
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
            textColor="#000000"
          />
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Data Fine:</Text>
        <View style={styles.pickerWrapper}>
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
            textColor="#000000"
          />
        </View>
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
          listMode="MODAL"
          modalProps={{
            animationType: "fade"
          }}
          modalContentContainerStyle={styles.modalContent}
          labelStyle={styles.dropdownLabel}
          placeholderStyle={styles.dropdownPlaceholder}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder={billType ? `Consumo (${getUnit()})` : 'Consumo'}
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={consumption}
        onChangeText={setConsumption}
      />

      <Text style={styles.result}>
        {consumption 
          ? <Text>Risultato: {consumption} {getUnit()} da {formatDate(startDate)} a {formatDate(endDate)}</Text>
          : <Text>Non hai messo un consumo.</Text>
        }
      </Text>

      <View style={styles.buttonContainer}>
        <Button 
          title="Salva Consumo" 
          onPress={handleCalculate} 
          color="#4CAF50"
        />
        <View style={{ width: 20 }} />
        <Button 
          title="Reset" 
          onPress={handleReset} 
          color="gray" 
        />
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
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden'
  },
  dropdownLabel: {
    color: '#000000',
    fontSize: 16
  },
  dropdownPlaceholder: {
    color: '#999',
    fontSize: 16
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
  }
});

export default HomeComponent;