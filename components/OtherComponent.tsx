import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

export const OtherComponent = () => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      Alert.alert("Errore", "Per favore inserisci dei dettagli.");
      return;
    }

    // Handle the submitted value (e.g., send to server, store, etc.)
    Alert.alert("Successo", `Dettagli inseriti: ${inputValue}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inserisci altri dettagli</Text>
      <TextInput
        style={styles.input}
        placeholder="Inserisci i dettagli"
        value={inputValue}
        onChangeText={setInputValue}
      />
      <Button title="Invia" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
});
