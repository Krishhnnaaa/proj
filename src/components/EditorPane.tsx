import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { tracker } from '../tracking/tracker';
import { setupMonacoTracking } from '../tracking/monacoHooks';
import { setupIdleTracking } from '../tracking/idle';

interface EditorPaneProps {
  theme: 'light' | 'dark';
}

const EditorPane: React.FC<EditorPaneProps> = ({ theme }) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const initialCode = `// Welcome to the Anti-Productivity IDE!
// Your procrastination is being tracked in real-time.
// Try some of these to see the magic happen:
//
// 1. Type something, then Ctrl+Z it away (undo churn)
// 2. Switch to another tab and come back (tab surfing)
// 3. Just stare at this screen for a while (idle time)
// 4. Toggle the theme a bunch of times (UI fiddling)
// 5. Type something, undo it, then type the same thing again (net-zero loops)
//
// The dashboard on the right tracks all your anti-productive behaviors
// with some cheeky commentary. No judgment here, we've all been there! 😉

function procrastinate() {
  console.log("I should be working...");
  // But first, let me reorganize this code
  // Actually, maybe I should try a different approach
  // Hmm, what if I just...
}

procrastinate();
`;

  return (
    <div ref={containerRef} className="h-full relative">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        defaultValue={initialCode}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          smoothScrolling: true,
          wordWrap: 'on',
          fontLigatures: true,
          fontSize: 14,
          lineHeight: 20,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          renderLineHighlight: 'gutter',
          selectionHighlight: false,
          occurrencesHighlight: false,
          quickSuggestions: false,
          parameterHints: { enabled: false },
          suggestOnTriggerCharacters: false,
        }}
      />
    </div>
  );
};

export default EditorPane;