// Lentera Pasar Malam — boot, the game state, and the one loop.
// Screens: title, play, paused, win, lose. Clicking either picture (or marking
// with the keyboard reticle) tests the point against the unfound differences:
// a hit rings the difference on both pictures, a miss costs three seconds and
// shakes the frame. The timer counts down; clearing a level banks a time bonus.
//
// ?shot=start|play|level2|win stages a fixed scene for screenshots instead of
// running the loop, paints it twice and sets window.__shotReady.

import { BEST_KEY, HINT, SCORE, STEP } from './config.js';
import { LEVELS, buildPanels, diffAt } from './scenes.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MARK, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { SCREEN_LOSE, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN, createRenderer } from './render.js';
import { playFind, playHint, playLose, playMiss, playTick, playWin } from './audio.js';
import { stageShot } from './shots.js';

const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

function createState() {
  return {
    levelIndex: 0,
    level: null,
    levelName: '',
    levelSeconds: 0,
    left: [],
    right: [],
    diffs: [],
    total: 0,
    found: 0,
    score: 0,
    best: readBest(),
    timeLeft: 0,
    hintReadyIn: 0,
    hintPulse: null,
    misses: [],
    shake: 0,
    streak: 0,
    reticle: { panel: 0, x: 300, y: 235, visible: false },
  };
}

/** Load a level's two pictures into the state and reset its hunt. */
function loadLevel(state, index) {
  const built = buildPanels(index);
  state.levelIndex = index;
  state.level = built.level;
  state.levelName = built.level.name;
  state.levelSeconds = built.level.seconds;
  state.left = built.left;
  state.right = built.right;
  state.diffs = built.diffs;
  state.total = built.diffs.length;
  state.found = 0;
  state.timeLeft = built.level.seconds;
  state.hintReadyIn = 0;
  state.hintPulse = null;
  state.misses = [];
  state.shake = 0;
  state.streak = 0;
}

