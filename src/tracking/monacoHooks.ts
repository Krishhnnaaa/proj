import { tracker } from './tracker';
import type { editor } from 'monaco-editor';

export const setupMonacoTracking = (
  editorInstance: editor.IStandaloneCodeEditor,
  monaco: any
) => {
  let lastContent = editorInstance.getValue();

  // Track all content changes
  editorInstance.onDidChangeModelContent((event) => {
    const currentContent = editorInstance.getValue();
    
    // Use Monaco's built-in undo/redo detection
    const isUndo = event.isUndoing || false;
    const isRedo = event.isRedoing || false;
    
    tracker.recordContentChange(currentContent, isUndo, isRedo);
    
    lastContent = currentContent;
  });

  // Track focus events
  editorInstance.onDidFocusEditorText(() => {
    tracker.recordActivity();
  });

  editorInstance.onDidBlurEditorText(() => {
    // Editor lost focus - could be switching to another app
  });
};