import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface GestioneAttivitaProps {
  onCategorySelect: (category: string) => void; // Funzione per gestire la selezione della categoria
}

const GestioneAttivitaComponent: React.FC<GestioneAttivitaProps> = ({ onCategorySelect }) => {
  const categories = [
    { name: 'Trasporti', icon: 'bus' },
    { name: 'Casa', icon: 'home' },
    { name: 'Alimentazione', icon: 'food' },
    { name: 'Altro', icon: 'dots-horizontal' },
  ];

  return (
    <LinearGradient
      colors={['#4CAF50', '#2196F3']}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Gestione Attività</Text>

        <View style={styles.gridContainer}>
          <TouchableOpacity
                key={categories[0].name}
                style={styles.button}
                onPress={() => onCategorySelect(categories[0].name)}
              >
                <Icon name={categories[0].icon} size={60} color="#fff" />
                <Text style={styles.buttonText}>{categories[0].name}</Text>
              </TouchableOpacity>
        </View>
        <View style={styles.gridContainer}>
          <TouchableOpacity
                key={categories[1].name}
                style={styles.button}
                onPress={() => onCategorySelect(categories[1].name)}
              >
                <Icon name={categories[1].icon} size={60} color="#fff" />
                <Text style={styles.buttonText}>{categories[1].name}</Text>
              </TouchableOpacity>
        </View>
        <View style={styles.gridContainer}>
          <TouchableOpacity
                key={categories[2].name}
                style={styles.button}
                onPress={() => onCategorySelect(categories[2].name)}
              >
                <Icon name={categories[2].icon} size={60} color="#fff" />
                <Text style={styles.buttonText}>{categories[2].name}</Text>
              </TouchableOpacity>
        </View>
        <View style={styles.gridContainer}>
          <TouchableOpacity
                key={categories[3].name}
                style={styles.button}
                onPress={() => onCategorySelect(categories[3].name)}
              >
                <Icon name={categories[3].icon} size={60} color="#fff" />
                <Text style={styles.buttonText}>{categories[3].name}</Text>
              </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    flexDirection:'row',
    flexWrap:'wrap',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    margin : 5,
    alignSelf :'center',
    justifyContent:'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 130,
    height: 130,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    elevation: 5,
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default GestioneAttivitaComponent;
