import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface GestioneAttivitaProps {
  onCategorySelect: (category: string) => void;
}

const categories = [
  { name: 'Trasporti', icon: 'bus' },
  { name: 'Casa', icon: 'home' },
  { name: 'Alimentazione', icon: 'food' },
  { name: 'Altro', icon: 'dots-horizontal' },
];

const GestioneAttivitaComponent: React.FC<GestioneAttivitaProps> = ({ onCategorySelect }) => {
  return (
    <LinearGradient
      colors={['#4CAF50', '#2196F3']}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Gestione Attività</Text>
        <View style={styles.grid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.name}
              style={styles.button}
              onPress={() => onCategorySelect(cat.name)}
              activeOpacity={0.85}
              accessibilityLabel={`Seleziona categoria ${cat.name}`}
              accessibilityRole="button"
            >
              <View style={styles.iconWrapper}>
                <Icon name={cat.icon} size={48} color="#fff" />
              </View>
              <Text style={styles.buttonText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width > 400 ? 140 : 110;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 28,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 18,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
    elevation: 6,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  iconWrapper: {
    backgroundColor: 'rgba(76,175,80,0.18)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default GestioneAttivitaComponent;
