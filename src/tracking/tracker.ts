export interface Metrics {
  activeMs: number;
  hiddenMs: number;
  idleMs: number;
  interruptions: number;
  firstEditDelayMs: number;
  undoCount: number;
  redoCount: number;
  netZeroEditLoops: number;
  uiFiddleCount: number;
  uiFiddleTime: number;
  currentlyIdle: boolean;
}

export interface Quip {
  message: string;
  type: string;
  timestamp: number;
}

export interface Event {
  type: string;
  timestamp: number;
  data?: any;
}

export interface TrackerData {
  metrics: Metrics;
  recentQuips: Quip[];
  events: Event[];
}

class AntiProductivityTracker {
  private metrics: Metrics = {
    activeMs: 0,
    hiddenMs: 0,
    idleMs: 0,
    interruptions: 0,
    firstEditDelayMs: 0,
    undoCount: 0,
    redoCount: 0,
    netZeroEditLoops: 0,
    uiFiddleCount: 0,
    uiFiddleTime: 0,
    currentlyIdle: false,
  };

  private recentQuips: Quip[] = [];
  private events: Event[] = [];
  private subscribers: ((data: TrackerData) => void)[] = [];
  private bannerSubscribers: ((message: string, type: string) => void)[] = [];
  
  private sessionStartTime = Date.now();
  private lastActiveTime = Date.now();
  private isVisible = true;
  private visibilityStartTime = Date.now();
  private lastIdleCheck = Date.now();
  private editorReady = false;
  private firstEditMade = false;
  
  // Rate limiting for banners
  private lastBannerTime = 0;
  private bannerCount = 0;
  private bannerResetTime = 0;
  
  // Content tracking for net-zero detection
  private contentHashes: { hash: string; timestamp: number }[] = [];
  private recentUndoRedoCount = 0;
  private lastUndoRedoTime = 0;

  constructor() {
    this.loadSession();
    this.startTicking();
    
    // Save session on page unload
    window.addEventListener('beforeunload', () => {
      this.saveSession();
    });
  }

  private startTicking() {
    setInterval(() => {
      const now = Date.now();
      const timeDiff = now - this.lastIdleCheck;
      
      if (this.isVisible) {
        if (now - this.lastActiveTime > 60000) { // 60s idle threshold
          this.metrics.idleMs += timeDiff;
          this.metrics.currentlyIdle = true;
          
          // Trigger idle message after 2 minutes
          if (this.metrics.idleMs > 120000 && !this.hasRecentEvent('idle-alert')) {
            this.triggerIdle();
          }
        } else {
          this.metrics.activeMs += timeDiff;
          this.metrics.currentlyIdle = false;
        }
      }
      
      this.lastIdleCheck = now;
      this.notifySubscribers();
    }, 1000);
  }

  markEditorReady() {
    this.editorReady = true;
    this.sessionStartTime = Date.now();
  }

  recordActivity() {
    this.lastActiveTime = Date.now();
    this.metrics.currentlyIdle = false;
  }

  recordVisibilityChange(isVisible: boolean) {
    const now = Date.now();
    const timeDiff = now - this.visibilityStartTime;
    
    if (this.isVisible && !isVisible) {
      // Going hidden
      this.metrics.activeMs += timeDiff;
      this.addEvent('tab-hidden');
    } else if (!this.isVisible && isVisible) {
      // Coming back
      this.metrics.hiddenMs += timeDiff;
      this.metrics.interruptions++;
      this.addEvent('tab-visible');
      this.checkTabSwitchStreak();
    }
    
    this.isVisible = isVisible;
    this.visibilityStartTime = now;
    this.notifySubscribers();
  }

  recordContentChange(content: string, isUndo = false, isRedo = false) {
    const now = Date.now();
    
    if (!this.firstEditMade && this.editorReady) {
      this.metrics.firstEditDelayMs = now - this.sessionStartTime;
      this.firstEditMade = true;
      this.addEvent('first-edit', { delay: this.metrics.firstEditDelayMs });
      
      // Check for warm-up lag
      if (this.metrics.firstEditDelayMs > 90000) {
        this.triggerWarmUpLag();
      }
    }
    
    if (isUndo) {
      this.metrics.undoCount++;
      this.recentUndoRedoCount++;
      this.lastUndoRedoTime = now;
      this.addEvent('undo');
    } else if (isRedo) {
      this.metrics.redoCount++;
      this.recentUndoRedoCount++;
      this.lastUndoRedoTime = now;
      this.addEvent('redo');
    } else {
      // Regular edit - check for net-zero loops
      this.checkNetZeroLoop(content, now);
    }
    
    // Check for undo/redo churn
    this.checkUndoRedoChurn(now);
    
    this.recordActivity();
    this.notifySubscribers();
  }

