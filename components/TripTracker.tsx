import SERVER from '@/constants/Api';
import { useAuthContext } from '@/utils/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import haversine from 'haversine';
import React, { useEffect, useRef, useState } from 'react';
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

export default function TripTracker() {
  const [distance, setDistance] = useState<number>(0);
  const [transport, setTransport] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('benzina');
  const [peopleInCar, setPeopleInCar] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  const lastLocation = useRef<LocationPoint | null>(null);
  const lastMoveTime = useRef<number>(Date.now());
  const locationSub = useRef<Location.LocationSubscription | null>(null);
  const checkInterval = useRef<NodeJS.Timer | null>(null);
  const {token} = useAuthContext();
  
  useEffect(() => {
    startTracking();
    registerNotifications();

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      locationSub.current?.remove();
      if (checkInterval.current) clearInterval(checkInterval.current);
      sub.remove();
    };
  }, []);

  const registerNotifications = async () => {
    await Notifications.requestPermissionsAsync();
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  };

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to access location');
      return;
    }

    locationSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 10,
        timeInterval: 5000,
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        const currentPoint: LocationPoint = {
          latitude,
          longitude,
          timestamp: Date.now()
        };

        if (lastLocation.current) {
          const dist = haversine(lastLocation.current, currentPoint, { unit: 'km' });
          const timeDelta = (currentPoint.timestamp - lastLocation.current.timestamp) / 3600000;
          const kmh = dist / timeDelta;

          if (dist > 0.01) {
            setDistance(prev => prev + dist);
            lastMoveTime.current = Date.now();

            const mode =
              kmh < 5 ? 'Walking' :
              kmh < 15 ? 'Bicycle' :
              'Car';

            setTransport(mode);
          }
        }

        lastLocation.current = currentPoint;
      }
    );

    checkInterval.current = setInterval(() => {
      if (distance > 0 && Date.now() - lastMoveTime.current > 5 * 60 * 1000) {
        handleTripEnd();
      }
    }, 60000);
  };

  const handleTripEnd = () => {
    const data: TripData = {
      distance: parseFloat(distance.toFixed(2)),
      transport,
      timestamp: Date.now(),
      fuelType: transport === 'Car' ? fuelType : undefined,
      peopleInCar: transport === 'Car' ? peopleInCar : undefined,
    };
    setTripData(data);
    setModalVisible(true);
    clearTrip();

    if (appState !== 'active') {
      sendNotification(data);
    }
  };

  const clearTrip = () => {
    setDistance(0);
    lastLocation.current = null;
    lastMoveTime.current = Date.now();
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
      await saveTripOffline(tripData);
    }
  };

  const sendTripToServer = async (data: TripData) => {
    const res = await fetch(`${SERVER}/eco/activities`, {
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
      <Text>Distance: {distance.toFixed(2)} km</Text>
      <Text>Transport: {transport}</Text>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              You traveled {tripData?.distance} km by {tripData?.transport}.
              Do you want to save this trip?
            </Text>

            {transport === 'Car' && (
              <>
                <Text>Fuel Type:</Text>
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

                <Text>People in the car:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={peopleInCar.toString()}
                  onChangeText={(text) => setPeopleInCar(parseInt(text))}
                />
              </>
            )}

            <Button title="Save" onPress={confirmTrip} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 10 },
  modal: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white', padding: 20, borderRadius: 10,
    width: '80%', alignItems: 'center'
  },
  picker: { height: 50, width: 150 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, width: 100, marginBottom: 10, textAlign: 'center' }
});
