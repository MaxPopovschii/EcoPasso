import { Badge } from '@/types/Badge';
import React, { createContext, useContext, useState } from 'react';

interface BadgeContextType {
  showBadgeUnlock: (badge: Badge) => void;
  currentBadge: Badge | null;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const BadgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);

  const showBadgeUnlock = (badge: Badge) => {
    setCurrentBadge(badge);
  };

  const value = React.useMemo(
    () => ({ showBadgeUnlock, currentBadge }),
    [showBadgeUnlock, currentBadge]
  );

  return (
    <BadgeContext.Provider value={value}>
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadge = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('useBadge must be used within a BadgeProvider');
  }
  return context;
};