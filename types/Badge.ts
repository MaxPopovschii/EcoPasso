export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
  progress?: number;
  requirementType: 'streak' | 'total' | 'milestone';
  requirementValue: number;
  category?: string;
}

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 1,
    name: 'Eco Rookie',
    description: 'Accedi per 5 giorni consecutivi',
    icon: '🌱',
    achieved: false,
    requirementType: 'streak',
    requirementValue: 5,
    category: 'Engagement'
  },
  {
    id: 2,
    name: 'Green Explorer',
    description: 'Registra la tua prima attività ecologica',
    icon: '🌍',
    achieved: false,
    requirementType: 'total',
    requirementValue: 1,
    category: 'Activities'
  },
  {
    id: 3,
    name: 'Eco Warrior',
    description: 'Completa 10 attività ecologiche',
    icon: '♻️',
    achieved: false,
    requirementType: 'milestone',
    requirementValue: 10,
    category: 'Activities'
  },
  {
    id: 4,
    name: 'Transport Hero',
    description: 'Usa mezzi di trasporto ecologici per 7 giorni',
    icon: '🚲',
    achieved: false,
    requirementType: 'streak',
    requirementValue: 7,
    category: 'Transport'
  },
  {
    id: 5,
    name: 'Energy Saver',
    description: 'Riduci il consumo energetico del 20%',
    icon: '⚡',
    achieved: false,
    requirementType: 'milestone',
    requirementValue: 20,
    category: 'Energy'
  },
  {
    id: 6,
    name: 'Water Guardian',
    description: 'Monitora il consumo d\'acqua per 30 giorni',
    icon: '💧',
    achieved: false,
    requirementType: 'streak',
    requirementValue: 30,
    category: 'Water'
  },
  {
    id: 7,
    name: 'Waste Reducer',
    description: 'Registra 15 attività di riciclaggio',
    icon: '🗑️',
    achieved: false,
    requirementType: 'total',
    requirementValue: 15,
    category: 'Waste'
  },
  {
    id: 8,
    name: 'Eco Master',
    description: 'Ottieni tutti i badge precedenti',
    icon: '🏆',
    achieved: false,
    requirementType: 'milestone',
    requirementValue: 7,
    category: 'Achievement'
  }
];