  recordUIFiddle(type: string) {
    const now = Date.now();
    this.metrics.uiFiddleCount++;
    this.metrics.uiFiddleTime += 1000; // Approximate time spent fiddling
    this.addEvent(`ui-fiddle-${type}`);
    
    // Check for UI fiddling pattern
    this.checkUIFiddling();
    
    this.notifySubscribers();
  }

  private checkNetZeroLoop(content: string, now: number) {
    const hash = this.hashContent(content);
    
    // Check if this content matches any recent hash (within 60s)
    const recentHash = this.contentHashes.find(
      h => h.hash === hash && now - h.timestamp < 60000
    );
    
    if (recentHash) {
      this.metrics.netZeroEditLoops++;
      this.triggerNetZero();
      this.addEvent('net-zero-loop');
    }
    
    // Add current hash
    this.contentHashes.push({ hash, timestamp: now });
    
    // Clean old hashes
    this.contentHashes = this.contentHashes.filter(h => now - h.timestamp < 60000);
  }

  private checkUndoRedoChurn(now: number) {
    // Reset counter if it's been more than 60s since last undo/redo
    if (now - this.lastUndoRedoTime > 60000) {
      this.recentUndoRedoCount = 0;
    }
    
    // Trigger if we have 6+ undo/redo operations in 60s
    if (this.recentUndoRedoCount >= 6) {
      this.triggerUndoChurn();
      this.recentUndoRedoCount = 0; // Reset to avoid spam
    }
  }

  private checkTabSwitchStreak() {
    const recentSwitches = this.events.filter(
      e => e.type === 'tab-visible' && Date.now() - e.timestamp < 120000
    ).length;
    
    if (recentSwitches >= 3) {
      this.triggerTabSwitchStreak();
    }
  }

  private checkUIFiddling() {
    const recentFiddles = this.events.filter(
      e => e.type.startsWith('ui-fiddle') && Date.now() - e.timestamp < 90000
    ).length;
    
    if (recentFiddles >= 3) {
      this.triggerUIFiddling();
    }
  }

  private hasRecentEvent(type: string): boolean {
    return this.events.some(
      e => e.type === type && Date.now() - e.timestamp < 60000
    );
  }

