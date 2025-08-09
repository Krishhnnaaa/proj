import React, { useState, useEffect } from 'react';
import EditorPane from './components/EditorPane';
import SidePanel from './components/SidePanel';
import InlineBanner from './components/InlineBanner';
import StatusBar from './components/StatusBar';
import { tracker, TrackerData } from './tracking/tracker';
import { usePageVisibility } from './tracking/visibility';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    localStorage.getItem('theme') as 'light' | 'dark' || 'dark'
  );
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [trackerData, setTrackerData] = useState<TrackerData>(tracker.getData());
  const [bannerMessage, setBannerMessage] = useState<{ text: string; type: string } | null>(null);

  // Subscribe to tracker updates
  useEffect(() => {
    const unsubscribe = tracker.subscribe((data) => {
      setTrackerData(data);
    });
    return unsubscribe;
  }, []);

  // Subscribe to banner messages
  useEffect(() => {
    const unsubscribe = tracker.onBanner((message, type) => {
      setBannerMessage({ text: message, type });
    });
    return unsubscribe;
  }, []);

  // Page visibility tracking
  usePageVisibility();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    tracker.recordUIFiddle('theme-toggle');
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
    tracker.recordUIFiddle('panel-toggle');
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">Anti-Productivity IDE</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Track your procrastination in real-time
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={togglePanel}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle dashboard"
            >
              📊
            </button>
          </div>
        </header>

        {/* Banner */}
        {bannerMessage && (
          <InlineBanner
            message={bannerMessage.text}
            type={bannerMessage.type}
            onDismiss={() => setBannerMessage(null)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          <div className={`transition-all duration-300 ${isPanelOpen ? 'flex-1' : 'w-full'}`}>
            <EditorPane theme={theme} />
          </div>
          
          {isPanelOpen && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700">
              <SidePanel data={trackerData} onClose={() => setIsPanelOpen(false)} />
            </div>
          )}
        </div>

        {/* Status Bar */}
        <StatusBar data={trackerData} theme={theme} />
      </div>
    </div>
  );
}

export default App;