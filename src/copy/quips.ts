export const quips = {
  undoChurn: [
    "Ctrl+Z is tired. Your code? Not so much. Carry on, champion of circles.",
    "That's some impressive digital yo-yo action right there.",
    "Undo, redo, repeat. The sacred dance of indecision continues.",
    "Your keyboard's Z key is filing for workers' compensation.",
    "Achievement unlocked: Master of the Eternal Loop. Population: you.",
    "Plot twist: the code was fine the first time. But who's counting?",
    "Professional indecision at its finest. Your code editor is getting dizzy.",
    "That's what we call the 'developer's dilemma' - perfection through repetition.",
  ],

  netZero: [
    "You typed, you untyped, you conquered absolutely nothing. Iconic.",
    "Full circle back to square one. That's some philosophical coding right there.",
    "Net progress: zero. Net entertainment value: priceless.",
    "Like a digital boomerang, but less productive.",
    "You've successfully achieved quantum coding - existing in all states simultaneously.",
    "The code that was, is, and shall be again. Very zen.",
    "Achievement unlocked: Time Lord. You've mastered the art of temporal coding.",
    "Your code just experienced déjà vu. Again.",
  ],

  uiFiddle: [
    "New theme, same vibes. Procrastination now in Dark+.",
    "Rearranging deck chairs on the Titanic, but make it aesthetic.",
    "Perfect UI setup achieved. Time to code? Nah, let's tweak it more.",
    "Your IDE is now 2% more beautiful and 0% more productive. Worth it.",
    "Marie Kondo would be proud of all this interface organizing.",
    "The real code was the themes we toggled along the way.",
    "Professional procrastination: when changing settings becomes an art form.",
    "Your IDE has never looked better. Your deadline, however...",
  ],

  tabSwitch: [
    "Alt+Tab cardio complete. Hydrate. Then… continue not coding.",
    "Tab surfing champion reporting for duty. Waves are looking good today.",
    "That's some Olympic-level tab gymnastics right there.",
    "Internet successfully checked. All tabs accounted for. Panic averted.",
    "Professional multitasker at work. The task? Avoiding the actual task.",
    "Your browser tabs are a monument to possibility and procrastination.",
    "Context switching level: Expert. Code completion level: Beginner.",
    "You've just toured the entire internet. Twice. Impressive dedication.",
  ],

  warmUp: [
    "Pre-game stretches taking longer than the game. Olympic level.",
    "Thorough preparation is key. Or maybe you just got distracted. Both valid.",
    "That was some serious contemplation time. The code appreciates the buildup.",
    "Slow and steady wins the... actually, just slow. But that's fine too.",
    "Extended warm-up complete. Your keyboard is now properly seasoned.",
    "The dramatic pause before coding. Like a pianist before a concert.",
    "Professional staring contest with your screen. You're winning so far.",
    "Meditation phase complete. Enlightenment phase... still loading.",
  ],

  idle: [
    "Screen: on. Ambition: off. Perfect balance restored.",
    "Achieving zen through strategic inactivity. Mindfulness level: expert.",
    "Your cursor is blinking hopefully. It believes in you more than you do.",
    "Professional staring contest with your code. Current score: Code 1, You 0.",
    "Taking 'think before you code' to new philosophical heights.",
    "The code is patiently waiting. It's very understanding about these things.",
    "Power save mode: activated. Productivity mode: still buffering.",
    "You've entered the contemplation zone. Population: you and your cursor.",
  ],
};

export const getRandomQuip = (type: keyof typeof quips): string => {
  const messages = quips[type];
  return messages[Math.floor(Math.random() * messages.length)];
};