import { useBadge } from '@/contexts/BadgeContext';
import React from 'react';
import BadgeUnlockModal from './modals/BadgeUnlockModal';

export const GlobalBadgeModal = () => {
  const { currentBadge, showBadgeUnlock } = useBadge();

  return (
    <BadgeUnlockModal
      visible={!!currentBadge}
      badge={currentBadge}
      onClose={() => showBadgeUnlock(null)}
    />
  );
};