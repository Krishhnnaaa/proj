import { tracker } from './tracker';

export const setupIdleTracking = (element: HTMLElement) => {
  const events = ['keydown', 'mousemove', 'click', 'scroll', 'touchstart'];
  
  const handleActivity = () => {
    tracker.recordActivity();
  };

  events.forEach(eventName => {
    element.addEventListener(eventName, handleActivity, { passive: true });
  });

  // Return cleanup function
  return () => {
    events.forEach(eventName => {
      element.removeEventListener(eventName, handleActivity);
    });
  };
};