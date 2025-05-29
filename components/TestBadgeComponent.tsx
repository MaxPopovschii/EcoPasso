import { useBadge } from '@/contexts/BadgeContext';
import { AVAILABLE_BADGES } from '@/types/Badge';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

export const TestBadgeComponent = () => {
  const { showBadgeUnlock } = useBadge();

  const simulateLoginStreak = () => {
    const ecoRookieBadge = AVAILABLE_BADGES.find(b => b.id === 1);
    if (ecoRookieBadge) {
      showBadgeUnlock(ecoRookieBadge);
    }
  };

  const simulateEcoActivities = () => {
    const ecoWarriorBadge = AVAILABLE_BADGES.find(b => b.id === 3);
    if (ecoWarriorBadge) {
      showBadgeUnlock(ecoWarriorBadge);
    }
  };

  const simulateTransportHero = () => {
    const transportHeroBadge = AVAILABLE_BADGES.find(b => b.id === 4);
    if (transportHeroBadge) {
      showBadgeUnlock(transportHeroBadge);
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Simula 5 giorni di login" 
        onPress={simulateLoginStreak} 
      />
      <Button 
        title="Simula 10 attività eco" 
        onPress={simulateEcoActivities} 
      />
      <Button 
        title="Simula trasporto eco" 
        onPress={simulateTransportHero} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10
  }
});