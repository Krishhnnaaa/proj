import { tracker } from './tracker';
import type { editor } from 'monaco-editor';

export const setupMonacoTracking = (
  editorInstance: editor.IStandaloneCodeEditor,
  monaco: any
) => {
  let lastContent = editorInstance.getValue();
  let lastChangeTime = Date.now();
  let pendingChanges: any[] = [];

  // Track all content changes
  editorInstance.onDidChangeModelContent((event) => {
    const currentContent = editorInstance.getValue();
    const now = Date.now();
    
    // Detect undo/redo by analyzing the change pattern
    const isUndo = detectUndo(event, currentContent, now);
    const isRedo = detectRedo(event, currentContent, now);
    
    tracker.recordContentChange(currentContent, isUndo, isRedo);
    
    lastContent = currentContent;
    lastChangeTime = now;
    
    // Store recent changes for undo/redo detection
    pendingChanges.push({
      content: currentContent,
      timestamp: now,
      contentLength: currentContent.length,
      changes: event.changes,
    });
    
    // Keep only recent changes (last 10 seconds)
    pendingChanges = pendingChanges.filter(change => now - change.timestamp < 10000);
  });

  // Track focus events
  editorInstance.onDidFocusEditorText(() => {
    tracker.recordActivity();
  });

  editorInstance.onDidBlurEditorText(() => {
    // Editor lost focus - could be switching to another app
  });
};

// Heuristic to detect undo operations
const detectUndo = (event: any, currentContent: string, timestamp: number): boolean => {
  // Check if the change looks like an undo:
  // - Usually removes content or makes significant changes
  // - Often happens in quick succession after regular edits
  // - Content often becomes shorter or reverts to a previous state
  
  if (event.changes.length === 1) {
    const change = event.changes[0];
    // If it's removing content and the range is significant
    if (change.text === '' && change.range.endColumn - change.range.startColumn > 1) {
      return true;
    }
    // If it's replacing content with something much shorter
    if (change.text.length < (change.range.endColumn - change.range.startColumn) / 2) {
      return true;
    }
  }
  
  return false;
};

// Heuristic to detect redo operations
const detectRedo = (event: any, currentContent: string, timestamp: number): boolean => {
  // Check if the change looks like a redo:
  // - Usually adds content back
  // - Often happens after an undo
  // - Content length typically increases
  
  if (event.changes.length === 1) {
    const change = event.changes[0];
    // If it's adding content where there was little before
    if (change.text.length > (change.range.endColumn - change.range.startColumn) * 2) {
      return true;
    }
  }
  
  return false;
};