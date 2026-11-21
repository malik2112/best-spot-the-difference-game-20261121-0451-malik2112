// Lentera Pasar Malam — every tuning number, colour and layout box in one place (finisher pass).
// The playfield is a fixed 1280x720 logical area; the renderer scales it to the window,
// so no rule below depends on the screen size. Two picture panels sit side by side
// under a HUD bar; each panel is PANEL.w x PANEL.h in panel-local coordinates.

export const FIELD = { width: 1280, height: 720 };

export const HUD = { height: 92 };

export const PANEL = { w: 600, h: 470, gap: 24, top: 128 };
export const PANEL_LEFT_X = 28;
export const PANEL_RIGHT_X = PANEL_LEFT_X + PANEL.w + PANEL.gap;

/** Fixed simulation step in seconds: 60 updates a second whatever the display rate. */
export const STEP = 1 / 60;

/** Scoring and penalties. A wrong click costs time, never a life: the hunt stays kind. */
export const SCORE = {
  perFind: 100,
  streakBonus: 25,
  hintCost: 50,
  wrongTimePenalty: 3,
  timeBonusPerSecond: 2,
};

export const HINT = { cooldown: 20, pulseSeconds: 2.2 };

export const RETICLE = { speed: 420, radius: 16 };

export const PALETTE = {
  backdrop: '#141021',
  hud: '#1e1836',
  hudEdge: '#3a2d63',
  text: '#f5eedd',
  muted: '#b8aed6',
  accent: '#ffb347',
  found: '#3ddc84',
  foundDark: '#14532d',
  miss: '#ff5a5a',
  hint: '#ffd93d',
  timerOk: '#3ddc84',
  timerLow: '#ff5a5a',
  panelEdge: '#0d0a1a',
  labelBg: '#241b45',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
export const FONT_TITLE = '700 34px ' + FONT;
export const FONT_HUD = '700 20px ' + FONT;
export const FONT_SMALL = '600 15px ' + FONT;
export const FONT_BIG = '800 44px ' + FONT;

/** Where the best total score is kept between visits (this browser only). */
export const BEST_KEY = 'lentera-pasar-malam.best';
