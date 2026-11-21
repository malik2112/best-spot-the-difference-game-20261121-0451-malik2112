// Lentera Pasar Malam — all canvas drawing: the two pictures, the found rings,
// the hint pulse, the HUD with its remaining counter and timer bar, and the
// title / win / lose / pause overlays. Pure drawing: no game rules live here.

import { FIELD, FONT, FONT_BIG, FONT_HUD, FONT_SMALL, FONT_TITLE, HINT, HUD, PALETTE, PANEL, PANEL_LEFT_X, PANEL_RIGHT_X } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_WIN = 'win';
export const SCREEN_LOSE = 'lose';

function drawStar(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawMoon(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x + r * 0.45, y - r * 0.25, r * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}

function drawLantern(ctx, x, y, r, color) {
  ctx.strokeStyle = '#0d0a1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - r - 14);
  ctx.lineTo(x, y - r);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.82, r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(13,10,26,0.45)';
  ctx.lineWidth = 1.5;
  for (const t of [-0.5, 0, 0.5]) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.abs(r * 0.82 * (1 - Math.abs(t) * 0.7)), r, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#241b45';
  ctx.fillRect(x - r * 0.4, y - r - 4, r * 0.8, 5);
  ctx.fillRect(x - r * 0.4, y + r - 1, r * 0.8, 5);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + r + 4);
  ctx.lineTo(x, y + r + 12);
  ctx.stroke();
}

function drawWheel(ctx, x, y, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 8; i += 1) {
    const a = (Math.PI / 4) * i;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fill();
}

