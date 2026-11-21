// Lentera Pasar Malam — the screenshot scenes behind ?shot=start|play|level2|win.
// Each scene sets up a real game state (the same state the rules produce while
// playing): the title over level 1, a mid-hunt with rings on found differences
// and several still hiding, level 2 with a hint pulse in flight, and a cleared
// level. Fixed numbers, no randomness: the same shot always gives the same frame.

import { SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './render.js';

/** Mark the first n differences of the state as found, as real play would. */
function findFirst(state, n, at) {
  state.diffs.forEach((d, i) => {
    if (i < n) { d.found = true; d.foundAt = at - 1; }
  });
  state.found = Math.min(n, state.diffs.length);
}

/**
 * Stage the named scene on a fresh state from createState() and return the
 * screen to draw. Unknown names fall back to the title scene.
 */
export function stageShot(name, state, loadLevel) {
  if (name === 'play') {
    loadLevel(state, 0);
    findFirst(state, 3, 100);
    state.score = 325;
    state.timeLeft = 96;
    state.hintReadyIn = 0;
    state.reticle = { panel: 1, x: 472, y: 196, visible: true };
    return SCREEN_PLAY;
  }
  if (name === 'level2') {
    loadLevel(state, 1);
    findFirst(state, 2, 100);
    state.score = 200;
    state.timeLeft = 141;
    state.hintReadyIn = 12;
    const target = state.diffs.find((d) => !d.found);
    state.hintPulse = { cx: target.cx, cy: target.cy, at: 99.4 };
    state.reticle = { panel: 0, x: 250, y: 180, visible: true };
    return SCREEN_PLAY;
  }
  if (name === 'win') {
    loadLevel(state, 0);
    findFirst(state, state.diffs.length, 100);
    state.score = 890;
    state.best = 890;
    state.timeLeft = 54;
    state.hintReadyIn = 0;
    return SCREEN_WIN;
  }
  loadLevel(state, 0);
  state.timeLeft = state.levelSeconds;
  return SCREEN_TITLE;
}
