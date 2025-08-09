import React from 'react';
import { TrackerData } from '../tracking/tracker';

interface StatusBarProps {
  data: TrackerData;
  theme: 'light' | 'dark';
}

const StatusBar: React.FC<StatusBarProps> = ({ data, theme }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  const getChipClass = (color: string) => {
    const baseClass = "px-2 py-1 text-xs rounded-full border";
    switch (color) {
      case 'blue': return `${baseClass} bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300`;
      case 'red': return `${baseClass} bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300`;
      case 'orange': return `${baseClass} bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300`;
      case 'green': return `${baseClass} bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300`;
      default: return `${baseClass} bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300`;
    }
  };

  return (
    <footer className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 text-sm shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Session:</span>
          <span className="font-bold">
            {formatTime(data.metrics.activeMs + data.metrics.idleMs + data.metrics.hiddenMs)}
          </span>
        </div>
        
        {data.metrics.currentlyIdle && (
          <div className={getChipClass('red')}>
            Idle {formatTime(data.metrics.idleMs)}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {data.metrics.undoCount + data.metrics.redoCount > 5 && (
          <div className={getChipClass('blue')}>
            Undo loops ×{Math.floor((data.metrics.undoCount + data.metrics.redoCount) / 6)}
          </div>
        )}
        
        {data.metrics.interruptions > 2 && (
          <div className={getChipClass('orange')}>
            Tab switches ×{data.metrics.interruptions}
          </div>
        )}
        
        {data.metrics.netZeroEditLoops > 0 && (
          <div className={getChipClass('green')}>
            Net-zero ×{data.metrics.netZeroEditLoops}
          </div>
        )}
        
        <div className="text-gray-500 dark:text-gray-400 font-medium">
          {theme === 'dark' ? '🌙' : '☀️'} {theme}
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;