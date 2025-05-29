import ActivityTypes from '@/constants/ActivityTypes';
import SERVER from '@/constants/Api';
import { useAuthContext } from '@/contexts/authContext';
import ActivityDataInterface from '@/types/ActivityDataInterface';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { Marker, Polyline } from 'react-native-maps';

const TransportComponent = () => {
  const { user } = useAuthContext();
  const [startLocation, setStartLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [endLocation, setEndLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeType, setRouteType] = useState('one-way');

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [transportType, setTransportType] = useState('car');
  const [transportItems, setTransportItems] = useState([
    { label: 'Auto', value: 'car' },
    { label: 'Bicicletta', value: 'bike' },
    { label: 'Camminare', value: 'walk' },
    { label: 'Trasporto Pubblico', value: 'public' },
  ]);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [fuelType, setFuelType] = useState<string>('gasoline');
  const [openFuel, setOpenFuel] = useState<boolean>(false);
  const [fuelItems] = useState([
    { label: 'Benzina', value: 'gasoline' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'GPL', value: 'lpg' },
    { label: 'Elettrico', value: 'electric' },
  ]);
  const { token } = useAuthContext();

  const calculateDistance = (start: any, end: any): number => {
    const R = 6371;
    const dLat = (end.latitude - start.latitude) * Math.PI / 180;
    const dLon = (end.longitude - start.longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(start.latitude * Math.PI / 180) * Math.cos(end.latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  };

  const handleMapPress = (e) => {
    if (!startLocation) {
      setStartLocation(e.nativeEvent.coordinate);
    } else if (!endLocation) {
      setEndLocation(e.nativeEvent.coordinate);
    } else {
      Alert.alert("Errore", "Hai già selezionato sia il punto di partenza che di arrivo.");
    }
  };

  const handleRouteTypeChange = (type: 'one-way' | 'round-trip') => {
    setRouteType(type);
  };

  const getRouteCoordinates = () => {
    if (startLocation && endLocation) {
      return [startLocation, endLocation];
    }
    return [];
  };

  // Chiamata al server per salvare il percorso
  const calculateAndSaveRoute = async () => {
    if (!startLocation || !endLocation) {
      Alert.alert("Errore", "Seleziona prima i punti di partenza e arrivo");
      return;
    }
    if (startLocation.latitude === endLocation.latitude && startLocation.longitude === endLocation.longitude) {
      Alert.alert("Errore", "I punti di partenza e arrivo non possono essere gli stessi");
      return;
    }

    if (passengerCount < 1) {
      Alert.alert("Errore", "Il numero di passeggeri deve essere almeno 1");
      return;
    }
    if (transportType === 'car' && !fuelType) {
      Alert.alert("Errore", "Seleziona un tipo di carburante per il trasporto in auto");
      return;
    }
    if (!routeType) {
      Alert.alert("Errore", "Seleziona un tipo di percorso (Andata o Andata/Ritorno)");
      return;
    }
    if (!user?.email) {
      Alert.alert("Errore", "Devi essere autenticato per salvare il percorso");
      return;
    }
    if (!transportType) {
      Alert.alert("Errore", "Seleziona un tipo di trasporto");
      return;
    }
    try {
      const foundType = ActivityTypes.find(item => item.value.toLowerCase() === transportType.toLowerCase());
      if (!foundType) {
        Alert.alert("Errore", "Tipo di trasporto non riconosciuto.");
        return;
      }

      const activityData: ActivityDataInterface = {
        userEmail: user?.email,
        activityTypeId: foundType.key,
        data: [
          { field_name: 'startLocation', field_value: `${startLocation.latitude},${startLocation.longitude}` },
          { field_name: 'endLocation', field_value: `${endLocation.latitude},${endLocation.longitude}` },
          { field_name: 'routeType', field_value: routeType },
          { field_name: 'transportType', field_value: transportType },
          { field_name: 'passengerCount', field_value: passengerCount.toString() },
          { field_name: 'fuelType', field_value: transportType === 'car' ? fuelType : null },
          { field_name: 'distance', field_value: calculateDistance(startLocation, endLocation).toString() }

        ],
        note: `Viaggio da ${startLocation.latitude},${startLocation.longitude} a ${endLocation.latitude},${endLocation.longitude}`
      };

      const activityResponse = await fetch(`${SERVER}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
        body: JSON.stringify(activityData),
      });

      if (!activityResponse.ok) {
        throw new Error('Errore nella creazione dell\'attività');
      }

      const activityResult = await activityResponse.json();
      Alert.alert("Successo", "Percorso salvato con successo!");
      console.log("Attività salvata:", activityResult);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      Alert.alert("Errore", "Impossibile salvare il percorso: " + errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.buttonContainer}>
          <Button
            title="Sola Andata"
            onPress={() => handleRouteTypeChange('one-way')}
            color={routeType === 'one-way' ? '#2196F3' : 'gray'}
          />
          <Button
            title="Andata/Ritorno"
            onPress={() => handleRouteTypeChange('round-trip')}
            color={routeType === 'round-trip' ? '#2196F3' : 'gray'}
          />
        </View>

        <MapView
          style={styles.map}
          onPress={handleMapPress}
        >
          {startLocation && (
            <Marker coordinate={startLocation} title="Punto A (Partenza)" />
          )}
          {endLocation && (
            <Marker coordinate={endLocation} title="Punto B (Arrivo)" />
          )}
          {startLocation && endLocation && (
            <Polyline
              coordinates={getRouteCoordinates()}
              strokeColor="#000"
              strokeWidth={3}
            />
          )}
        </MapView>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.pickerLabel}>Scegli il Tipo di Trasporto:</Text>
          <DropDownPicker
            open={open}
            value={transportType}
            items={transportItems}
            setOpen={setOpen}
            setValue={setTransportType}
            setItems={setTransportItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownList}
            placeholder="Seleziona un tipo di trasporto"
            listMode="MODAL"
            modalProps={{
              animationType: "fade"
            }}
            modalContentContainerStyle={styles.modalContent}
          />
        </View>

        {transportType === 'car' && (
          <View style={styles.additionalFields}>
            <Text style={styles.fieldLabel}>Tipo di carburante:</Text>
            <DropDownPicker
              open={openFuel}
              value={fuelType}
              items={fuelItems}
              setOpen={setOpenFuel}
              setValue={setFuelType}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownList}
              listMode="MODAL"
              modalProps={{
                animationType: "fade"
              }}
              modalContentContainerStyle={styles.modalContent}
            />

            <Text style={styles.fieldLabel}>Numero passeggeri:</Text>
            <TextInput
              style={styles.input}
              value={passengerCount.toString()}
              onChangeText={(text) => setPassengerCount(Number(text) || 1)}
              keyboardType="numeric"
              placeholder="Numero passeggeri"
            />
          </View>
        )}

        {startLocation && endLocation && (
          <Button
            title="Salva Percorso"
            onPress={calculateAndSaveRoute}
            color="#4CAF50"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    flex: 1,
    padding: 10,
  },
  bottomSection: {
    flex: 1,
    padding: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  dropdownContainer: {
    marginBottom: 15,
    zIndex: 1000,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    borderRadius: 8,
  },
  dropdownList: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
  },
  additionalFields: {
    marginTop: 15,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default TransportComponent;