import SERVER from '@/constants/Api';
import { useAuthContext } from '@/utils/authContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface HomePageProps {
  email: string;
  avatar: string | undefined;
}

interface Statistics {
  monthly: number[];
  yearly: number[];
}

const HomePageComponent: React.FC<HomePageProps> = ({ email, avatar }) => {
  const { token } = useAuthContext();
  const [statistics, setStatistics] = useState<Statistics>({ monthly: [], yearly: [] });
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentYear = () => new Date().getFullYear();
  const getMonthName = (index: number) => {
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return months[index];
  };

  const hasData = () => {
    return statistics.monthly.some(value => value > 0) || statistics.yearly.some(value => value > 0);
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${SERVER}/statistics/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (!response.ok) throw new Error('Errore nel recupero delle statistiche');
        const data = await response.json();
        setStatistics({
          monthly: Array.isArray(data.monthly) ? data.monthly : new Array(12).fill(0),
          yearly: Array.isArray(data.yearly) ? data.yearly : [],
        });
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        setStatistics({
          monthly: new Array(12).fill(0),
          yearly: new Array(5).fill(0)
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [email, token]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.gradientBackground}>
        <View style={styles.header}>
          <Image
            source={avatar ? { uri: avatar } : require('@/assets/avatar-placeholder.png')}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{email}</Text>
        </View>

        {hasData() ? (
          <>
            {/* Grafico statistiche mensili */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Statistiche Mensili</Text>
              <LineChart
                data={{
                  labels: Array.from({ length: 12 }, (_, i) => getMonthName(i)),
                  datasets: [{
                    data: statistics.monthly
                  }]
                }}
                width={screenWidth - 40}
                height={220}
                yAxisSuffix=" kg"
                chartConfig={chartConfig}
                style={styles.chart}
                bezier
              />
            </View>

            {/* Grafico statistiche annuali */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Statistiche Annuali</Text>
              <BarChart
                data={{
                  labels: Array.from({ length: statistics.yearly.length }, (_, i) => `${getCurrentYear() - statistics.yearly.length + 1 + i}`),
                  datasets: [{
                    data: statistics.yearly
                  }]
                }}
                width={screenWidth - 40}
                height={220}
                yAxisSuffix=" kg"
                yAxisLabel=''
                chartConfig={chartConfig}
                style={styles.chart}
              />
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataTitle}>
              Nessuna Attività Tracciata
            </Text>
            <Text style={styles.noDataText}>
              Non hai ancora registrato nessuna attività.{'\n'}
              Inizia a tracciare le tue attività quotidiane per vedere le statistiche della tua impronta ecologica!
            </Text>
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 3,
  barPercentage: 0.7,
  decimalPlaces: 0,
  propsForLabels: {
    fontSize: 12,
    fontWeight: '600',
  },
  propsForVerticalLabels: {
    fontSize: 10,
  },
  fillShadowGradientFrom: '#4CAF50',
  fillShadowGradientTo: '#ffffff',
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  gradientBackground: {
    minHeight: Dimensions.get('window').height,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#e0e0e0',
  },
  userName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noDataContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noDataTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    paddingVertical: 8,
    alignSelf: 'center',
  },
});

export default HomePageComponent;
