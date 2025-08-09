import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Play, Eye } from 'lucide-react';
import { tracker } from '../tracking/tracker';
import { setupMonacoTracking } from '../tracking/monacoHooks';
import { setupIdleTracking } from '../tracking/idle';

interface EditorPaneProps {
  theme: 'light' | 'dark';
  font: string;
}

const EditorPane: React.FC<EditorPaneProps> = ({ theme, font }) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Setup Monaco change tracking
    setupMonacoTracking(editor, monaco);
    
    // Focus the editor to start timing
    editor.focus();
    
    // Setup idle tracking on the container
    if (containerRef.current) {
      setupIdleTracking(containerRef.current);
    }
    
    // Mark editor as ready
    tracker.markEditorReady();
  };

  const executeCode = () => {
    if (!editorRef.current) return;
    
    setIsExecuting(true);
    tracker.recordUIFiddle('code-execution');
    
    const code = editorRef.current.getValue();
    
    // Simple HTML/JS execution
    try {
      // Check if it's HTML content
      if (code.includes('<html>') || code.includes('<!DOCTYPE') || code.includes('<body>') || code.includes('<div>')) {
        // HTML content - render directly
        setPreviewContent(code);
      } else {
        // JavaScript content - wrap in HTML and execute
        const htmlWrapper = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                padding: 20px; 
                background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
                color: ${theme === 'dark' ? '#ffffff' : '#000000'};
              }
              .output { 
                background: ${theme === 'dark' ? '#2a2a2a' : '#f5f5f5'}; 
                padding: 10px; 
                border-radius: 8px; 
                margin: 10px 0;
                border: 1px solid ${theme === 'dark' ? '#444' : '#ddd'};
              }
            </style>
          </head>
          <body>
            <div id="output"></div>
            <script>
              // Override console.log to display in the page
              const originalLog = console.log;
              console.log = function(...args) {
                const output = document.getElementById('output');
                const div = document.createElement('div');
                div.className = 'output';
                div.textContent = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                output.appendChild(div);
                originalLog.apply(console, args);
              };
              
              // Wrap user code in try-catch
              try {
                ${code}
              } catch (error) {
                console.log('Error: ' + error.message);
              }
            </script>
          </body>
          </html>
        `;
        setPreviewContent(htmlWrapper);
      }
      setShowPreview(true);
    } catch (error) {
      console.error('Execution error:', error);
      setPreviewContent(`
        <html>
          <body style="font-family: monospace; padding: 20px; background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'}; color: ${theme === 'dark' ? '#ff6b6b' : '#d63031'};">
            <h3>Execution Error:</h3>
            <pre>${error}</pre>
          </body>
        </html>
      `);
      setShowPreview(true);
    }
    
    setTimeout(() => setIsExecuting(false), 500);
  };

  const initialCode = `// Welcome to the Anti-Productivity IDE!
// Your procrastination is being tracked in real-time.
// Try some of these to see the magic happen:
//
// 1. Type something, then Ctrl+Z it away (undo churn)
// 2. Switch to another tab and come back (tab surfing)
// 3. Just stare at this screen for a while (idle time)
// 4. Toggle the theme a bunch of times (UI fiddling)
// 5. Type something, undo it, then type the same thing again (net-zero loops)
// 6. Click the Run button to execute your code (more procrastination!)
//
// The dashboard on the right tracks all your anti-productive behaviors
// with some cheeky commentary. No judgment here, we've all been there! 😉

// Try this JavaScript code:
function procrastinate() {
  console.log("🎯 I should be working...");
  console.log("🤔 But first, let me test this code runner");
  console.log("✨ Actually, this is pretty cool!");
  
  for (let i = 1; i <= 5; i++) {
    console.log(\`Step \${i}: Still procrastinating...\`);
  }
  
  return "Mission accomplished! 🎉";
}

console.log(procrastinate());

// Or try some HTML:
/*
<!DOCTYPE html>
<html>
<head>
  <title>My Procrastination Page</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      text-align: center; 
      padding: 50px;
      background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      background: rgba(255,255,255,0.1);
      padding: 30px;
      border-radius: 15px;
      backdrop-filter: blur(10px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 Welcome to My Creative Procrastination!</h1>
    <p>This is way more fun than actual work...</p>
    <button onclick="alert('Still procrastinating! 😄')">Click me!</button>
  </div>
</body>
</html>
*/
`;

  return (
    <div ref={containerRef} className="h-full relative flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Code Editor
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={executeCode}
            disabled={isExecuting}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isExecuting 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 hover:scale-105'
            }`}
            title="Execute code"
          >
            <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Running...' : 'Run'}</span>
          </button>
          {showPreview && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 hover:scale-105"
              title="Toggle preview"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="flex-1 flex">
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
          <Editor
            height="100%"
            defaultLanguage="typescript"
            defaultValue={initialCode}
            theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
            onMount={handleEditorDidMount}
            options={{
              automaticLayout: true,
              fontFamily: font,
              minimap: { enabled: false },
              smoothScrolling: true,
              wordWrap: 'on',
              fontLigatures: true,
              fontSize: 15,
              lineHeight: 22,
              padding: { top: 20, bottom: 20 },
              scrollBeyondLastLine: false,
              renderLineHighlight: 'gutter',
              selectionHighlight: false,
              occurrencesHighlight: false,
              quickSuggestions: false,
              parameterHints: { enabled: false },
              suggestOnTriggerCharacters: false,
              cursorBlinking: 'smooth',
            }}
          />
        </div>
        
        {/* Preview Pane */}
        {showPreview && (
          <div className="w-1/2 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="h-full flex flex-col">
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Output Preview
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  srcDoc={previewContent}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin"
                  title="Code Preview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPane;