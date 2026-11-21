// Lentera Pasar Malam — the three night-market scenes and their differences.
//
// A scene is a list of simple shapes (rect, circle, tri, line, star, moon, lantern,
// flag, cup, wheel) in panel-local coordinates (600x470). The left picture draws the
// list as written; the right picture draws the same list after each difference has
// been applied: one shape removed, recoloured, nudged, resized or added. Every
// difference carries the click circle (cx, cy, r) that finds it, in the same local
// coordinates, so a click on either panel can mark it.
//
// Differences are fair but shy: one lantern among many changes colour, one star
// goes missing, a cup slides a few pixels. Later levels hide them deeper.

function rect(id, x, y, w, h, color) { return { id, kind: 'rect', x, y, w, h, color }; }
function circle(id, x, y, r, color) { return { id, kind: 'circle', x, y, r, color }; }
function tri(id, x, y, w, h, color) { return { id, kind: 'tri', x, y, w, h, color }; }
function line(id, x, y, x2, y2, color, width) { return { id, kind: 'line', x, y, x2, y2, color, width: width || 3 }; }
function star(id, x, y, r, color) { return { id, kind: 'star', x, y, r, color }; }
function moon(id, x, y, r, color) { return { id, kind: 'moon', x, y, r, color }; }
function lantern(id, x, y, r, color) { return { id, kind: 'lantern', x, y, r, color }; }
function flag(id, x, y, w, h, color) { return { id, kind: 'flag', x, y, w, h, color }; }
function cup(id, x, y, w, h, color) { return { id, kind: 'cup', x, y, w, h, color }; }
function wheel(id, x, y, r, color) { return { id, kind: 'wheel', x, y, r, color }; }

const LEVEL_ONE = {
  name: 'Satay Cart Street',
  seconds: 150,
  skyTop: '#1b1440', skyBottom: '#4a2a6b', ground: '#2c2145', groundLine: '#57407e',
  objects: [
    moon('moon', 520, 62, 26, '#f7e8a0'),
    star('s1', 60, 48, 7, '#ffe9a8'), star('s2', 140, 82, 5, '#ffe9a8'),
    star('s3', 250, 40, 6, '#ffe9a8'), star('s4', 360, 70, 5, '#ffe9a8'),
    star('s5', 450, 36, 6, '#ffe9a8'), star('s6', 310, 100, 4, '#ffe9a8'),
    // string of flags across the top
    line('wire', 10, 108, 590, 96, '#0d0a1a', 2),
    flag('f1', 40, 108, 22, 26, '#ff5a5a'), flag('f2', 110, 106, 22, 26, '#ffd93d'),
    flag('f3', 180, 104, 22, 26, '#3ddc84'), flag('f4', 250, 103, 22, 26, '#4fc3f7'),
    flag('f5', 320, 101, 22, 26, '#ff8fab'), flag('f6', 390, 100, 22, 26, '#ffb347'),
    flag('f7', 460, 98, 22, 26, '#b388ff'), flag('f8', 530, 97, 22, 26, '#ff5a5a'),
    // satay cart: canopy, body, wheels
    tri('canopy', 70, 150, 240, 46, '#e5534b'),
    rect('canopyBand', 70, 192, 240, 10, '#ffd93d'),
    rect('cartBody', 86, 202, 208, 108, '#8d5a2b'),
    rect('cartShelf', 86, 268, 208, 10, '#6e4520'),
    circle('wheelL', 120, 330, 20, '#241b45'), circle('wheelR', 262, 330, 20, '#241b45'),
    circle('hubL', 120, 330, 7, '#ffb347'), circle('hubR', 262, 330, 7, '#ffb347'),
    // skewers on the grill
    line('sk1', 110, 232, 150, 222, '#d9c7a7', 3), line('sk2', 140, 234, 180, 224, '#d9c7a7', 3),
    line('sk3', 170, 236, 210, 226, '#d9c7a7', 3), line('sk4', 200, 238, 240, 228, '#d9c7a7', 3),
    circle('meat1', 126, 228, 7, '#a0522d'), circle('meat2', 156, 230, 7, '#a0522d'),
    circle('meat3', 186, 232, 7, '#a0522d'), circle('meat4', 216, 234, 7, '#a0522d'),
    // lantern pole on the right
    rect('pole', 468, 170, 8, 190, '#241b45'),
    line('poleArm', 472, 176, 420, 176, '#241b45', 5),
    lantern('lamp1', 420, 196, 17, '#ffb347'), lantern('lamp2', 472, 196, 17, '#ff8fab'),
    lantern('lamp3', 524, 196, 17, '#4fc3f7'),
    // stools and cups
    rect('stool1', 360, 322, 34, 10, '#4fc3f7'), rect('stool2', 410, 322, 34, 10, '#ffd93d'),
    cup('cup1', 368, 298, 16, 22, '#f5eedd'), cup('cup2', 418, 298, 16, 22, '#f5eedd'),
    circle('cat', 540, 352, 14, '#241b45'), tri('catEar', 530, 332, 10, 10, '#241b45'),
    rect('sign', 96, 356, 120, 30, '#ffd93d'),
    circle('signDot', 112, 371, 6, '#e5534b'), circle('signDot2', 156, 371, 6, '#e5534b'),
    circle('signDot3', 200, 371, 6, '#e5534b'),
  ],
  diffs: [
    { id: 'd1', cx: 520, cy: 62, r: 30, type: 'recolor', target: 'moon', color: '#ffd93d', note: 'the moon turns gold' },
    { id: 'd2', cx: 250, cy: 40, r: 16, type: 'remove', target: 's3', note: 'one star is missing' },
    { id: 'd3', cx: 320, cy: 114, r: 20, type: 'recolor', target: 'f5', color: '#3ddc84', note: 'a flag changes colour' },
    { id: 'd4', cx: 186, cy: 232, r: 16, type: 'remove', target: 'meat3', note: 'a skewer loses its meat' },
    { id: 'd5', cx: 472, cy: 196, r: 24, type: 'recolor', target: 'lamp2', color: '#3ddc84', note: 'the middle lantern turns green' },
    { id: 'd6', cx: 418, cy: 309, r: 18, type: 'move', target: 'cup2', dx: 14, dy: 0, note: 'a cup slides sideways' },
    { id: 'd7', cx: 156, cy: 371, r: 14, type: 'remove', target: 'signDot2', note: 'a dot on the sign is gone' },
  ],
};

const LEVEL_TWO = {
  name: 'Lantern Stall',
  seconds: 180,
  skyTop: '#101b3d', skyBottom: '#274b73', ground: '#1d2c4a', groundLine: '#3d5a8a',
  objects: [
    moon('moon', 84, 58, 22, '#f7e8a0'),
    star('s1', 180, 44, 5, '#cfe8ff'), star('s2', 300, 66, 6, '#cfe8ff'),
    star('s3', 420, 38, 5, '#cfe8ff'), star('s4', 520, 74, 6, '#cfe8ff'),
    star('s5', 240, 96, 4, '#cfe8ff'), star('s6', 470, 110, 4, '#cfe8ff'),
    // stall frame
    rect('postL', 60, 140, 10, 230, '#5b3a1e'), rect('postR', 530, 140, 10, 230, '#5b3a1e'),
    tri('roof', 40, 96, 520, 52, '#274b73'),
    rect('counter', 60, 320, 480, 16, '#8d5a2b'),
    rect('counterFront', 60, 336, 480, 54, '#6e4520'),
    // two rows of hanging lanterns
    line('wireA', 70, 158, 530, 158, '#0d0a1a', 2), line('wireB', 70, 228, 530, 228, '#0d0a1a', 2),
    lantern('a1', 110, 180, 16, '#ff5a5a'), lantern('a2', 180, 180, 16, '#ffd93d'),
    lantern('a3', 250, 180, 16, '#3ddc84'), lantern('a4', 320, 180, 16, '#4fc3f7'),
    lantern('a5', 390, 180, 16, '#ff8fab'), lantern('a6', 460, 180, 16, '#ffb347'),
    lantern('b1', 145, 250, 14, '#ffb347'), lantern('b2', 215, 250, 14, '#b388ff'),
    lantern('b3', 285, 250, 14, '#ff5a5a'), lantern('b4', 355, 250, 14, '#ffd93d'),
    lantern('b5', 425, 250, 14, '#3ddc84'),
    // jars and boxes on the counter
    rect('jar1', 110, 288, 26, 32, '#4fc3f7'), rect('jar2', 150, 288, 26, 32, '#ff8fab'),
    rect('jar3', 190, 288, 26, 32, '#ffd93d'),
    rect('box1', 400, 292, 44, 28, '#b388ff'), rect('box2', 452, 292, 44, 28, '#3ddc84'),
    cup('cup1', 290, 296, 18, 24, '#f5eedd'), cup('cup2', 320, 296, 18, 24, '#f5eedd'),
    circle('coin1', 250, 306, 6, '#ffd93d'), circle('coin2', 268, 306, 6, '#ffd93d'),
    // price tags
    rect('tag1', 118, 356, 30, 18, '#f5eedd'), rect('tag2', 408, 356, 30, 18, '#f5eedd'),
    rect('tag3', 460, 356, 30, 18, '#f5eedd'),
  ],
  diffs: [
    { id: 'd1', cx: 84, cy: 58, r: 26, type: 'move', target: 'moon', dx: 0, dy: 12, note: 'the moon sinks a little' },
    { id: 'd2', cx: 420, cy: 38, r: 14, type: 'remove', target: 's3', note: 'one star is missing' },
    { id: 'd3', cx: 250, cy: 180, r: 22, type: 'recolor', target: 'a3', color: '#ffd93d', note: 'a lantern turns yellow' },
    { id: 'd4', cx: 355, cy: 250, r: 20, type: 'remove', target: 'b4', note: 'a lantern is missing' },
    { id: 'd5', cx: 163, cy: 304, r: 20, type: 'recolor', target: 'jar2', color: '#3ddc84', note: 'a jar changes colour' },
    { id: 'd6', cx: 320, cy: 308, r: 18, type: 'move', target: 'cup2', dx: -12, dy: 0, note: 'a cup slides left' },
    { id: 'd7', cx: 268, cy: 306, r: 12, type: 'remove', target: 'coin2', note: 'a coin is gone' },
    { id: 'd8', cx: 475, cy: 365, r: 18, type: 'recolor', target: 'tag3', color: '#ff8fab', note: 'a price tag turns pink' },
  ],
};

