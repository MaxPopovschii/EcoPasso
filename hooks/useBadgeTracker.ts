import SERVER from '@/constants/Api';
import { useBadge } from '@/contexts/BadgeContext';
import { AVAILABLE_BADGES } from '@/types/Badge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface BadgeProgress {
  lastLoginDate: string;
  currentStreak: number;
  activitiesCount: number;
}

export const useBadgeTracker = (token: string | null, userEmail: string | null) => {
  const { showBadgeUnlock } = useBadge();
  const [progress, setProgress] = useState<BadgeProgress>({
    lastLoginDate: new Date().toISOString(),
    currentStreak: 0,
    activitiesCount: 0
  });

  // Carica il progresso salvato
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem(`@badge_progress_${userEmail}`);
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        }
      } catch (error) {
        console.error('Errore nel caricamento del progresso:', error);
      }
    };

    if (userEmail) {
      loadProgress();
    }
  }, [userEmail]);

  // Verifica login streak
  useEffect(() => {
    const checkLoginStreak = async () => {
      try {
        const lastLogin = new Date(progress.lastLoginDate);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

        let newStreak = progress.currentStreak;
        if (diffDays === 1) {
          // Login consecutivo
          newStreak += 1;
        } else if (diffDays > 1) {
          // Streak interrotto
          newStreak = 1;
        }

        // Aggiorna il progresso
        const newProgress = {
          ...progress,
          lastLoginDate: today.toISOString(),
          currentStreak: newStreak
        };

        // Salva il nuovo progresso
        await AsyncStorage.setItem(
          `@badge_progress_${userEmail}`,
          JSON.stringify(newProgress)
        );
        setProgress(newProgress);

        // Se raggiungiamo 5 giorni, assegna il badge
        if (newStreak >= 5) {
          await assignBadge(1); // ID del badge 'Eco Rookie'
        }

      } catch (error) {
        console.error('Errore nel controllo dello streak:', error);
      }
    };

    if (userEmail && token) {
      checkLoginStreak();
    }
  }, [userEmail, token]);

  // Assegna i badge in base ai progressi
  useEffect(() => {
    const checkBadges = async () => {
      try {
        // Verifica login streak
        if (progress.currentStreak === 5) {
          const ecoRookieBadge = AVAILABLE_BADGES.find(b => b.id === 1);
          if (ecoRookieBadge) {
            showBadgeUnlock(ecoRookieBadge);
          }
        }

        // Verifica numero attività
        if (progress.activitiesCount === 10) {
          const ecoWarriorBadge = AVAILABLE_BADGES.find(b => b.id === 3);
          if (ecoWarriorBadge) {
            showBadgeUnlock(ecoWarriorBadge);
          }
        }
      } catch (error) {
        console.error('Error checking badges:', error);
      }
    };

    checkBadges();
  }, [progress.currentStreak, progress.activitiesCount]);

  const assignBadge = async (badgeId: number) => {
    if (!userEmail || !token) return;

    try {
      const response = await fetch(`${SERVER}/api/users/${userEmail}/badges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          badgeId,
          earnedDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Errore nell\'assegnazione del badge');
      }

      // Aggiorna la UI con il nuovo badge
      return true;
    } catch (error) {
      console.error('Errore nell\'assegnazione del badge:', error);
      return false;
    }
  };

  return { progress, assignBadge };
};