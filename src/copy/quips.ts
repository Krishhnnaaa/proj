export const quips = {
  undoChurn: [
    "Ah yes, the classic 'maybe if I undo it 47 times it'll magically become better' strategy. Bold choice.",
    "Your Ctrl+Z key just filed a restraining order. It needs some space to heal.",
    "Breaking: Local developer discovers time travel, uses it exclusively to make code worse.",
    "That's not coding, that's interpretive dance with your keyboard. Very avant-garde.",
    "Plot twist: The code was actually perfect 12 undos ago. But who's keeping track? (I am.)",
    "Congratulations! You've achieved the rare 'Schrödinger's Code' - simultaneously working and broken.",
    "Your version history looks like a Jackson Pollock painting. Abstract, chaotic, probably worth millions.",
    "Fun fact: You've now spent more time undoing than most people spend actually doing. Impressive dedication.",
    "The definition of insanity is doing the same thing over and over... oh wait, you're UNdoing it. Carry on.",
    "Your code editor is getting motion sickness from all this back-and-forth. Maybe take a dramamine break?",
  ],

  netZero: [
    "Achievement Unlocked: 'The Hamster Wheel' - Maximum effort, zero displacement. You're basically a physics experiment now.",
    "You've successfully returned to your starting position like a very confused boomerang. Nature is healing.",
    "That was the coding equivalent of running a marathon in your living room. Exhausting but geographically pointless.",
    "Congratulations on inventing the world's first perpetual motion machine for procrastination.",
    "You just experienced what philosophers call 'The Eternal Return,' except Nietzsche was talking about existence, not your for-loop.",
    "Your git diff is having an existential crisis. 'Am I even real?' it whispers into the void.",
    "That's some next-level minimalism. Marie Kondo would be proud - you've decluttered your progress down to absolutely nothing.",
    "You've achieved coding enlightenment: the realization that sometimes the journey IS the destination. And the destination is nowhere.",
    "Breaking news: Local developer discovers time is a flat circle, uses this knowledge exclusively for code editing.",
    "Your productivity graph just flatlined, but in a zen way. Very mindful. Much presence.",
  ],

  uiFiddle: [
    "Ah, the ancient art of 'productive procrastination' - when tweaking the UI becomes more important than the actual UI.",
    "Your IDE is now 47% more aesthetically pleasing and 73% less likely to contain working code. Perfectly balanced.",
    "Fun fact: You've spent more time customizing your development environment than most people spend developing. That's... actually kind of impressive?",
    "Breaking: Local developer solves world hunger by making their code editor slightly more purple. (Citation needed.)",
    "Your theme-switching skills are legendary. Your actual coding skills remain... theoretical.",
    "That's not procrastination, that's 'optimizing the creative workspace for maximum synergy.' Very professional.",
    "You've achieved the rare 'Goldilocks Syndrome' - this theme is too dark, this one's too light, this one crashes your browser.",
    "Plot twist: The perfect IDE setup was inside you all along. (But this new font is pretty nice though.)",
    "Your IDE now looks like it could solve climate change. Whether it actually contains any code is still under investigation.",
    "Congratulations! You've successfully turned 'choosing a color scheme' into a full-time career. The benefits are terrible but the work is consistent.",
  ],

  tabSwitch: [
    "Olympic-level tab surfing detected. Your browser is basically a very expensive digital TV at this point.",
    "You've just toured the entire internet faster than most people tour their own house. Efficiency!",
    "Breaking: Local developer discovers the secret to productivity is checking if productivity still exists on other tabs.",
    "Your Alt+Tab skills are so advanced, you could probably get sponsored by Red Bull.",
    "That wasn't procrastination, that was 'competitive research.' Very thorough. Much professional.",
    "You've successfully verified that yes, the internet is still there. Crisis averted. Back to... whatever this was.",
    "Your browser history reads like a fever dream. 'How to center a div' followed by '47 facts about penguins' followed by 'Is my code sentient?'",
    "Fun fact: You've now visited more websites than most people visit physical locations in a year. You're basically a digital nomad.",
    "That tab-switching sequence was so smooth, it should be set to music. I suggest 'Flight of the Bumblebee.'",
    "Congratulations on maintaining 47 browser tabs simultaneously. Your RAM is crying, but your curiosity is thriving.",
  ],

  warmUp: [
    "That was some serious pre-game meditation. Your code is now spiritually aligned and ready for enlightenment.",
    "Extended contemplation phase complete. Your keyboard has achieved room temperature and optimal feng shui.",
    "You've successfully out-procrastinated a sloth. That's... actually kind of an achievement?",
    "Breaking: Local developer discovers the secret to good code is staring at it really, really hard for several minutes.",
    "Your warm-up routine is more thorough than most Olympic athletes. Except instead of gold medals, you get... eventual code?",
    "That wasn't procrastination, that was 'allowing the creative process to percolate.' Very artisanal. Much craft.",
    "You've achieved the rare 'Zen Master' state where time becomes meaningless and deadlines become suggestions.",
    "Fun fact: You've now spent more time thinking about coding than most people spend actually coding. Philosophy major?",
    "Your contemplation-to-action ratio is approaching infinity. Mathematicians are taking notes.",
    "That staring contest with your screen was intense. Final score: Screen 1, Productivity 0, Existential Dread 47.",
  ],

  idle: [
    "Your screen saver is more productive than you right now. It's actually moving pixels around and stuff.",
    "Achievement Unlocked: 'The Statue' - Remaining perfectly still while your deadline approaches at light speed.",
    "Breaking: Local developer discovers the secret to work-life balance is 90% life, 10% staring at work.",
    "Your cursor is blinking SOS in Morse code. It's staging an intervention.",
    "That wasn't procrastination, that was 'deep algorithmic meditation.' Very zen. Much enlightenment.",
    "You've successfully achieved the productivity level of a decorative houseplant. At least plants photosynthesize.",
    "Your idle time is so impressive, it should be listed on your resume under 'Special Skills.'",
    "Fun fact: You've now been still for so long, local wildlife is starting to build nests in your keyboard.",
    "That staring contest with your code was legendary. The code won by default when you forgot to blink.",
    "Congratulations! You've discovered the ancient art of 'productive stillness.' The productivity part is still theoretical.",
  ],
};

export const getRandomQuip = (type: keyof typeof quips): string => {
  const messages = quips[type];
  return messages[Math.floor(Math.random() * messages.length)];
};