import React, { useState, useEffect } from 'react';
import { Palette, Type, Settings } from 'lucide-react';
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
  const [editorFont, setEditorFont] = useState<string>(() => 
    localStorage.getItem('editorFont') || 'Monaco'
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(() => 
    localStorage.getItem('backgroundColor') || 'default'
  );
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
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

  const changeFont = (font: string) => {
    setEditorFont(font);
    localStorage.setItem('editorFont', font);
    setShowFontMenu(false);
    tracker.recordUIFiddle('font-change');
  };

  const changeBackgroundColor = (color: string) => {
    setBackgroundColor(color);
    localStorage.setItem('backgroundColor', color);
    setShowColorMenu(false);
    tracker.recordUIFiddle('background-change');
  };

  const togglePanel = () => {
    console.log('Toggle panel clicked, current state:', isPanelOpen);
    setIsPanelOpen(!isPanelOpen);
    tracker.recordUIFiddle('panel-toggle');
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const getBackgroundClass = () => {
    const baseClass = theme === 'dark' ? 'dark' : '';
    switch (backgroundColor) {
      case 'blue': return `${baseClass} bg-blue-50 dark:bg-blue-950`;
      case 'green': return `${baseClass} bg-green-50 dark:bg-green-950`;
      case 'purple': return `${baseClass} bg-purple-50 dark:bg-purple-950`;
      case 'pink': return `${baseClass} bg-pink-50 dark:bg-pink-950`;
      case 'orange': return `${baseClass} bg-orange-50 dark:bg-orange-950`;
      case 'teal': return `${baseClass} bg-teal-50 dark:bg-teal-950`;
      default: return `${baseClass} bg-white dark:bg-gray-900`;
    }
  };

  const fonts = [
    { name: 'Monaco', label: 'Monaco' },
    { name: 'Fira Code', label: 'Fira Code' },
    { name: 'Source Code Pro', label: 'Source Code Pro' },
    { name: 'JetBrains Mono', label: 'JetBrains Mono' },
    { name: 'Consolas', label: 'Consolas' },
    { name: 'Menlo', label: 'Menlo' },
    { name: 'Courier New', label: 'Courier New' },
  ];

  const colors = [
    { name: 'default', label: 'Default', class: 'bg-gray-100 dark:bg-gray-800' },
    { name: 'blue', label: 'Ocean Blue', class: 'bg-blue-100 dark:bg-blue-800' },
    { name: 'green', label: 'Forest Green', class: 'bg-green-100 dark:bg-green-800' },
    { name: 'purple', label: 'Royal Purple', class: 'bg-purple-100 dark:bg-purple-800' },
    { name: 'pink', label: 'Sunset Pink', class: 'bg-pink-100 dark:bg-pink-800' },
    { name: 'orange', label: 'Warm Orange', class: 'bg-orange-100 dark:bg-orange-800' },
    { name: 'teal', label: 'Cool Teal', class: 'bg-teal-100 dark:bg-teal-800' },
  ];
  return (
    <div className={`min-h-screen ${getBackgroundClass()}`}>
      <div className="flex flex-col h-screen text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Anti-Productivity IDE
            </h1>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Track your procrastination in real-time
            </span>
          </div>
          <div className="flex items-center space-x-2 relative">
            {/* Font Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFontMenu(!showFontMenu);
                  setShowColorMenu(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                title="Change font"
              >
                <Type className="w-4 h-4" />
              </button>
              {showFontMenu && (
                <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-48">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">Choose Font</div>
                    {fonts.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => changeFont(font.name)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          editorFont === font.name ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                        }`}
                        style={{ fontFamily: font.name }}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowColorMenu(!showColorMenu);
                  setShowFontMenu(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                title="Change background"
              >
                <Palette className="w-4 h-4" />
              </button>
              {showColorMenu && (
                <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-48">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">Choose Theme</div>
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => changeBackgroundColor(color.name)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                          backgroundColor === color.name ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 ${color.class}`}></div>
                        <span>{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={togglePanel}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
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
            <EditorPane theme={theme} font={editorFont} />
          </div>
          
          {isPanelOpen && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <SidePanel data={trackerData} onClose={() => setIsPanelOpen(false)} />
            </div>
          )}
        </div>

        {/* Status Bar */}
        <StatusBar data={trackerData} theme={theme} />
      </div>
      
      {/* Click outside to close menus */}
      {(showFontMenu || showColorMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowFontMenu(false);
            setShowColorMenu(false);
          }}
        />
      )}
    </div>
  );
}

export default App;