function drawObject(ctx, o) {
  ctx.fillStyle = o.color;
  ctx.strokeStyle = o.color;
  if (o.kind === 'rect') ctx.fillRect(o.x, o.y, o.w, o.h);
  else if (o.kind === 'circle') { ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill(); }
  else if (o.kind === 'tri') {
    ctx.beginPath();
    ctx.moveTo(o.x, o.y + o.h);
    ctx.lineTo(o.x + o.w / 2, o.y);
    ctx.lineTo(o.x + o.w, o.y + o.h);
    ctx.closePath();
    ctx.fill();
  } else if (o.kind === 'line') {
    ctx.lineWidth = o.width || 3;
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(o.x2, o.y2);
    ctx.stroke();
  } else if (o.kind === 'star') drawStar(ctx, o.x, o.y, o.r, o.color);
  else if (o.kind === 'moon') drawMoon(ctx, o.x, o.y, o.r, o.color);
  else if (o.kind === 'lantern') drawLantern(ctx, o.x, o.y, o.r, o.color);
  else if (o.kind === 'wheel') drawWheel(ctx, o.x, o.y, o.r, o.color);
  else if (o.kind === 'flag') {
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(o.x + o.w, o.y);
    ctx.lineTo(o.x + o.w / 2, o.y + o.h);
    ctx.closePath();
    ctx.fill();
  } else if (o.kind === 'cup') {
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(o.x + o.w, o.y);
    ctx.lineTo(o.x + o.w - 3, o.y + o.h);
    ctx.lineTo(o.x + 3, o.y + o.h);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPicture(ctx, originX, level, objects) {
  const grad = ctx.createLinearGradient(0, PANEL.top, 0, PANEL.top + PANEL.h);
  grad.addColorStop(0, level.skyTop);
  grad.addColorStop(1, level.skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(originX, PANEL.top, PANEL.w, PANEL.h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(originX, PANEL.top, PANEL.w, PANEL.h);
  ctx.clip();
  ctx.translate(originX, PANEL.top);
  ctx.fillStyle = level.ground;
  ctx.fillRect(0, PANEL.h - 62, PANEL.w, 62);
  ctx.fillStyle = level.groundLine;
  ctx.fillRect(0, PANEL.h - 62, PANEL.w, 4);
  for (const o of objects) drawObject(ctx, o);
  ctx.restore();
  ctx.strokeStyle = PALETTE.panelEdge;
  ctx.lineWidth = 4;
  ctx.strokeRect(originX, PANEL.top, PANEL.w, PANEL.h);
}

function drawFoundRing(ctx, originX, d, now) {
  const age = now - d.foundAt;
  const pop = age < 0.35 ? 1 + (0.35 - age) * 0.9 : 1;
  const r = d.r * pop;
  const x = originX + d.cx;
  const y = PANEL.top + d.cy;
  ctx.strokeStyle = PALETTE.foundDark;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.found;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.found;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 7, y);
  ctx.lineTo(x - 2, y + 6);
  ctx.lineTo(x + 8, y - 6);
  ctx.stroke();
}

function drawHintPulse(ctx, originX, hint, now) {
  if (!hint) return;
  const t = (now - hint.at) / HINT.pulseSeconds;
  if (t < 0 || t > 1) return;
  const x = originX + hint.cx;
  const y = PANEL.top + hint.cy;
  const r = 46 - 18 * t;
  ctx.strokeStyle = PALETTE.hint;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.globalAlpha = 1 - t * 0.4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

function drawMiss(ctx, originX, miss, now) {
  const age = now - miss.at;
  if (age > 0.6) return;
  const x = originX + miss.x;
  const y = PANEL.top + miss.y;
  ctx.globalAlpha = 1 - age / 0.6;
  ctx.strokeStyle = PALETTE.miss;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10); ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10); ctx.lineTo(x - 10, y + 10);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawReticle(ctx, reticle) {
  if (!reticle.visible) return;
  const originX = reticle.panel === 0 ? PANEL_LEFT_X : PANEL_RIGHT_X;
  const x = originX + reticle.x;
  const y = PANEL.top + reticle.y;
  ctx.strokeStyle = PALETTE.accent;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 24, y); ctx.lineTo(x - 9, y);
  ctx.moveTo(x + 9, y); ctx.lineTo(x + 24, y);
  ctx.moveTo(x, y - 24); ctx.lineTo(x, y - 9);
  ctx.moveTo(x, y + 9); ctx.lineTo(x, y + 24);
  ctx.stroke();
}

function drawPanelLabel(ctx, originX, text) {
  ctx.fillStyle = PALETTE.labelBg;
  ctx.fillRect(originX, PANEL.top - 30, 150, 26);
  ctx.fillStyle = PALETTE.text;
  ctx.font = FONT_SMALL;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, originX + 10, PANEL.top - 16);
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function drawHud(ctx, state) {
  ctx.fillStyle = PALETTE.hud;
  ctx.fillRect(0, 0, FIELD.width, HUD.height);
  ctx.fillStyle = PALETTE.hudEdge;
  ctx.fillRect(0, HUD.height, FIELD.width, 3);
  ctx.textBaseline = 'middle';

  ctx.fillStyle = PALETTE.accent;
  ctx.font = FONT_TITLE;
  ctx.textAlign = 'left';
  ctx.fillText('Lentera Pasar Malam', 24, 30);

  ctx.fillStyle = PALETTE.muted;
  ctx.font = FONT_SMALL;
  ctx.fillText('Level ' + (state.levelIndex + 1) + ' · ' + state.levelName, 24, 64);

  ctx.fillStyle = PALETTE.text;
  ctx.font = FONT_HUD;
  ctx.textAlign = 'center';
  ctx.fillText('Score ' + state.score, 470, 30);

  const left = state.total - state.found;
  ctx.fillStyle = left === 0 ? PALETTE.found : PALETTE.accent;
  ctx.font = '800 26px ' + FONT;
  ctx.fillText(left + ' left', 470, 64);

  ctx.fillStyle = state.timeLeft <= 10 ? PALETTE.timerLow : PALETTE.text;
  ctx.font = FONT_HUD;
  ctx.textAlign = 'right';
  ctx.fillText(formatTime(state.timeLeft), 1256, 30);

  const frac = Math.max(0, Math.min(1, state.timeLeft / state.levelSeconds));
  ctx.fillStyle = '#241b45';
  ctx.fillRect(880, 52, 376, 14);
  ctx.fillStyle = state.timeLeft <= 10 ? PALETTE.timerLow : PALETTE.timerOk;
  ctx.fillRect(880, 52, 376 * frac, 14);

  ctx.textAlign = 'left';
  ctx.font = FONT_SMALL;
  if (state.hintReadyIn > 0) {
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText('Hint in ' + Math.ceil(state.hintReadyIn) + 's (H)', 880, 82);
  } else {
    ctx.fillStyle = PALETTE.hint;
    ctx.fillText('Hint ready (H)', 880, 82);
  }
}

function drawOverlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(10, 6, 24, 0.72)';
  ctx.fillRect(0, HUD.height, FIELD.width, FIELD.height - HUD.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = accent || PALETTE.accent;
  ctx.font = FONT_BIG;
  ctx.fillText(title, FIELD.width / 2, 300);
  ctx.fillStyle = PALETTE.text;
  ctx.font = '600 20px ' + FONT;
  lines.forEach((line, i) => ctx.fillText(line, FIELD.width / 2, 352 + i * 30));
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    scale = Math.min(canvas.width / FIELD.width, canvas.height / FIELD.height);
    offsetX = (canvas.width - FIELD.width * scale) / 2;
    offsetY = (canvas.height - FIELD.height * scale) / 2;
  }
  window.addEventListener('resize', resize);
  resize();

  /** Convert a client point to logical field coordinates. */
  function toField(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const px = (clientX - rect.left) * (canvas.width / rect.width);
    const py = (clientY - rect.top) * (canvas.height / rect.height);
    return { x: (px - offsetX) / scale, y: (py - offsetY) / scale };
  }

  function draw(state, screen, now) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    if (state.shake > 0) {
      const s = state.shake * 8;
      ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
    }

    drawPicture(ctx, PANEL_LEFT_X, state.level, state.left);
    drawPicture(ctx, PANEL_RIGHT_X, state.level, state.right);
    drawPanelLabel(ctx, PANEL_LEFT_X, 'PICTURE A');
    drawPanelLabel(ctx, PANEL_RIGHT_X, 'PICTURE B');

    for (const d of state.diffs) {
      if (!d.found) continue;
      drawFoundRing(ctx, PANEL_LEFT_X, d, now);
      drawFoundRing(ctx, PANEL_RIGHT_X, d, now);
    }
    drawHintPulse(ctx, PANEL_LEFT_X, state.hintPulse, now);
    drawHintPulse(ctx, PANEL_RIGHT_X, state.hintPulse, now);
    for (const miss of state.misses) {
      drawMiss(ctx, miss.panel === 0 ? PANEL_LEFT_X : PANEL_RIGHT_X, miss, now);
    }
    drawReticle(ctx, state.reticle);
    drawHud(ctx, state);

    if (screen === SCREEN_TITLE) {
      drawOverlay(ctx, 'Lentera Pasar Malam', [
        'Spot every difference between Picture A and Picture B.',
        'Click a difference on either picture — or steer the reticle',
        'with the arrow keys, Tab to switch pictures, Enter to mark.',
        'Wrong clicks cost 3 seconds. Press H for a hint.',
        '',
        'Click or press Enter to start · Keys 1-3 pick a level',
      ]);
    } else if (screen === SCREEN_WIN) {
      drawOverlay(ctx, 'Level cleared!', [
        'All ' + state.total + ' differences found in ' + state.levelName + '.',
        'Score ' + state.score + ' · Best ' + state.best,
        state.levelIndex < 2 ? 'Press Enter for the next level.' : 'You cleared the whole night market!',
        'Press R to play again.',
      ], PALETTE.found);
    } else if (screen === SCREEN_LOSE) {
      drawOverlay(ctx, 'Time up!', [
        'You found ' + state.found + ' of ' + state.total + ' in ' + state.levelName + '.',
        'Score ' + state.score + ' · Best ' + state.best,
        'Press Enter to try this level again.',
      ], PALETTE.miss);
    } else if (screen === SCREEN_PAUSED) {
      drawOverlay(ctx, 'Paused', ['Press P or Enter to keep hunting.']);
    }
  }

  return { draw, toField, resize };
}
