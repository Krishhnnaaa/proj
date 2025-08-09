import React from 'react';
import { Clock, RotateCcw, RotateCw, Zap, Eye, Target } from 'lucide-react';
import { TrackerData } from '../tracking/tracker';

interface SidePanelProps {
  data: TrackerData;
}

const SidePanel: React.FC<SidePanelProps> = ({ data }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  const formatMinutes = (ms: number) => {
    return (ms / 60000).toFixed(1);
  };

  return (
    <div className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Anti-Productivity Dashboard
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Recent Quips - Moved to top */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Recent Quips
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {data.recentQuips.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic p-4 text-center">
                No quips yet. Start procrastinating to see some!
              </div>
            ) : (
              data.recentQuips.map((quip, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                    {new Date(quip.timestamp).toLocaleTimeString()} • {quip.type}
                  </div>
                  <div className="text-sm leading-relaxed">{quip.message}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* KPIs */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Live Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Wasted</span>
              </div>
              <div className="text-xl font-bold text-red-500">
                {formatMinutes(data.metrics.hiddenMs + data.metrics.idleMs)}m
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-1">
                <Eye className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tab Switches</span>
              </div>
              <div className="text-xl font-bold text-orange-500">
                {data.metrics.interruptions}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-1">
                <RotateCcw className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Undos</span>
              </div>
              <div className="text-xl font-bold text-blue-500">
                {data.metrics.undoCount}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-1">
                <RotateCw className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Redos</span>
              </div>
              <div className="text-xl font-bold text-green-500">
                {data.metrics.redoCount}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Net-Zero</span>
              </div>
              <div className="text-xl font-bold text-purple-500">
                {data.metrics.netZeroEditLoops}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">UI Fiddles</span>
              </div>
              <div className="text-xl font-bold text-yellow-500">
                {data.metrics.uiFiddleCount}
              </div>
            </div>
          </div>
          
          {/* Additional metrics */}
          <div className="mt-6 space-y-3">
            {data.metrics.firstEditDelayMs > 0 && (
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Warm-up delay</div>
                <div className="text-sm font-semibold">{formatTime(data.metrics.firstEditDelayMs)}</div>
              </div>
            )}
            {data.metrics.activeMs > 0 && (
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Context drift</div>
                <div className="text-sm font-semibold">
                  {((data.metrics.uiFiddleTime / Math.max(data.metrics.activeMs, 1)) * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Anti-tasks Stream */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Anti-tasks Stream
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
            {data.events.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
                All quiet on the procrastination front...
              </div>
            ) : (
              data.events.slice(-10).map((event, index) => (
                <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                  <span className="font-medium">{event.type}</span>
                  <span className="text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;