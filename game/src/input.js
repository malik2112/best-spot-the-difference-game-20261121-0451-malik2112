// Lentera Pasar Malam — mouse clicks and the keyboard reticle.
// Clicks report a panel (0 = A, 1 = B) and panel-local coordinates.
// Keys: arrows/WASD steer the reticle, Tab switches picture, Enter/Space marks,
// H asks for a hint, P pauses, R restarts, 1-3 pick a level on the title screen.

import { PANEL, PANEL_LEFT_X, PANEL_RIGHT_X, RETICLE, STEP } from './config.js';

export const ACTION_MARK = 1;
export const ACTION_HINT = 2;
export const ACTION_PAUSE = 4;
export const ACTION_RESTART = 8;
export const ACTION_CONFIRM = 16;

export function createInput(canvas, toField) {
  const clicks = [];
  const held = new Set();
  let actions = 0;
  let levelPick = -1;

  const reticle = { panel: 0, x: PANEL.w / 2, y: PANEL.h / 2, visible: false };

  canvas.addEventListener('pointerdown', (event) => {
    const p = toField(event.clientX, event.clientY);
    const localY = p.y - PANEL.top;
    if (localY < 0 || localY > PANEL.h) return;
    if (p.x >= PANEL_LEFT_X && p.x <= PANEL_LEFT_X + PANEL.w) {
      clicks.push({ panel: 0, x: p.x - PANEL_LEFT_X, y: localY });
    } else if (p.x >= PANEL_RIGHT_X && p.x <= PANEL_RIGHT_X + PANEL.w) {
      clicks.push({ panel: 1, x: p.x - PANEL_RIGHT_X, y: localY });
    }
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
    if (key === 'tab') {
      event.preventDefault();
      reticle.panel = reticle.panel === 0 ? 1 : 0;
      reticle.visible = true;
      return;
    }
    held.add(key);
    reticle.visible = true;
    if (key === 'enter' || key === ' ') { actions |= ACTION_MARK | ACTION_CONFIRM; }
    if (key === 'h') actions |= ACTION_HINT;
    if (key === 'p' || key === 'escape') actions |= ACTION_PAUSE;
    if (key === 'r') actions |= ACTION_RESTART;
    if (key === '1' || key === '2' || key === '3') levelPick = Number(key) - 1;
  });

  window.addEventListener('keyup', (event) => {
    held.delete(event.key.toLowerCase());
  });

  /** Move the reticle for one fixed step from the held keys. */
  function stepReticle() {
    let dx = 0;
    let dy = 0;
    if (held.has('arrowleft') || held.has('a')) dx -= 1;
    if (held.has('arrowright') || held.has('d')) dx += 1;
    if (held.has('arrowup') || held.has('w')) dy -= 1;
    if (held.has('arrowdown') || held.has('s')) dy += 1;
    if (dx === 0 && dy === 0) return;
    const len = Math.hypot(dx, dy);
    reticle.x = Math.max(0, Math.min(PANEL.w, reticle.x + (dx / len) * RETICLE.speed * STEP));
    reticle.y = Math.max(0, Math.min(PANEL.h, reticle.y + (dy / len) * RETICLE.speed * STEP));
  }

  function takeClicks() {
    const out = clicks.slice();
    clicks.length = 0;
    return out;
  }

  function takeActions() {
    const out = actions;
    actions = 0;
    return out;
  }

  function takeLevelPick() {
    const out = levelPick;
    levelPick = -1;
    return out;
  }

  return { reticle, stepReticle, takeClicks, takeActions, takeLevelPick };
}