  private hashContent(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private canShowBanner(): boolean {
    const now = Date.now();
    
    // Reset counter every 10 minutes
    if (now - this.bannerResetTime > 600000) {
      this.bannerCount = 0;
      this.bannerResetTime = now;
    }
    
    // Rate limits: max 1 per minute, max 3 per 10 minutes
    if (now - this.lastBannerTime < 60000) return false;
    if (this.bannerCount >= 3) return false;
    
    return true;
  }

  private showBanner(message: string, type: string) {
    if (this.canShowBanner()) {
      this.lastBannerTime = Date.now();
      this.bannerCount++;
      this.bannerSubscribers.forEach(callback => callback(message, type));
    }
    
    // Always add to quips, even if banner is rate limited
    this.addQuip(message, type);
  }

  private addQuip(message: string, type: string) {
    this.recentQuips.unshift({ message, type, timestamp: Date.now() });
    if (this.recentQuips.length > 20) {
      this.recentQuips.pop();
    }
  }

  private addEvent(type: string, data?: any) {
    this.events.push({ type, timestamp: Date.now(), data });
    if (this.events.length > 100) {
      this.events.shift();
    }
  }

  // Trigger methods with cheeky messages
  private triggerUndoChurn() {
    const messages = [
      "Ctrl+Z is tired. Your code? Not so much. Carry on, champion of circles.",
      "That's some impressive digital yo-yo action right there.",
      "Undo, redo, repeat. The sacred dance of indecision continues.",
      "Your keyboard's Z key is filing for workers' compensation.",
      "Achievement unlocked: Master of the Eternal Loop. Population: you.",
      "Plot twist: the code was fine the first time. But who's counting?",
    ];
    this.showBanner(messages[Math.floor(Math.random() * messages.length)], 'undo-churn');
  }

  private triggerNetZero() {
    const messages = [
      "You typed, you untyped, you conquered absolutely nothing. Iconic.",
      "Full circle back to square one. That's some philosophical coding right there.",
      "Net progress: zero. Net entertainment value: priceless.",
      "Like a digital boomerang, but less productive.",
      "You've successfully achieved quantum coding - existing in all states simultaneously.",
      "The code that was, is, and shall be again. Very zen.",
    ];
    this.showBanner(messages[Math.floor(Math.random() * messages.length)], 'net-zero');
  }

  private triggerUIFiddling() {
    const messages = [
      "New theme, same vibes. Procrastination now in Dark+.",
      "Rearranging deck chairs on the Titanic, but make it aesthetic.",
      "Perfect UI setup achieved. Time to code? Nah, let's tweak it more.",
      "Your IDE is now 2% more beautiful and 0% more productive. Worth it.",
      "Marie Kondo would be proud of all this interface organizing.",
      "The real code was the themes we toggled along the way.",
    ];
    this.showBanner(messages[Math.floor(Math.random() * messages.length)], 'ui-fiddle');
  }

  private triggerTabSwitchStreak() {
    const messages = [
      "Alt+Tab cardio complete. Hydrate. Then… continue not coding.",
      "Tab surfing champion reporting for duty. Waves are looking good today.",
      "That's some Olympic-level tab gymnastics right there.",
      "Internet successfully checked. All tabs accounted for. Panic averted.",
      "Professional multitasker at work. The task? Avoiding the actual task.",
      "Your browser tabs are a monument to possibility and procrastination.",
    ];
    this.showBanner(messages[Math.floor(Math.random() * messages.length)], 'tab-switch');
  }

  private triggerWarmUpLag() {
    const messages = [
      "Pre-game stretches taking longer than the game. Olympic level.",
      "Thorough preparation is key. Or maybe you just got distracted. Both valid.",
      "That was some serious contemplation time. The code appreciates the buildup.",
      "Slow and steady wins the... actually, just slow. But that's fine too.",
      "Extended warm-up complete. Your keyboard is now properly seasoned.",
      "The dramatic pause before coding. Like a pianist before a concert.",
    ];
    this.showBanner(messages[Math.floor(Math.random() * messages.length)], 'warm-up');
  }

  private triggerIdle() {
    const messages = [
      "Screen: on. Ambition: off. Perfect balance restored.",
      "Achieving zen through strategic inactivity. Mindfulness level: expert.",
      "Your cursor is blinking hopefully. It believes in you more than you do.",
      "Professional staring contest with your code. Current score: Code 1, You 0.",
      "Taking 'think before you code' to new philosophical heights.",
      "The code is patiently waiting. It's very understanding about these things.",
    ];
    this.showBanner(messages[Math.floor(Math.random() * messages.length)], 'idle');
    this.addEvent('idle-alert');
  }

  // Public API
  getData(): TrackerData {
    return {
      metrics: { ...this.metrics },
      recentQuips: [...this.recentQuips],
      events: [...this.events],
    };
  }

  subscribe(callback: (data: TrackerData) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  onBanner(callback: (message: string, type: string) => void): () => void {
    this.bannerSubscribers.push(callback);
    return () => {
      const index = this.bannerSubscribers.indexOf(callback);
      if (index > -1) {
        this.bannerSubscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers() {
    const data = this.getData();
    this.subscribers.forEach(callback => callback(data));
  }

  private saveSession() {
    try {
      const sessionData = {
        metrics: this.metrics,
        recentQuips: this.recentQuips,
        events: this.events.slice(-50), // Save last 50 events only
        timestamp: Date.now(),
      };
      localStorage.setItem('anti-productivity-session', JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  }

  private loadSession() {
    try {
      const saved = localStorage.getItem('anti-productivity-session');
      if (saved) {
        const sessionData = JSON.parse(saved);
        const age = Date.now() - sessionData.timestamp;
        
        // Only restore if session is less than 4 hours old
        if (age < 4 * 60 * 60 * 1000) {
          this.metrics = { ...this.metrics, ...sessionData.metrics };
          this.recentQuips = sessionData.recentQuips || [];
          this.events = sessionData.events || [];
        }
      }
    } catch (error) {
      console.warn('Failed to load session:', error);
    }
  }
}

export const tracker = new AntiProductivityTracker();