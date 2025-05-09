import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';

export const TransportComponent = () => {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routeType, setRouteType] = useState('one-way');
  
  // Stati per il dropdown-picker
  const [open, setOpen] = useState(false);
  const [transportType, setTransportType] = useState('car');
  const [transportItems, setTransportItems] = useState([
    { label: 'Auto', value: 'car' },
    { label: 'Bicicletta', value: 'bike' },
    { label: 'Camminare', value: 'walk' },
    { label: 'Trasporto Pubblico', value: 'public' },
  ]);

  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    if (!startLocation) {
      setStartLocation(coordinate);
    } else if (!endLocation) {
      setEndLocation(coordinate);
    } else {
      Alert.alert("Errore", "Hai già selezionato sia il punto di partenza che di arrivo.");
    }
  };

  const handleRouteTypeChange = (type) => {
    setRouteType(type);
  };

  const getRouteCoordinates = () => {
    if (startLocation && endLocation) {
      return [startLocation, endLocation];
    }
    return [];
  };

  return (
    <View style={styles.container}>
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
          listMode="SCROLLVIEW"
          zIndex={1000}
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
    padding: 5
  },
  header: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  map: { 
    width: '100%', 
    height: 320,
    marginBottom: 20
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 20,
    marginBottom: 20,
    width: '100%'
  },
  routeText: { 
    fontSize: 18, 
    marginTop: 10 
  },
  dropdownContainer: { 
    marginTop: 20, 
    width: '80%',
    zIndex: 1000
  },
  pickerLabel: { 
    fontSize: 16, 
    marginBottom: 10,
    alignSelf: 'center' 
  },
  dropdown: {
    backgroundColor: '#f5f5f5',
    borderColor: '#cccccc'
  },
  dropdownList: {
    backgroundColor: '#f5f5f5',
    borderColor: '#cccccc'
  },
  transportText: { 
    fontSize: 18, 
    marginTop: 70, 
    fontWeight: 'bold' 
  },
});

export default TransportComponent;