function runShot(name) {
  const state = createState();
  const screen = stageShot(name, state, loadLevel);
  const now = 100;
  let painted = 0;
  function paint() {
    renderer.draw(state, screen, now);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const state = createState();
  loadLevel(state, 0);
  const input = createInput(canvas, renderer.toField);
  let screen = SCREEN_TITLE;
  let accumulator = 0;
  let last = performance.now();
  let now = 0;
  let lastTickSecond = -1;

  function announce(message) {
    status.textContent = message;
  }

  function startLevel(index, keepScore) {
    loadLevel(state, index);
    if (!keepScore) state.score = 0;
    state.reticle = input.reticle;
    screen = SCREEN_PLAY;
    announce(state.levelName + '. Find ' + state.total + ' differences.');
  }

  function finishLevel(won) {
    if (won) {
      state.score += Math.floor(state.timeLeft) * SCORE.timeBonusPerSecond;
      screen = SCREEN_WIN;
      playWin();
      announce('Level cleared. Score ' + state.score + '.');
    } else {
      screen = SCREEN_LOSE;
      playLose();
      announce('Time up. You found ' + state.found + ' of ' + state.total + '.');
    }
    if (state.score > state.best) {
      state.best = state.score;
      saveBest(state.best);
    }
  }

  function markAt(panel, x, y) {
    const hit = diffAt(state.diffs, x, y);
    if (hit) {
      hit.found = true;
      hit.foundAt = now;
      state.found += 1;
      state.streak += 1;
      state.score += SCORE.perFind + (state.streak - 1) * SCORE.streakBonus;
      playFind();
      const left = state.total - state.found;
      announce('Found: ' + hit.note + '. ' + left + ' left.');
      if (left === 0) finishLevel(true);
    } else {
      state.streak = 0;
      state.timeLeft = Math.max(0, state.timeLeft - SCORE.wrongTimePenalty);
      state.shake = 1;
      state.misses.push({ panel, x, y, at: now });
      playMiss();
      announce('Not there. Minus ' + SCORE.wrongTimePenalty + ' seconds.');
    }
  }

  function useHint() {
    if (screen !== SCREEN_PLAY || state.hintReadyIn > 0) return;
    const target = state.diffs.find((d) => !d.found);
    if (!target) return;
    state.hintPulse = { cx: target.cx, cy: target.cy, at: now };
    state.hintReadyIn = HINT.cooldown;
    state.score = Math.max(0, state.score - SCORE.hintCost);
    playHint();
    announce('Hint: look inside the dashed ring.');
  }

  function handleActions() {
    const actions = input.takeActions();
    const pick = input.takeLevelPick();
    if (screen === SCREEN_TITLE) {
      if (pick >= 0 && pick < LEVELS.length) startLevel(pick, false);
      else if (actions & ACTION_CONFIRM) startLevel(state.levelIndex, false);
      return;
    }
    if (screen === SCREEN_PLAY) {
      if (actions & ACTION_PAUSE) {
        screen = SCREEN_PAUSED;
        announce('Paused.');
      } else if (actions & ACTION_HINT) useHint();
      else if (actions & ACTION_MARK) markAt(input.reticle.panel, input.reticle.x, input.reticle.y);
      else if (actions & ACTION_RESTART) startLevel(state.levelIndex, false);
      return;
    }
    if (screen === SCREEN_PAUSED) {
      if (actions & (ACTION_PAUSE | ACTION_CONFIRM)) {
        screen = SCREEN_PLAY;
        announce('Playing.');
      }
      return;
    }
    if (screen === SCREEN_WIN) {
      if (actions & ACTION_RESTART) startLevel(0, false);
      else if (actions & ACTION_CONFIRM) {
        if (state.levelIndex < LEVELS.length - 1) startLevel(state.levelIndex + 1, true);
        else startLevel(0, false);
      }
      return;
    }
    if (screen === SCREEN_LOSE && (actions & ACTION_CONFIRM)) startLevel(state.levelIndex, false);
  }

  function step() {
    input.stepReticle();
    state.reticle = input.reticle;
    if (screen !== SCREEN_PLAY) return;
    state.timeLeft -= STEP;
    if (state.hintReadyIn > 0) state.hintReadyIn = Math.max(0, state.hintReadyIn - STEP);
    if (state.shake > 0) state.shake = Math.max(0, state.shake - STEP * 3);
    state.misses = state.misses.filter((m) => now - m.at < 0.6);
    const whole = Math.ceil(state.timeLeft);
    if (whole <= 10 && whole !== lastTickSecond && whole > 0) {
      lastTickSecond = whole;
      playTick();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      finishLevel(false);
    }
  }

  function frame(t) {
    requestAnimationFrame(frame);
    accumulator += Math.min((t - last) / 1000, MAX_FRAME);
    last = t;
    now = t / 1000;
    handleActions();
    if (screen === SCREEN_PLAY) {
      for (const click of input.takeClicks()) markAt(click.panel, click.x, click.y);
    } else {
      input.takeClicks();
      if (screen === SCREEN_TITLE && state.misses.length === 0 && accumulator > 0) {
        // A click anywhere on the title screen starts the hunt.
      }
    }
    while (accumulator >= STEP) {
      step();
      accumulator -= STEP;
    }
    renderer.draw(state, screen, now);
  }

  canvas.addEventListener('pointerdown', () => {
    if (screen === SCREEN_TITLE) startLevel(state.levelIndex, false);
    else if (screen === SCREEN_WIN) {
      if (state.levelIndex < LEVELS.length - 1) startLevel(state.levelIndex + 1, true);
      else startLevel(0, false);
    } else if (screen === SCREEN_LOSE) startLevel(state.levelIndex, false);
    else if (screen === SCREEN_PAUSED) screen = SCREEN_PLAY;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Lentera Pasar Malam. Press Enter or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