const LEVEL_THREE = {
  name: 'Ferris Wheel Fair',
  seconds: 210,
  skyTop: '#241040', skyBottom: '#6b2a5e', ground: '#3a1e45', groundLine: '#6e3a7e',
  objects: [
    moon('moon', 540, 54, 20, '#f7e8a0'),
    star('s1', 50, 40, 5, '#ffe9a8'), star('s2', 130, 70, 6, '#ffe9a8'),
    star('s3', 220, 34, 5, '#ffe9a8'), star('s4', 330, 60, 6, '#ffe9a8'),
    star('s5', 430, 30, 5, '#ffe9a8'), star('s6', 90, 110, 4, '#ffe9a8'),
    star('s7', 380, 100, 4, '#ffe9a8'),
    // ferris wheel on the left
    wheel('ferris', 170, 220, 118, '#ffd93d'),
    circle('cabin1', 170, 102, 13, '#ff5a5a'), circle('cabin2', 254, 136, 13, '#4fc3f7'),
    circle('cabin3', 288, 220, 13, '#3ddc84'), circle('cabin4', 254, 304, 13, '#ff8fab'),
    circle('cabin5', 170, 338, 13, '#ffb347'), circle('cabin6', 86, 304, 13, '#b388ff'),
    circle('cabin7', 52, 220, 13, '#ffd93d'), circle('cabin8', 86, 136, 13, '#ff5a5a'),
    line('legL', 170, 220, 110, 390, '#241b45', 7), line('legR', 170, 220, 230, 390, '#241b45', 7),
    // game booth on the right
    rect('booth', 380, 230, 180, 140, '#8d5a2b'),
    tri('boothRoof', 368, 184, 204, 48, '#e5534b'),
    rect('boothBand', 380, 230, 180, 12, '#ffd93d'),
    circle('balloon1', 410, 290, 15, '#ff5a5a'), circle('balloon2', 450, 290, 15, '#4fc3f7'),
    circle('balloon3', 490, 290, 15, '#3ddc84'), circle('balloon4', 530, 290, 15, '#ffd93d'),
    circle('balloon5', 430, 330, 15, '#ff8fab'), circle('balloon6', 470, 330, 15, '#b388ff'),
    circle('balloon7', 510, 330, 15, '#ffb347'),
    // string lights
    line('wire', 300, 140, 590, 120, '#0d0a1a', 2),
    circle('bulb1', 340, 136, 7, '#ffb347'), circle('bulb2', 400, 132, 7, '#ffb347'),
    circle('bulb3', 460, 128, 7, '#ffb347'), circle('bulb4', 520, 124, 7, '#ffb347'),
    circle('bulb5', 570, 121, 7, '#ffb347'),
    // prizes shelf
    rect('shelf', 390, 384, 160, 10, '#6e4520'),
    rect('prize1', 400, 356, 28, 28, '#4fc3f7'), rect('prize2', 440, 356, 28, 28, '#ff8fab'),
    rect('prize3', 480, 356, 28, 28, '#3ddc84'), rect('prize4', 518, 356, 28, 28, '#ffd93d'),
  ],
  diffs: [
    { id: 'd1', cx: 540, cy: 54, r: 24, type: 'resize', target: 'moon', scale: 0.7, note: 'the moon shrinks' },
    { id: 'd2', cx: 220, cy: 34, r: 13, type: 'remove', target: 's3', note: 'one star is missing' },
    { id: 'd3', cx: 254, cy: 136, r: 18, type: 'recolor', target: 'cabin2', color: '#ffd93d', note: 'a cabin turns yellow' },
    { id: 'd4', cx: 86, cy: 304, r: 18, type: 'remove', target: 'cabin6', note: 'a cabin is missing' },
    { id: 'd5', cx: 450, cy: 290, r: 20, type: 'recolor', target: 'balloon2', color: '#ff8fab', note: 'a balloon turns pink' },
    { id: 'd6', cx: 470, cy: 330, r: 20, type: 'move', target: 'balloon6', dx: 0, dy: -12, note: 'a balloon floats up' },
    { id: 'd7', cx: 460, cy: 128, r: 12, type: 'remove', target: 'bulb3', note: 'a bulb is out' },
    { id: 'd8', cx: 454, cy: 370, r: 18, type: 'recolor', target: 'prize2', color: '#4fc3f7', note: 'a prize changes colour' },
    { id: 'd9', cx: 390, cy: 100, r: 14, type: 'add', shape: star('extraStar', 390, 100, 5, '#ffe9a8'), note: 'an extra star appears' },
    { id: 'd10', cx: 170, cy: 220, r: 16, type: 'recolor', target: 'ferris', color: '#ff8fab', note: 'the wheel hub turns pink' },
  ],
};

