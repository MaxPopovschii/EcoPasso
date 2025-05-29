import SERVER from '@/constants/Api';
import { useAuthContext } from '@/contexts/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  AppStateStatus,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
const haversine = require('haversine');

type LocationPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

type TripData = {
  distance: number;
  transport: string;
  timestamp: number;
  fuelType?: string;
  peopleInCar?: number;
};

const LOCATION_TASK_NAME = 'background-location-task';

// Salva ogni posizione in background su AsyncStorage
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    if (locations && locations.length > 0) {
      const saved = await AsyncStorage.getItem('trackedLocations');
      const tracked: LocationPoint[] = saved ? JSON.parse(saved) : [];
      locations.forEach((loc: any) => {
        tracked.push({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
        });
      });
      await AsyncStorage.setItem('trackedLocations', JSON.stringify(tracked));
    }
  }
});

export default function TripTracker() {
  const [distance, setDistance] = useState<number>(0);
  const [transport, setTransport] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('benzina');
  const [peopleInCar, setPeopleInCar] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  const { token } = useAuthContext();

  // Avvia tracking continuo appena il componente è montato
  useEffect(() => {
    startTracking();
    registerNotifications();

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      sub.remove();
    };
  }, []);

  // Calcola la distanza totale ogni volta che l'app torna in foreground
  useEffect(() => {
    if (appState === 'active') {
      calculateDistanceFromStorage();
    }
  }, [appState]);

  const registerNotifications = async () => {
    await Notifications.requestPermissionsAsync();
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  };

  // Tracking continuo in background
  const startTracking = async () => {
    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (fgStatus !== 'granted' || bgStatus !== 'granted') {
      Alert.alert('No permission to access location');
      return;
    }
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 10,
      timeInterval: 5000,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'EcoPasso',
        notificationBody: 'Tracking your trip in background',
        notificationColor: '#008000',
      },
    });
  };

  // Calcola la distanza totale dalle posizioni salvate
  const calculateDistanceFromStorage = async () => {
    const saved = await AsyncStorage.getItem('trackedLocations');
    const tracked: LocationPoint[] = saved ? JSON.parse(saved) : [];
    let total = 0;
    for (let i = 1; i < tracked.length; i++) {
      total += haversine(tracked[i - 1], tracked[i], { unit: 'km' });
    }
    setDistance(total);
    // Puoi anche stimare il mezzo di trasporto qui se vuoi
  };

  // Simula la fine di un viaggio (puoi collegare a un bottone o logica automatica)
  const handleTripEnd = async () => {
    await calculateDistanceFromStorage();
    const data: TripData = {
      distance: parseFloat(distance.toFixed(2)),
      transport,
      timestamp: Date.now(),
      fuelType: transport === 'Car' ? fuelType : undefined,
      peopleInCar: transport === 'Car' ? peopleInCar : undefined,
    };
    setTripData(data);
    setModalVisible(true);
    await AsyncStorage.removeItem('trackedLocations'); // resetta per il prossimo viaggio

    if (appState !== 'active') {
      sendNotification(data);
    }
  };

  const sendNotification = async (data: TripData) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Trip Detected',
        body: `You traveled ${data.distance} km by ${data.transport}.`,
      },
      trigger: null,
    });
  };

  const confirmTrip = async () => {
    setModalVisible(false);
    if (!tripData) return;
    try {
      await sendTripToServer(tripData);
    } catch (e) {
      console.error('Failed to send trip to server:', e);
      await saveTripOffline(tripData);
    }
  };

  const sendTripToServer = async (data: TripData) => {
    const res = await fetch(`${SERVER}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error sending trip data to server');
  };

  const saveTripOffline = async (data: TripData) => {
    const saved = await AsyncStorage.getItem('unsentTrips');
    const trips: TripData[] = saved ? JSON.parse(saved) : [];
    trips.push(data);
    await AsyncStorage.setItem('unsentTrips', JSON.stringify(trips));
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
        Distance: {distance.toFixed(2)} km
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>
        Transport: {transport || 'Not selected'}
      </Text>
      <Picker
        selectedValue={transport}
        onValueChange={setTransport}
        style={styles.picker}
      >
        <Picker.Item label="Select transport" value="" />
        <Picker.Item label="Walk" value="Walk" />
        <Picker.Item label="Bike" value="Bike" />
        <Picker.Item label="Car" value="Car" />
      </Picker>
      <Button title="End Trip" onPress={handleTripEnd} color="#008000" />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 16, marginBottom: 10, textAlign: 'center' }}>
              You traveled {tripData?.distance} km by {tripData?.transport}.
              Do you want to save this trip?
            </Text>
            {tripData?.transport === 'Car' && (
              <>
                <Text style={{ marginTop: 10 }}>Fuel Type:</Text>
                <Picker
                  selectedValue={fuelType}
                  onValueChange={(itemValue) => setFuelType(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Benzina" value="benzina" />
                  <Picker.Item label="Diesel" value="diesel" />
                  <Picker.Item label="Electric" value="elettrico" />
                  <Picker.Item label="Hybrid" value="ibrido" />
                </Picker>
                <Text style={{ marginTop: 10 }}>People in the car:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={peopleInCar.toString()}
                  onChangeText={(text) => {
                    const num = parseInt(text.replace(/\D/g, ''), 10);
                    setPeopleInCar(isNaN(num) || num < 1 ? 1 : num);
                  }}
                  placeholder="1"
                  maxLength={2}
                />
              </>
            )}
            <Button
              title="Save"
              onPress={confirmTrip}
              disabled={
                tripData?.transport === 'Car' && (!peopleInCar || peopleInCar < 1)
              }
            />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#888" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 10, flex: 1, justifyContent: 'center' },
  modal: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white', padding: 20, borderRadius: 10,
    width: '80%', alignItems: 'center'
  },
  picker: { height: 50, width: 180, marginBottom: 10 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, width: 100, marginBottom: 10, textAlign: 'center' }
});
