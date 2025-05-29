
import ActivityTypes from '@/constants/ActivityTypes';
import SERVER from '@/constants/Api';
import { useAuthContext } from '@/contexts/authContext';
import ActivityDataInterface from '@/types/ActivityDataInterface';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export const HomeComponent = () => {
  const { user, token } = useAuthContext();

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [billType, setBillType] = useState(null);
  const [billTypeItems, setBillTypeItems] = useState([
    { label: 'Luce (kWh)', value: 'Luce' },
    { label: 'Gas (m³)', value: 'Gas' },
    { label: 'Acqua (m³)', value: 'Acqua' },
  ]);

  const [consumption, setConsumption] = useState('');

  // Date picker state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Helpers
  const getUnit = () => (billType === 'Luce' ? 'kWh' : 'm³');
  const formatDate = (date) =>
    `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;

  // Date handlers
  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) setStartDate(selectedDate);
  };
  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) setEndDate(selectedDate);
  };

  // Submit
  const handleCalculate = async () => {
    if (!billType || !consumption || isNaN(parseFloat(consumption)) || parseFloat(consumption) <= 0) {
      Alert.alert("Errore", "Per favore inserisci un tipo di bolletta valido e un consumo.");
      return;
    }
    if (endDate < startDate) {
      Alert.alert("Errore", "La data di fine deve essere successiva alla data di inizio.");
      return;
    }
    if (!user || !token) {
      Alert.alert("Errore", "Utente non autenticato. Per favore accedi per continuare.");
      return;
    }
    if (new Date() < startDate || new Date() < endDate) {
      Alert.alert("Errore", "Le date non possono essere future rispetto ad oggi.");
      return;
    }
    if (startDate.getFullYear() < 2000 || endDate.getFullYear() < 2000) {
      Alert.alert("Errore", "Le date devono essere posteriori al 1 gennaio 2000.");
      return;
    }
    try {
      const foundType = ActivityTypes.find(item => item.value.toLowerCase() === billType.toLowerCase());
      if (!foundType) {
        Alert.alert("Errore", "Tipo di trasporto non riconosciuto.");
        return;
      }
      const activityData: ActivityDataInterface = {
        userEmail: user?.email,
        activityTypeId: foundType.key,
        data: [
          { field_name: 'startDate', field_value: startDate.toISOString() },
          { field_name: 'endDate', field_value: endDate.toISOString() },
          { field_name: 'consumption', field_value: consumption },
          { field_name: 'unit', field_value: getUnit() },
          { field_name: 'billType', field_value: billType },
        ],
        note: `Consumo ${billType}: ${consumption} ${getUnit()} dal ${formatDate(startDate)} al ${formatDate(endDate)}`
      };
      const activityResponse = await fetch(`${SERVER}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(activityData),
      });
      if (!activityResponse.ok) throw new Error('Errore nella creazione dell\'attività');
      const activityResult = await activityResponse.json();
      Alert.alert("Successo", activityResult.message ?? "Consumo salvato con successo!");
      handleReset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      Alert.alert("Errore", "Impossibile salvare il consumo: " + errorMessage);
    }
  };

  // Reset
  const handleReset = () => {
    setBillType(null);
    setConsumption('');
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        <MaterialIcons name="home" size={24} color="#4CAF50" /> Consumi Casa
      </Text>

      <View style={styles.row}>
        <MaterialIcons name="event" size={22} color="#2196F3" style={styles.icon} />
        <Text style={styles.label}>Data Inizio:</Text>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowStartDatePicker(true)}
          accessibilityRole="button"
          accessibilityLabel="Seleziona data inizio"
        >
          <Text style={styles.dateBtnText}>{formatDate(startDate)}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onStartDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.row}>
        <MaterialIcons name="event" size={22} color="#2196F3" style={styles.icon} />
        <Text style={styles.label}>Data Fine:</Text>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowEndDatePicker(true)}
          accessibilityRole="button"
          accessibilityLabel="Seleziona data fine"
        >
          <Text style={styles.dateBtnText}>{formatDate(endDate)}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onEndDateChange}
            maximumDate={new Date()}
          />
        )}
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
          modalProps={{ animationType: "fade" }}
          modalContentContainerStyle={styles.modalContent}
          labelStyle={styles.dropdownLabel}
          placeholderStyle={styles.dropdownPlaceholder}
        />
      </View>

      <View style={styles.inputRow}>
        <MaterialIcons name="flash-on" size={22} color="#2196F3" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={billType ? `Consumo (${getUnit()})` : 'Consumo'}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={consumption}
          onChangeText={setConsumption}
        />
      </View>

      <Text style={styles.result}>
        {consumption
          ? <Text>Risultato: {consumption} {getUnit()} dal {formatDate(startDate)} al {formatDate(endDate)}</Text>
          : <Text>Non hai inserito un consumo.</Text>
        }
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleCalculate} accessibilityRole="button" accessibilityLabel="Salva consumo">
          <MaterialIcons name="check-circle" size={22} color="#fff" />
          <Text style={styles.saveBtnText}>Salva Consumo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} accessibilityRole="button" accessibilityLabel="Reset campi">
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    color: '#222',
    marginRight: 8,
    width: 90,
  },
  icon: {
    marginRight: 8,
  },
  dateBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },
  dateBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  dropdownContainer: {
    width: '90%',
    marginBottom: 18,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  dropdownLabel: {
    color: '#222',
    fontSize: 16,
  },
  dropdownPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
  },
  inputRow: {
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
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#222',
    paddingVertical: 8,
    backgroundColor: 'transparent',
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
  result: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    textAlign: 'center',
  },
});

export default HomeComponent;