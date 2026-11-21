// Lentera Pasar Malam — tiny WebAudio beeps, made with oscillators so the game
// ships no sound files. The context is created on the first user gesture.

let ctx = null;

function ensureContext() {
  if (ctx) return ctx;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    ctx = null;
  }
  return ctx;
}

function tone(freq, at, dur, type, gain) {
  const ac = ensureContext();
  if (!ac) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  const start = ac.currentTime + (at || 0);
  amp.gain.setValueAtTime(gain || 0.12, start);
  amp.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.connect(amp);
  amp.connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

/** A bright two-note chime when a difference is found. */
export function playFind() {
  tone(880, 0, 0.12, 'sine', 0.14);
  tone(1318, 0.08, 0.18, 'sine', 0.12);
}

/** A low buzz when a click misses. */
export function playMiss() {
  tone(160, 0, 0.16, 'square', 0.06);
}

/** A soft blip for the hint pulse. */
export function playHint() {
  tone(660, 0, 0.1, 'triangle', 0.1);
  tone(660, 0.14, 0.1, 'triangle', 0.08);
}

/** A tick in the last ten seconds. */
export function playTick() {
  tone(1200, 0, 0.05, 'sine', 0.05);
}

/** A little arpeggio when a level is cleared. */
export function playWin() {
  tone(523, 0, 0.14, 'sine', 0.13);
  tone(659, 0.11, 0.14, 'sine', 0.13);
  tone(784, 0.22, 0.14, 'sine', 0.13);
  tone(1046, 0.33, 0.26, 'sine', 0.14);
}

/** A gentle slide down when time runs out. */
export function playLose() {
  tone(392, 0, 0.18, 'sine', 0.1);
  tone(330, 0.15, 0.18, 'sine', 0.1);
  tone(262, 0.3, 0.3, 'sine', 0.1);
}