export const LEVELS = [LEVEL_ONE, LEVEL_TWO, LEVEL_THREE];

function cloneObjects(objects) {
  return objects.map((o) => ({ ...o }));
}

/** Apply one difference to a cloned object list, returning the changed list. */
function applyDiff(objects, diff) {
  if (diff.type === 'add') {
    objects.push({ ...diff.shape });
    return objects;
  }
  const target = objects.find((o) => o.id === diff.target);
  if (!target) return objects;
  if (diff.type === 'remove') return objects.filter((o) => o.id !== diff.target);
  if (diff.type === 'recolor') target.color = diff.color;
  if (diff.type === 'move') { target.x += diff.dx || 0; target.y += diff.dy || 0; }
  if (diff.type === 'resize' && target.r) target.r = Math.round(target.r * diff.scale);
  return objects;
}

/**
 * Build the two pictures for a level: left as written, right with every
 * difference applied, plus the findable difference list with found flags.
 */
export function buildPanels(levelIndex) {
  const level = LEVELS[levelIndex];
  const left = cloneObjects(level.objects);
  let right = cloneObjects(level.objects);
  for (const diff of level.diffs) right = applyDiff(right, diff);
  const diffs = level.diffs.map((d) => ({ id: d.id, cx: d.cx, cy: d.cy, r: d.r, note: d.note, found: false, foundAt: 0 }));
  return { level, left, right, diffs };
}

/** The unfound difference nearest to a panel-local point, or null. */
export function diffAt(diffs, x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const d of diffs) {
    if (d.found) continue;
    const dist = Math.hypot(x - d.cx, y - d.cy);
    if (dist <= d.r && dist < bestDist) { best = d; bestDist = dist; }
  }
  return best;
}
