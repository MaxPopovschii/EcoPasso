export interface Goal {
  id: number;
  title: string;           // invece di title
  description: string;    // aggiunto campo descrizione
  targetValue: number;    // invece di target
  currentValue: number;   // invece di current
  measureUnit: string;    // invece di unit
  startDate: Date;
  endDate?: Date;        // invece di deadline
  status: 'active' | 'completed' | 'failed';
  type: string;
}