import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface HomePageProps {
  userName: string;
  avatar: string | undefined;
  statistics: { week: number[]; month: number[] };
}

const HomePageComponent: React.FC<HomePageProps> = ({ userName, avatar, statistics }) => {
  return (
        <ScrollView style={styles.container}>
          <LinearGradient
          colors={['#4CAF50', '#2196F3']} 
          style={styles.gradientBackground}
          >
          {/* Avatar e nome utente */}
          <View style={styles.header}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{userName}</Text>
          </View>

          {/* Grafico delle statistiche settimanali */}
          <Text style={styles.chartTitle}>Statistiche Settimanali</Text>
          <LineChart
            data={{
              labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
              datasets: [
                {
                  data: statistics.week.length > 0 ? statistics.week : [0, 0, 0, 0, 0, 0, 0],
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
          />

          {/* Grafico delle statistiche mensili */}
          <Text style={styles.chartTitle}>Statistiche Mensili</Text>
          <BarChart
            data={{
              labels: ['Set 1', 'Set 2', 'Set 3', 'Set 4'],
              datasets: [
                {
                  data: statistics.month.length > 0 ? statistics.month : [0, 0, 0, 0],
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="€"
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
          />
          {/* Grafico delle statistiche mensili */}
          <Text style={styles.chartTitle}>Statistiche Mensili</Text>
          <BarChart
            data={{
              labels: ['Set 1', 'Set 2', 'Set 3', 'Set 4'],
              datasets: [
                {
                  data: statistics.month.length > 0 ? statistics.month : [0, 0, 0, 0],
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="€"
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
          />
          </LinearGradient>
        </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#f5f5f5',
  backgroundGradientTo: '#f5f5f5',
  color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  userName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  chart: {
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default HomePageComponent;
