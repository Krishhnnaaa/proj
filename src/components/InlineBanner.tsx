import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface InlineBannerProps {
  message: string;
  type: string;
  onDismiss: () => void;
}

const InlineBanner: React.FC<InlineBannerProps> = ({ message, type, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Wait for animation to complete
    }, 4000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getTypeColor = () => {
    switch (type) {
      case 'undo-churn': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
      case 'net-zero': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200';
      case 'ui-fiddle': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'tab-switch': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200';
      case 'warm-up': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'idle': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`
      ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      transition-all duration-500 ease-out
      px-6 py-4 border-b shadow-sm
      relative z-[100]
      ${getTypeColor()}
    `}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 hover:scale-105"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InlineBanner;