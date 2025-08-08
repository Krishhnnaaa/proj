import { useEffect } from 'react';
import { tracker } from './tracker';

export const usePageVisibility = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      tracker.recordVisibilityChange(isVisible);
    };

    // Set initial state
    handleVisibilityChange();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

export const isDocumentVisible = (): boolean => {
  return document.visibilityState === 'visible';
};