// OAR Pro v4 — Parameterized Question Generators (30+)
// Each generator produces a fresh question on every call with randomized numbers.
// Question text and explanations use MathJax LaTeX delimiters:
//   inline: \( ... \)
//   display: \[ ... \]
// This renders fractions, exponents, radicals, and symbols beautifully.
//
// Goal: prevent memorization and force real problem-solving skill.
// — Benjamin Rodriguez

// ==========================================
// HELPERS
// ==========================================

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function round(num, decimals = 2) {
  const f = Math.pow(10, decimals);
  return Math.round(num * f) / f;
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
// Greatest common divisor for fraction simplification
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
// Render a fraction as LaTeX, simplified
function fracLatex(num, den) {
  const g = gcd(num, den);
  const n = num / g, d = den / g;
  if (d === 1) return `${n}`;
  if (n < 0 && d > 0) return `-\\frac{${Math.abs(n)}}{${d}}`;
  return `\\frac{${n}}{${d}}`;
}
// Round a float to cleanest fraction-like decimal
function cleanNum(x) {
  if (Number.isInteger(x)) return x;
  const r2 = Math.round(x * 100) / 100;
  return Number.isInteger(r2) ? r2 : r2;
}
// Build option set from correct + distractors, shuffled
function buildOptions(correct, distractors, formatter = String) {
  const unique = [];
  const correctStr = formatter(correct);
  for (const d of distractors) {
    const ds = formatter(d);
    if (ds !== correctStr && !unique.includes(ds) && unique.length < 3) {
      unique.push(ds);
    }
  }
  // Pad with nearby fallbacks if needed
  let offset = 1;
  while (unique.length < 3) {
    const alt = typeof correct === 'number' ? correct + offset : correct + '_' + offset;
    const altStr = formatter(alt);
    if (altStr !== correctStr && !unique.includes(altStr)) unique.push(altStr);
    offset++;
    if (offset > 20) break; // safety
  }
  while (unique.length < 3) unique.push(`Option ${unique.length + 2}`);

  const entries = shuffle([
    { text: correctStr, isCorrect: true },
    { text: unique[0], isCorrect: false },
    { text: unique[1], isCorrect: false },
    { text: unique[2], isCorrect: false },
  ]);
  return {
    options: entries.map(e => e.text),
    correct_index: entries.findIndex(e => e.isCorrect),
  };
}

let _genCounter = 0;
function genId(prefix) {
  _genCounter++;
  return `GEN_${prefix}_${Date.now().toString(36)}_${_genCounter}`;
}

// ==========================================
// SVG DIAGRAM HELPERS
// All diagrams use dark-theme-friendly colors matching the app palette:
//   stroke: #9CA3AF (text-2)  accent: #3B82F6  red: #EF4444  green: #10B981
// ==========================================

const SVG_NS = 'http://www.w3.org/2000/svg';
const COLORS = {
  stroke: '#9CA3AF',
  text: '#F9FAFB',
  accent: '#3B82F6',
  red: '#EF4444',
  green: '#10B981',
  yellow: '#F59E0B',
  surface: '#1F2937',
};

function svgWrap(width, height, inner) {
  return `<svg xmlns="${SVG_NS}" viewBox="0 0 ${width} ${height}" style="max-width:100%;height:auto;max-height:280px">${inner}</svg>`;
}

// --- Lever (animated: subtle tilt showing imbalance before settling) ---
function svgLever(f1, d1, d2, f2Label = '?') {
  const W = 500, H = 200;
  const cx = W / 2, beamY = 120;
  const maxDist = Math.max(d1, d2);
  const unit = 180 / maxDist;
  const leftX = cx - d1 * unit;
  const rightX = cx + d2 * unit;
  // Fulcrum triangle (stays in place)
  const fulc = `<polygon points="${cx - 16},${beamY + 8} ${cx + 16},${beamY + 8} ${cx},${beamY - 10}" fill="${COLORS.accent}"/>`;
  // Ground line
  const ground = `<line x1="${cx - 34}" y1="${beamY + 14}" x2="${cx + 34}" y2="${beamY + 14}" stroke="${COLORS.stroke}" stroke-width="1.5"/>`;
  const ground2 = `<line x1="${cx - 30}" y1="${beamY + 22}" x2="${cx + 30}" y2="${beamY + 22}" stroke="${COLORS.stroke}" stroke-width="1"/>`;
  // Everything that rotates with the beam goes in one group
  const leftBox = `<rect x="${leftX - 24}" y="${beamY - 48}" width="48" height="40" rx="4" fill="${COLORS.red}" opacity="0.9"/><text x="${leftX}" y="${beamY - 24}" fill="white" font-size="13" font-weight="700" text-anchor="middle">${f1} lb</text>`;
  const rightBox = `<rect x="${rightX - 24}" y="${beamY - 48}" width="48" height="40" rx="4" fill="${COLORS.green}" opacity="0.9"/><text x="${rightX}" y="${beamY - 24}" fill="white" font-size="13" font-weight="700" text-anchor="middle">${f2Label}</text>`;
  const beam = `<rect x="${leftX - 12}" y="${beamY - 5}" width="${rightX - leftX + 24}" height="10" rx="2" fill="${COLORS.surface}" stroke="${COLORS.stroke}" stroke-width="2"/>`;
  // Rotate the beam group back and forth to suggest "seeking balance"
  const rotatingGroup = `<g><animateTransform attributeName="transform" type="rotate" values="0 ${cx} ${beamY};-3 ${cx} ${beamY};0 ${cx} ${beamY};3 ${cx} ${beamY};0 ${cx} ${beamY}" dur="3.5s" repeatCount="indefinite"/>${beam}${leftBox}${rightBox}</g>`;
  // Distance labels stay static
  const leftLabel = `<line x1="${leftX}" y1="${beamY + 36}" x2="${cx - 20}" y2="${beamY + 36}" stroke="${COLORS.stroke}" stroke-width="1.5"/><text x="${(leftX + cx - 20) / 2}" y="${beamY + 54}" fill="${COLORS.text}" font-size="14" text-anchor="middle">${d1} ft</text>`;
  const rightLabel = `<line x1="${cx + 20}" y1="${beamY + 36}" x2="${rightX}" y2="${beamY + 36}" stroke="${COLORS.stroke}" stroke-width="1.5"/><text x="${(cx + 20 + rightX) / 2}" y="${beamY + 54}" fill="${COLORS.text}" font-size="14" text-anchor="middle">${d2} ft</text>`;
  return svgWrap(W, H, ground + ground2 + fulc + rotatingGroup + leftLabel + rightLabel);
}

// --- Gear pair (animated: gears counter-rotate at correct speed ratio) ---
function svgGearPair(t1, t2, rpm1, rpm2Label = '?') {
  const W = 460, H = 240;
  const r1 = Math.max(35, Math.min(75, t1 * 2.5));
  const r2 = Math.max(35, Math.min(75, t2 * 2.5));
  const cx1 = 90 + r1, cy1 = H / 2 - 10;
  const cx2 = cx1 + r1 + r2, cy2 = H / 2 - 10;

  // Draw gear teeth as a path of notches around a circle
  const drawGearShape = (r, teeth) => {
    let d = '';
    const innerR = r - 2;
    const outerR = r + 7;
    const halfTooth = (Math.PI * 2) / (teeth * 2);
    for (let i = 0; i < teeth * 2; i++) {
      const theta = i * halfTooth;
      const ra = i % 2 === 0 ? outerR : innerR;
      const x = Math.cos(theta) * ra;
      const y = Math.sin(theta) * ra;
      d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2) + ' ';
    }
    d += 'Z';
    return d;
  };

  // Animation durations — A takes 4s per rotation, B takes proportional
  // If t2 > t1, B spins slower → longer duration
  const durA = 4;
  const durB = durA * (t2 / t1);
  const visT1 = Math.min(t1, 24);
  const visT2 = Math.min(t2, 24);

  // Gear A — rotates clockwise
  const gearA = `
    <g transform="translate(${cx1},${cy1})">
      <path d="${drawGearShape(r1, visT1)}" fill="${COLORS.accent}" opacity="0.35" stroke="${COLORS.accent}" stroke-width="2.5">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${durA}s" repeatCount="indefinite"/>
      </path>
      <circle r="${r1 * 0.22}" fill="${COLORS.surface}" stroke="${COLORS.accent}" stroke-width="2"/>
      <text y="5" fill="${COLORS.text}" font-size="14" font-weight="700" text-anchor="middle">A</text>
    </g>`;

  // Gear B — rotates counter-clockwise (opposite direction) at slower/faster ratio
  const gearB = `
    <g transform="translate(${cx2},${cy2})">
      <path d="${drawGearShape(r2, visT2)}" fill="${COLORS.yellow}" opacity="0.35" stroke="${COLORS.yellow}" stroke-width="2.5">
        <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="${durB}s" repeatCount="indefinite"/>
      </path>
      <circle r="${r2 * 0.22}" fill="${COLORS.surface}" stroke="${COLORS.yellow}" stroke-width="2"/>
      <text y="5" fill="${COLORS.text}" font-size="14" font-weight="700" text-anchor="middle">B</text>
    </g>`;

  const labelA = `<text x="${cx1}" y="${cy1 + r1 + 28}" fill="${COLORS.text}" font-size="13" text-anchor="middle">${t1} teeth</text><text x="${cx1}" y="${cy1 + r1 + 46}" fill="${COLORS.accent}" font-size="13" font-weight="700" text-anchor="middle">${rpm1} RPM</text>`;
  const labelB = `<text x="${cx2}" y="${cy2 + r2 + 28}" fill="${COLORS.text}" font-size="13" text-anchor="middle">${t2} teeth</text><text x="${cx2}" y="${cy2 + r2 + 46}" fill="${COLORS.yellow}" font-size="13" font-weight="700" text-anchor="middle">${rpm2Label}</text>`;
  return svgWrap(W, H, gearA + gearB + labelA + labelB);
}

// --- Pulley block-and-tackle (animated: lower block + weight slowly rise) ---
function svgPulley(ropes, weight) {
  const W = 380, H = 290;
  const topY = 30, bottomY = 180;
  const cxBlock = W / 2;
  // Ceiling
  const ceiling = `<line x1="50" y1="${topY}" x2="${W - 50}" y2="${topY}" stroke="${COLORS.stroke}" stroke-width="3"/>`;
  const ceilingHatch = Array.from({ length: 9 }, (_, i) => {
    const x = 55 + i * 32;
    return `<line x1="${x}" y1="${topY}" x2="${x - 9}" y2="${topY - 9}" stroke="${COLORS.stroke}" stroke-width="1.5"/>`;
  }).join('');
  // Upper pulley block (static, attached to ceiling)
  const upper = `<rect x="${cxBlock - 38}" y="${topY + 6}" width="76" height="32" rx="7" fill="${COLORS.surface}" stroke="${COLORS.accent}" stroke-width="2.5"/>
    <circle cx="${cxBlock - 20}" cy="${topY + 22}" r="8" fill="none" stroke="${COLORS.accent}" stroke-width="2"/>
    <circle cx="${cxBlock + 20}" cy="${topY + 22}" r="8" fill="none" stroke="${COLORS.accent}" stroke-width="2"/>`;

  // Animated group: the lower block + weight + supporting ropes rise together
  const riseAmount = 22;  // pixels it rises
  let ropesHtml = '';
  for (let i = 0; i < ropes; i++) {
    const denom = Math.max(1, ropes - 1);
    const x = cxBlock - 30 + (i * (60 / (denom || 1)));
    ropesHtml += `<line x1="${x}" y1="${topY + 38}" x2="${x}" y2="${bottomY - 10}" stroke="${COLORS.green}" stroke-width="2.5"/>`;
  }
  const lowerBlock = `<rect x="${cxBlock - 38}" y="${bottomY - 10}" width="76" height="28" rx="6" fill="${COLORS.surface}" stroke="${COLORS.accent}" stroke-width="2.5"/>`;
  const weightBox = `<line x1="${cxBlock}" y1="${bottomY + 18}" x2="${cxBlock}" y2="${bottomY + 40}" stroke="${COLORS.stroke}" stroke-width="2"/>
    <rect x="${cxBlock - 34}" y="${bottomY + 40}" width="68" height="48" rx="4" fill="${COLORS.red}" opacity="0.9"/>
    <text x="${cxBlock}" y="${bottomY + 70}" fill="white" font-size="15" font-weight="700" text-anchor="middle">${weight} lb</text>`;

  const risingGroup = `<g>
    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -${riseAmount}; 0 0" dur="4s" repeatCount="indefinite" keyTimes="0;0.5;1"/>
    ${ropesHtml}
    ${lowerBlock}
    ${weightBox}
  </g>`;

  // Pull rope going off to the side — animated tail length synced with the rise
  const pullX = cxBlock + 40;
  const pullRope = `<path stroke="${COLORS.green}" stroke-width="2.5" fill="none">
    <animate attributeName="d" values="M ${pullX},${topY + 22} Q ${pullX + 22},${topY + 22} ${pullX + 32},${topY + 80};M ${pullX},${topY + 22} Q ${pullX + 22},${topY + 22} ${pullX + 32},${topY + 58};M ${pullX},${topY + 22} Q ${pullX + 22},${topY + 22} ${pullX + 32},${topY + 80}" dur="4s" repeatCount="indefinite" keyTimes="0;0.5;1"/>
  </path>
  <text x="${pullX + 40}" y="${topY + 72}" fill="${COLORS.green}" font-size="14" font-weight="700">F = ?</text>`;

  const label = `<text x="${cxBlock}" y="${H - 14}" fill="${COLORS.text}" font-size="13" text-anchor="middle">${ropes} supporting rope segments</text>`;
  return svgWrap(W, H, ceiling + ceilingHatch + upper + risingGroup + pullRope + label);
}

// --- Inclined plane ---
function svgRamp(length, height, weight) {
  const W = 460, H = 220;
  const baseY = 170, startX = 60;
  // Scale so length fits
  const scale = 300 / length;
  const endX = startX + length * scale;
  const topY = baseY - height * scale;
  // Ramp triangle
  const ramp = `<polygon points="${startX},${baseY} ${endX},${baseY} ${endX},${topY}" fill="${COLORS.accent}" opacity="0.2" stroke="${COLORS.accent}" stroke-width="2.5"/>`;
  // Ground below
  const ground = `<line x1="${startX - 20}" y1="${baseY}" x2="${endX + 20}" y2="${baseY}" stroke="${COLORS.stroke}" stroke-width="2"/>`;
  // Crate on ramp (about halfway up)
  const cmx = startX + (endX - startX) * 0.55;
  const cmy = baseY - (baseY - topY) * 0.55;
  const angle = Math.atan2(baseY - topY, endX - startX) * 180 / Math.PI;
  const crate = `<g transform="translate(${cmx},${cmy}) rotate(${-angle})"><rect x="-22" y="-36" width="44" height="36" rx="3" fill="${COLORS.red}" opacity="0.9"/><text x="0" y="-12" fill="white" font-size="13" font-weight="700" text-anchor="middle">${weight} lb</text></g>`;
  // Dimension labels
  const lengthLabel = `<text x="${(startX + endX) / 2}" y="${baseY + 24}" fill="${COLORS.text}" font-size="14" text-anchor="middle">Length: ${length} ft</text>`;
  const heightLabel = `<text x="${endX + 10}" y="${(baseY + topY) / 2}" fill="${COLORS.text}" font-size="14" text-anchor="start">Height: ${height} ft</text><line x1="${endX}" y1="${topY}" x2="${endX}" y2="${baseY}" stroke="${COLORS.stroke}" stroke-dasharray="3,3" stroke-width="1.5"/>`;
  return svgWrap(W, H, ramp + ground + crate + lengthLabel + heightLabel);
}

// --- Right triangle ---
function svgTriangle(a, b, c, label = 'hyp') {
  const W = 340, H = 240;
  // Scale so triangle fits
  const maxDim = Math.max(a, b);
  const scale = 180 / maxDim;
  const x0 = 60, y0 = 200;
  const x1 = x0 + b * scale, y1 = y0;  // bottom-right
  const x2 = x0, y2 = y0 - a * scale;   // top-left
  const tri = `<polygon points="${x0},${y0} ${x1},${y1} ${x2},${y2}" fill="${COLORS.accent}" opacity="0.2" stroke="${COLORS.accent}" stroke-width="2.5"/>`;
  // Right angle marker
  const ra = `<rect x="${x0}" y="${y0 - 14}" width="14" height="14" fill="none" stroke="${COLORS.stroke}" stroke-width="1.5"/>`;
  // Labels
  const aLabel = `<text x="${x0 - 10}" y="${(y0 + y2) / 2}" fill="${COLORS.text}" font-size="15" text-anchor="end">${label === 'a' ? '?' : a}</text>`;
  const bLabel = `<text x="${(x0 + x1) / 2}" y="${y0 + 20}" fill="${COLORS.text}" font-size="15" text-anchor="middle">${label === 'b' ? '?' : b}</text>`;
  const cLabel = `<text x="${(x1 + x2) / 2 + 10}" y="${(y1 + y2) / 2 - 4}" fill="${COLORS.text}" font-size="15" text-anchor="start">${label === 'c' ? '?' : c}</text>`;
  return svgWrap(W, H, tri + ra + aLabel + bLabel + cLabel);
}

// --- Rectangle ---
function svgRectangle(l, w) {
  const W = 320, H = 180;
  const maxDim = Math.max(l, w);
  const scale = 140 / maxDim;
  const rw = l * scale, rh = w * scale;
  const rx = (W - rw) / 2, ry = (H - rh) / 2;
  const rect = `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${COLORS.accent}" opacity="0.2" stroke="${COLORS.accent}" stroke-width="2.5"/>`;
  const lenLabel = `<text x="${rx + rw / 2}" y="${ry + rh + 22}" fill="${COLORS.text}" font-size="15" text-anchor="middle">${l}</text>`;
  const widLabel = `<text x="${rx - 10}" y="${ry + rh / 2 + 5}" fill="${COLORS.text}" font-size="15" text-anchor="end">${w}</text>`;
  return svgWrap(W, H, rect + lenLabel + widLabel);
}

// --- Circle ---
function svgCircle(r) {
  const W = 260, H = 220;
  const cx = W / 2, cy = H / 2 - 6;
  const scale = Math.min(80 / r, 12);
  const pr = r * scale;
  const circ = `<circle cx="${cx}" cy="${cy}" r="${pr}" fill="${COLORS.accent}" opacity="0.2" stroke="${COLORS.accent}" stroke-width="2.5"/>`;
  const center = `<circle cx="${cx}" cy="${cy}" r="3" fill="${COLORS.text}"/>`;
  const radLine = `<line x1="${cx}" y1="${cy}" x2="${cx + pr}" y2="${cy}" stroke="${COLORS.stroke}" stroke-width="2" stroke-dasharray="4,3"/>`;
  const radLabel = `<text x="${cx + pr / 2}" y="${cy - 8}" fill="${COLORS.text}" font-size="14" text-anchor="middle">r = ${r}</text>`;
  return svgWrap(W, H, circ + radLine + center + radLabel);
}

// --- Rectangular box (3D volume) ---
function svgBox(l, w, h) {
  const W = 320, H = 220;
  const scale = Math.min(20, 120 / Math.max(l, w, h));
  const rl = l * scale, rw = w * scale, rh = h * scale;
  const ox = 80, oy = H - 40;  // front-bottom-left corner
  // Front face
  const front = `<polygon points="${ox},${oy} ${ox + rl},${oy} ${ox + rl},${oy - rh} ${ox},${oy - rh}" fill="${COLORS.accent}" opacity="0.25" stroke="${COLORS.accent}" stroke-width="2"/>`;
  // Top face (parallelogram)
  const top = `<polygon points="${ox},${oy - rh} ${ox + rl},${oy - rh} ${ox + rl + rw * 0.6},${oy - rh - rw * 0.4} ${ox + rw * 0.6},${oy - rh - rw * 0.4}" fill="${COLORS.accent}" opacity="0.4" stroke="${COLORS.accent}" stroke-width="2"/>`;
  // Right face
  const right = `<polygon points="${ox + rl},${oy} ${ox + rl + rw * 0.6},${oy - rw * 0.4} ${ox + rl + rw * 0.6},${oy - rh - rw * 0.4} ${ox + rl},${oy - rh}" fill="${COLORS.accent}" opacity="0.15" stroke="${COLORS.accent}" stroke-width="2"/>`;
  // Labels
  const lLab = `<text x="${ox + rl / 2}" y="${oy + 22}" fill="${COLORS.text}" font-size="14" text-anchor="middle">l = ${l}</text>`;
  const hLab = `<text x="${ox - 10}" y="${oy - rh / 2}" fill="${COLORS.text}" font-size="14" text-anchor="end">h = ${h}</text>`;
  const wLab = `<text x="${ox + rl + rw * 0.35 + 10}" y="${oy - rw * 0.2}" fill="${COLORS.text}" font-size="14" text-anchor="start">w = ${w}</text>`;
  return svgWrap(W, H, front + right + top + lLab + hLab + wLab);
}

// --- Series/parallel circuit (animated: current flow dots travel along wires) ---
function svgCircuit(r1, r2, variant) {
  const W = 480, H = 240;
  const col = COLORS.green;  // current color
  if (variant === 'series') {
    // Layout: battery (60,110) -> (60,150) | wires form a rectangle
    // Current path (clockwise starting from + terminal):
    // (60,110) -> (60,80) -> (420,80) -> (420,180) -> (60,180) -> (60,110)
    const batt = `<line x1="60" y1="110" x2="60" y2="150" stroke="${COLORS.text}" stroke-width="3"/>
      <line x1="50" y1="125" x2="70" y2="125" stroke="${COLORS.text}" stroke-width="3.5"/>
      <line x1="52" y1="135" x2="68" y2="135" stroke="${COLORS.text}" stroke-width="2"/>
      <text x="38" y="135" fill="${COLORS.text}" font-size="14" text-anchor="end" font-weight="700">V</text>`;
    // Wires (top, right, bottom)
    const wires = `
      <line x1="60" y1="110" x2="60" y2="80" stroke="${COLORS.text}" stroke-width="2.5"/>
      <line x1="60" y1="80" x2="170" y2="80" stroke="${COLORS.text}" stroke-width="2.5"/>
      <line x1="250" y1="80" x2="310" y2="80" stroke="${COLORS.text}" stroke-width="2.5"/>
      <line x1="390" y1="80" x2="420" y2="80" stroke="${COLORS.text}" stroke-width="2.5"/>
      <line x1="420" y1="80" x2="420" y2="180" stroke="${COLORS.text}" stroke-width="2.5"/>
      <line x1="420" y1="180" x2="60" y2="180" stroke="${COLORS.text}" stroke-width="2.5"/>
      <line x1="60" y1="180" x2="60" y2="150" stroke="${COLORS.text}" stroke-width="2.5"/>`;
    // Resistors (zigzag style)
    const r1Box = `<rect x="170" y="68" width="80" height="24" rx="3" fill="${COLORS.surface}" stroke="${COLORS.accent}" stroke-width="2.5"/>
      <text x="210" y="86" fill="${COLORS.accent}" font-size="14" font-weight="700" text-anchor="middle">${r1}Ω</text>`;
    const r2Box = `<rect x="310" y="68" width="80" height="24" rx="3" fill="${COLORS.surface}" stroke="${COLORS.yellow}" stroke-width="2.5"/>
      <text x="350" y="86" fill="${COLORS.yellow}" font-size="14" font-weight="700" text-anchor="middle">${r2}Ω</text>`;
    // Current path for animated dots
    const path = `M 60,110 L 60,80 L 420,80 L 420,180 L 60,180 Z`;
    const pathEl = `<path id="cpath_s" d="${path}" fill="none" stroke="none"/>`;
    // 3 dots distributed along the path
    const dots = Array.from({ length: 3 }, (_, i) => `
      <circle r="4" fill="${col}">
        <animateMotion dur="3s" repeatCount="indefinite" begin="${i * 1}s">
          <mpath href="#cpath_s"/>
        </animateMotion>
      </circle>`).join('');
    const label = `<text x="${W / 2}" y="${H - 14}" fill="${COLORS.text}" font-size="14" text-anchor="middle" font-weight="600">Series — one path for current</text>`;
    return svgWrap(W, H, pathEl + wires + batt + r1Box + r2Box + dots + label);
  }
  // Parallel layout
  const batt = `<line x1="60" y1="95" x2="60" y2="135" stroke="${COLORS.text}" stroke-width="3"/>
    <line x1="50" y1="110" x2="70" y2="110" stroke="${COLORS.text}" stroke-width="3.5"/>
    <line x1="52" y1="120" x2="68" y2="120" stroke="${COLORS.text}" stroke-width="2"/>
    <text x="38" y="120" fill="${COLORS.text}" font-size="14" text-anchor="end" font-weight="700">V</text>`;
  // Two branches: top branch has R1, bottom branch has R2
  const wires = `
    <line x1="60" y1="95" x2="60" y2="55" stroke="${COLORS.text}" stroke-width="2.5"/>
    <line x1="60" y1="55" x2="210" y2="55" stroke="${COLORS.text}" stroke-width="2.5"/>
    <line x1="290" y1="55" x2="420" y2="55" stroke="${COLORS.text}" stroke-width="2.5"/>
    <line x1="420" y1="55" x2="420" y2="175" stroke="${COLORS.text}" stroke-width="2.5"/>
    <line x1="420" y1="175" x2="290" y2="175" stroke="${COLORS.text}" stroke-width="2.5"/>
    <line x1="210" y1="175" x2="60" y2="175" stroke="${COLORS.text}" stroke-width="2.5"/>
    <line x1="60" y1="175" x2="60" y2="135" stroke="${COLORS.text}" stroke-width="2.5"/>`;
  const r1Box = `<rect x="210" y="43" width="80" height="24" rx="3" fill="${COLORS.surface}" stroke="${COLORS.accent}" stroke-width="2.5"/>
    <text x="250" y="61" fill="${COLORS.accent}" font-size="14" font-weight="700" text-anchor="middle">${r1}Ω</text>`;
  const r2Box = `<rect x="210" y="163" width="80" height="24" rx="3" fill="${COLORS.surface}" stroke="${COLORS.yellow}" stroke-width="2.5"/>
    <text x="250" y="181" fill="${COLORS.yellow}" font-size="14" font-weight="700" text-anchor="middle">${r2}Ω</text>`;
  // Two independent paths for two current streams
  const pathTop = `M 60,95 L 60,55 L 420,55 L 420,175 L 60,175 L 60,135`;
  const pathBot = `M 60,135 L 60,175 L 420,175 L 420,55 L 60,55 L 60,95`;
  const pathEls = `<path id="cpath_pt" d="${pathTop}" fill="none" stroke="none"/><path id="cpath_pb" d="${pathBot}" fill="none" stroke="none"/>`;
  const dotsTop = Array.from({ length: 2 }, (_, i) => `
    <circle r="4" fill="${col}">
      <animateMotion dur="4s" repeatCount="indefinite" begin="${i * 2}s">
        <mpath href="#cpath_pt"/>
      </animateMotion>
    </circle>`).join('');
  const dotsBot = Array.from({ length: 2 }, (_, i) => `
    <circle r="4" fill="${col}" opacity="0.7">
      <animateMotion dur="4s" repeatCount="indefinite" begin="${i * 2 + 1}s">
        <mpath href="#cpath_pb"/>
      </animateMotion>
    </circle>`).join('');
  const label = `<text x="${W / 2}" y="${H - 14}" fill="${COLORS.text}" font-size="14" text-anchor="middle" font-weight="600">Parallel — current splits between branches</text>`;
  return svgWrap(W, H, pathEls + wires + batt + r1Box + r2Box + dotsTop + dotsBot + label);
}

// --- Hydraulic press (animated: small piston pushes down, large piston rises) ---
function svgHydraulic(a1, a2, f1) {
  const W = 480, H = 240;
  const baseY = 190, topY = 60;
  const w1 = Math.max(30, Math.min(60, a1 * 6));
  const w2 = Math.max(70, Math.min(140, a2 * 2));
  const x1 = 90, x2 = W - 90 - w2;
  // Piston travel ratio: small moves more than large (conservation of volume)
  // A1 * d1 = A2 * d2 → d1/d2 = A2/A1
  const maxTravel = 18;
  const travelRatio = Math.min(a2 / a1, 4);
  const travel1 = maxTravel;  // small piston
  const travel2 = travel1 / travelRatio;  // large piston

  const defs = `<defs>
    <marker id="arrowG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="${COLORS.green}"/></marker>
    <marker id="arrowY" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="${COLORS.yellow}"/></marker>
  </defs>`;

  // Cylinders (static walls)
  const cyl1 = `<rect x="${x1 - 3}" y="${topY + 14}" width="${w1 + 6}" height="${baseY - topY - 14}" fill="${COLORS.surface}" stroke="${COLORS.stroke}" stroke-width="2" rx="2"/>`;
  const cyl2 = `<rect x="${x2 - 3}" y="${topY}" width="${w2 + 6}" height="${baseY - topY}" fill="${COLORS.surface}" stroke="${COLORS.stroke}" stroke-width="2" rx="2"/>`;
  // Connecting tube (fluid)
  const tube = `<rect x="${x1 + w1 / 2 - 8}" y="${baseY - 18}" width="${x2 + w2 / 2 - x1 - w1 / 2 + 16}" height="14" fill="${COLORS.accent}" opacity="0.45" stroke="${COLORS.stroke}" stroke-width="1.5"/>`;
  // Fluid inside cylinders (static, fills whole cylinder)
  const fluid1 = `<rect x="${x1}" y="${topY + 38}" width="${w1}" height="${baseY - topY - 38}" fill="${COLORS.accent}" opacity="0.45"/>`;
  const fluid2 = `<rect x="${x2}" y="${topY + 22}" width="${w2}" height="${baseY - topY - 22}" fill="${COLORS.accent}" opacity="0.45"/>`;

  // Animated piston 1 (small — pushes DOWN then rises)
  const p1 = `<rect x="${x1 - 5}" y="${topY + 30}" width="${w1 + 10}" height="10" fill="${COLORS.text}" rx="1">
    <animate attributeName="y" values="${topY + 30};${topY + 30 + travel1};${topY + 30}" dur="3s" repeatCount="indefinite" keyTimes="0;0.5;1"/>
  </rect>`;

  // Animated piston 2 (large — rises UP then falls) — opposite phase
  const p2 = `<rect x="${x2 - 5}" y="${topY + 14}" width="${w2 + 10}" height="10" fill="${COLORS.text}" rx="1">
    <animate attributeName="y" values="${topY + 14};${topY + 14 - travel2};${topY + 14}" dur="3s" repeatCount="indefinite" keyTimes="0;0.5;1"/>
  </rect>`;

  // Arrows
  const arrow1 = `<line x1="${x1 + w1 / 2}" y1="${topY - 8}" x2="${x1 + w1 / 2}" y2="${topY + 24}" stroke="${COLORS.green}" stroke-width="2.5" marker-end="url(#arrowG)"/>`;
  const arrow2 = `<line x1="${x2 + w2 / 2}" y1="${topY - 26}" x2="${x2 + w2 / 2}" y2="${topY + 6}" stroke="${COLORS.yellow}" stroke-width="2.5" marker-end="url(#arrowY)"/>`;
  const lab1 = `<text x="${x1 + w1 / 2}" y="${topY - 14}" fill="${COLORS.green}" font-size="13" font-weight="700" text-anchor="middle">F₁ = ${f1} N</text>
    <text x="${x1 + w1 / 2}" y="${baseY + 18}" fill="${COLORS.text}" font-size="13" text-anchor="middle">A₁ = ${a1} cm²</text>`;
  const lab2 = `<text x="${x2 + w2 / 2}" y="${topY - 32}" fill="${COLORS.yellow}" font-size="13" font-weight="700" text-anchor="middle">F₂ = ?</text>
    <text x="${x2 + w2 / 2}" y="${baseY + 18}" fill="${COLORS.text}" font-size="13" text-anchor="middle">A₂ = ${a2} cm²</text>`;

  return svgWrap(W, H, defs + cyl1 + cyl2 + fluid1 + fluid2 + tube + p1 + p2 + arrow1 + arrow2 + lab1 + lab2);
}

// Quick builder to reduce boilerplate
function Q(prefix, section, topic, question_text, options, correct_index, explanation, difficulty, diagram_svg) {
  return {
    id: genId(prefix),
    section, topic, question_text, options, correct_index,
    explanation, difficulty,
    diagram_svg: diagram_svg || null,
    generated: true,
  };
}

// ==========================================
// GENERATOR REGISTRY — 30+ generators
// ==========================================

const QUESTION_GENERATORS = {

  // ================= MATH — ARITHMETIC & PERCENTS (5) =================

  percent_of: {
    section: 'Math', topic: 'Percents & Ratios', label: 'Percent of a number', difficulty: 1,
    generate() {
      const percent = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80]);
      const base = pick([80, 120, 160, 200, 240, 300, 400, 500, 800, 1000]);
      const ans = round((percent / 100) * base, 2);
      const d = [round(percent * base / 1000, 2), round(percent * base, 0), round(base - ans, 2)];
      const { options, correct_index } = buildOptions(ans, d, n => `${n}`);
      return Q('PCT', 'Math', 'Percents & Ratios',
        `What is \\(${percent}\\%\\) of \\(${base}\\)?`,
        options, correct_index,
        `\\(${percent}\\%\\) of \\(${base}\\) \\(= \\frac{${percent}}{100} \\times ${base} = ${ans}\\).`,
        1);
    }
  },

  percent_change: {
    section: 'Math', topic: 'Percents & Ratios', label: 'Percent change', difficulty: 2,
    generate() {
      const oldVal = pick([20, 40, 50, 80, 100, 150, 200, 250, 400, 500]);
      const changePct = pick([10, 15, 20, 25, 30, 40, 50, 60, 75]);
      const increase = Math.random() < 0.5;
      const newVal = increase
        ? round(oldVal * (1 + changePct / 100), 2)
        : round(oldVal * (1 - changePct / 100), 2);
      const ans = changePct * (increase ? 1 : -1);
      const d = [changePct * (increase ? -1 : 1), round((newVal - oldVal) / newVal * 100, 1), ans + 10];
      const { options, correct_index } = buildOptions(ans, d, n => `${n > 0 ? '+' : ''}${n}\\%`);
      return Q('PCH', 'Math', 'Percents & Ratios',
        `A value changes from \\(${oldVal}\\) to \\(${newVal}\\). What is the percent change?`,
        options, correct_index,
        `Percent change \\(= \\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100 = \\frac{${newVal} - ${oldVal}}{${oldVal}} \\times 100 = ${ans}\\%\\).`,
        2);
    }
  },

  percent_compound: {
    section: 'Math', topic: 'Percents & Ratios', label: 'Compound percent change', difficulty: 3,
    generate() {
      // Trap: "up 20% then down 20%" does NOT return to start
      const base = pick([100, 200, 500, 1000]);
      const up = pick([10, 20, 25, 30, 50]);
      const down = pick([10, 20, 25, 30, 40]);
      const afterUp = base * (1 + up / 100);
      const final = round(afterUp * (1 - down / 100), 2);
      const net = round(((final - base) / base) * 100, 2);
      const d = [up - down, round(up - down + 1, 2), 0];
      const { options, correct_index } = buildOptions(net, d, n => `${n > 0 ? '+' : ''}${n}\\%`);
      return Q('PCC', 'Math', 'Percents & Ratios',
        `A stock goes up \\(${up}\\%\\) then falls \\(${down}\\%\\). What is the net percent change from the original?`,
        options, correct_index,
        `Start with \\(${base}\\). After \\(+${up}\\%\\): \\(${base} \\times ${1 + up / 100} = ${afterUp}\\). After \\(-${down}\\%\\): \\(${afterUp} \\times ${1 - down / 100} = ${final}\\). Net: \\(\\frac{${final} - ${base}}{${base}} = ${net}\\%\\). <strong>Trap:</strong> the percentages don't just cancel.`,
        3);
    }
  },

  ratio_proportion: {
    section: 'Math', topic: 'Percents & Ratios', label: 'Ratio / proportion', difficulty: 2,
    generate() {
      const a = pick([2, 3, 4, 5, 6]);
      const b = pick([3, 5, 7, 8, 9, 10]);
      const mult = pick([3, 4, 5, 6, 8, 10]);
      const first = a * mult;
      const second = b * mult;
      const d = [round(first * b / a, 1), round(first + b - a, 1), round(second / 2, 1)];
      const { options, correct_index } = buildOptions(second, d, n => `${n}`);
      return Q('RAT', 'Math', 'Percents & Ratios',
        `Two quantities are in a ratio of \\(${a} : ${b}\\). If the first quantity is \\(${first}\\), what is the second?`,
        options, correct_index,
        `Set up proportion: \\(\\frac{${a}}{${b}} = \\frac{${first}}{x}\\). Cross-multiply: \\(${a}x = ${b} \\times ${first} = ${b * first}\\), so \\(x = \\frac{${b * first}}{${a}} = ${second}\\).`,
        2);
    }
  },

  unit_conversion: {
    section: 'Math', topic: 'Word Problems', label: 'Unit conversion', difficulty: 3,
    generate() {
      const variant = pick(['mph_fps', 'km_mi', 'ft_m', 'min_sec']);
      if (variant === 'mph_fps') {
        const mph = pick([30, 45, 60, 75, 90]);
        // 1 mph ≈ 1.467 ft/s (exact: 5280/3600)
        const fps = round(mph * 5280 / 3600, 2);
        const d = [round(mph * 1.5, 2), round(mph / 1.467, 2), mph];
        const { options, correct_index } = buildOptions(fps, d, n => `${n} ft/s`);
        return Q('UC', 'Math', 'Word Problems',
          `Convert \\(${mph}\\) mph to feet per second. (1 mile \\(=\\) 5280 ft; 1 hour \\(=\\) 3600 s)`,
          options, correct_index,
          `\\(${mph} \\text{ mph} \\times \\frac{5280 \\text{ ft}}{1 \\text{ mi}} \\times \\frac{1 \\text{ hr}}{3600 \\text{ s}} = ${fps}\\) ft/s.`,
          3);
      }
      if (variant === 'km_mi') {
        const km = pick([10, 20, 50, 80, 100, 150, 200]);
        const mi = round(km * 0.6214, 2);
        const d = [round(km * 1.609, 2), round(km / 2, 1), km];
        const { options, correct_index } = buildOptions(mi, d, n => `${n} miles`);
        return Q('UC', 'Math', 'Word Problems',
          `Convert \\(${km}\\) km to miles. (1 km \\(\\approx\\) 0.6214 miles)`,
          options, correct_index,
          `\\(${km} \\text{ km} \\times 0.6214 = ${mi}\\) miles.`, 2);
      }
      if (variant === 'ft_m') {
        const ft = pick([10, 20, 50, 100, 200, 500]);
        const m = round(ft * 0.3048, 2);
        const d = [round(ft * 3, 1), round(ft / 3, 1), ft];
        const { options, correct_index } = buildOptions(m, d, n => `${n} m`);
        return Q('UC', 'Math', 'Word Problems',
          `Convert \\(${ft}\\) feet to meters. (1 ft \\(=\\) 0.3048 m)`,
          options, correct_index,
          `\\(${ft} \\times 0.3048 = ${m}\\) m.`, 2);
      }
      const h = pick([1.5, 2, 2.5, 3, 4, 5]);
      const sec = h * 3600;
      const d = [h * 60, h * 100, round(h * 3600 / 2, 0)];
      const { options, correct_index } = buildOptions(sec, d, n => `${n} seconds`);
      return Q('UC', 'Math', 'Word Problems',
        `How many seconds are in \\(${h}\\) hours?`,
        options, correct_index,
        `\\(${h} \\text{ hrs} \\times 60 \\text{ min/hr} \\times 60 \\text{ s/min} = ${sec}\\) seconds.`, 1);
    }
  },

  // ================= MATH — ALGEBRA (5) =================

  linear_equation: {
    section: 'Math', topic: 'Algebra', label: 'Solve linear equation', difficulty: 2,
    generate() {
      const a = pick([2, 3, 4, 5, 6, 7]);
      const x = pick([-5, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
      const b = pick([-10, -5, 3, 7, 12, 15]);
      const c = a * x + b;
      const d = [round((c + b) / a, 2), round((c - b) * a, 2), round(c / a, 2)];
      const { options, correct_index } = buildOptions(x, d, n => `\\(x = ${n}\\)`);
      const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      return Q('ALG', 'Math', 'Algebra',
        `Solve for \\(x\\): \\(${a}x ${bSign} = ${c}\\)`,
        options, correct_index,
        `Subtract \\(${b}\\) from both sides: \\(${a}x = ${c - b}\\). Divide by \\(${a}\\): \\(x = ${x}\\).`,
        2);
    }
  },

  system_of_equations: {
    section: 'Math', topic: 'Algebra', label: 'System of equations', difficulty: 3,
    generate() {
      const x = pick([-4, -2, 1, 2, 3, 4, 5]);
      const y = pick([-3, -1, 1, 2, 3, 5, 6]);
      const a1 = pick([1, 2, 3]), b1 = pick([1, 2, 3]);
      const a2 = pick([1, 2, 3]), b2 = pick([-3, -2, -1, 1, 2]);
      const c1 = a1 * x + b1 * y;
      const c2 = a2 * x + b2 * y;
      const d = [`\\(x=${y}, y=${x}\\)`, `\\(x=${-x}, y=${-y}\\)`, `\\(x=${x + 1}, y=${y - 1}\\)`];
      const correct = `\\(x=${x}, y=${y}\\)`;
      const allOptions = shuffle([correct, ...d.slice(0, 3)]);
      return Q('SYS', 'Math', 'Algebra',
        `Solve the system: \\(\\begin{cases} ${a1}x ${b1 >= 0 ? '+' : ''} ${b1}y = ${c1} \\\\ ${a2}x ${b2 >= 0 ? '+' : ''} ${b2}y = ${c2} \\end{cases}\\)`,
        allOptions, allOptions.indexOf(correct),
        `Using elimination or substitution: \\(x = ${x}\\), \\(y = ${y}\\). Verify: \\(${a1}(${x}) + ${b1}(${y}) = ${c1}\\) ✓ and \\(${a2}(${x}) + ${b2}(${y}) = ${c2}\\) ✓.`,
        3);
    }
  },

  quadratic_factor: {
    section: 'Math', topic: 'Algebra', label: 'Factor quadratic', difficulty: 3,
    generate() {
      const r1 = pick([-5, -4, -3, -2, 2, 3, 4, 5]);
      const r2 = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
      const b = -(r1 + r2);
      const c = r1 * r2;
      const correct = `\\(x = ${r1}, x = ${r2}\\)`;
      const distractors = [
        `\\(x = ${-r1}, x = ${-r2}\\)`,
        `\\(x = ${r1 + 1}, x = ${r2 + 1}\\)`,
        `\\(x = ${r1 * 2}, x = ${r2 * 2}\\)`,
      ];
      const allOptions = shuffle([correct, ...distractors]);
      const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      const cSign = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
      return Q('QUAD', 'Math', 'Algebra',
        `Solve by factoring: \\(x^{2} ${bSign}x ${cSign} = 0\\)`,
        allOptions, allOptions.indexOf(correct),
        `Find two numbers that multiply to \\(${c}\\) and add to \\(${b}\\): those are \\(${-r1}\\) and \\(${-r2}\\). So \\((x ${-r1 >= 0 ? '-' : '+'} ${Math.abs(r1)})(x ${-r2 >= 0 ? '-' : '+'} ${Math.abs(r2)}) = 0\\), giving \\(x = ${r1}\\) or \\(x = ${r2}\\).`,
        3);
    }
  },

  exponent_rules: {
    section: 'Math', topic: 'Algebra', label: 'Exponent rules', difficulty: 2,
    generate() {
      const base = pick([2, 3, 4, 5]);
      const e1 = pick([2, 3, 4, 5]);
      const e2 = pick([2, 3, 4, 5]);
      const variant = pick(['mul', 'div', 'pow']);
      let question, ans, explanation;
      if (variant === 'mul') {
        ans = Math.pow(base, e1 + e2);
        question = `Simplify: \\(${base}^{${e1}} \\times ${base}^{${e2}}\\)`;
        explanation = `When multiplying powers of the same base, add exponents: \\(${base}^{${e1}} \\times ${base}^{${e2}} = ${base}^{${e1 + e2}} = ${ans}\\).`;
      } else if (variant === 'div' && e1 > e2) {
        ans = Math.pow(base, e1 - e2);
        question = `Simplify: \\(\\frac{${base}^{${e1}}}{${base}^{${e2}}}\\)`;
        explanation = `When dividing powers of the same base, subtract exponents: \\(${base}^{${e1}-${e2}} = ${base}^{${e1 - e2}} = ${ans}\\).`;
      } else {
        ans = Math.pow(base, e1 * e2);
        question = `Simplify: \\((${base}^{${e1}})^{${e2}}\\)`;
        explanation = `When raising a power to a power, multiply exponents: \\(${base}^{${e1} \\times ${e2}} = ${base}^{${e1 * e2}} = ${ans}\\).`;
      }
      const d = [Math.pow(base, Math.max(e1, e2)), Math.pow(base, e1) + Math.pow(base, e2), ans * 2];
      const { options, correct_index } = buildOptions(ans, d, n => `${n}`);
      return Q('EXP', 'Math', 'Algebra', question, options, correct_index, explanation, 2);
    }
  },

  inequality: {
    section: 'Math', topic: 'Algebra', label: 'Solve inequality', difficulty: 3,
    generate() {
      // Trap: dividing by negative flips inequality
      const a = -pick([2, 3, 4, 5]);  // negative coefficient
      const x = pick([-3, -1, 2, 3, 5]);
      const b = pick([-10, -5, 3, 8, 12]);
      const c = a * x + b;
      const correct = `\\(x > ${x}\\)`;  // because we divided by negative, flipped
      const distractors = [`\\(x < ${x}\\)`, `\\(x > ${-x}\\)`, `\\(x < ${-x}\\)`];
      const allOptions = shuffle([correct, ...distractors]);
      const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      return Q('INEQ', 'Math', 'Algebra',
        `Solve the inequality: \\(${a}x ${bSign} < ${c}\\)`,
        allOptions, allOptions.indexOf(correct),
        `Subtract \\(${b}\\): \\(${a}x < ${c - b}\\). Divide by \\(${a}\\) — because \\(${a}\\) is negative, <strong>flip the inequality</strong>: \\(x > ${x}\\).`,
        3);
    }
  },

  // ================= MATH — WORD PROBLEMS (4) =================

  rate_time_distance: {
    section: 'Math', topic: 'Word Problems', label: 'Rate-time-distance', difficulty: 1,
    generate() {
      const rate = pick([30, 40, 45, 50, 55, 60, 65, 70]);
      const time = pick([1.5, 2, 2.5, 3, 3.5, 4, 5]);
      const distance = round(rate * time, 1);
      const d = [round(rate + time, 1), round(rate / time, 1), round(distance / 2, 1)];
      const { options, correct_index } = buildOptions(distance, d, n => `${n} miles`);
      return Q('RTD', 'Math', 'Word Problems',
        `A car travels at \\(${rate}\\) mph for \\(${time}\\) hours. How far does it travel?`,
        options, correct_index,
        `Distance \\(=\\) Rate \\(\\times\\) Time \\(= ${rate} \\times ${time} = ${distance}\\) miles.`, 1);
    }
  },

  work_rate_combined: {
    section: 'Math', topic: 'Word Problems', label: 'Combined work rate', difficulty: 3,
    generate() {
      const a = pick([3, 4, 5, 6, 8]);
      const b = pick([4, 5, 6, 8, 10, 12]);
      // Combined rate = 1/a + 1/b, time = 1 / combined
      const combined = 1 / (1 / a + 1 / b);
      const ans = round(combined, 2);
      const d = [round((a + b) / 2, 2), round(a + b, 2), round(Math.min(a, b), 2)];
      const { options, correct_index } = buildOptions(ans, d, n => `${n} hours`);
      return Q('WR', 'Math', 'Word Problems',
        `Jane can paint a fence in \\(${a}\\) hours. Bob can paint the same fence in \\(${b}\\) hours. Working together, how long will it take them?`,
        options, correct_index,
        `Combined rate \\(= \\frac{1}{${a}} + \\frac{1}{${b}} = \\frac{${b}+${a}}{${a * b}} = \\frac{${a + b}}{${a * b}}\\) fences/hour. Time \\(= \\frac{1}{\\text{rate}} = \\frac{${a * b}}{${a + b}} \\approx ${ans}\\) hours. <strong>Trap:</strong> don't just average the times.`,
        3);
    }
  },

  mixture: {
    section: 'Math', topic: 'Word Problems', label: 'Mixture problem', difficulty: 3,
    generate() {
      const vA = pick([5, 10, 20, 25]);
      const cA = pick([10, 20, 30]);  // percent salt
      const vB = pick([5, 10, 15, 30]);
      const cB = pick([40, 50, 60, 70]);
      const finalC = round((vA * cA + vB * cB) / (vA + vB), 2);
      const d = [(cA + cB) / 2, cA, cB];
      const { options, correct_index } = buildOptions(finalC, d, n => `${n}\\%`);
      return Q('MIX', 'Math', 'Word Problems',
        `You mix \\(${vA}\\) L of a \\(${cA}\\%\\) salt solution with \\(${vB}\\) L of a \\(${cB}\\%\\) salt solution. What is the concentration of the final mixture?`,
        options, correct_index,
        `Total salt \\(= (${vA})(${cA / 100}) + (${vB})(${cB / 100}) = ${vA * cA / 100} + ${vB * cB / 100} = ${(vA * cA + vB * cB) / 100}\\) L. Total volume \\(= ${vA + vB}\\) L. Concentration \\(= \\frac{${(vA * cA + vB * cB) / 100}}{${vA + vB}} = ${finalC / 100} = ${finalC}\\%\\).`,
        3);
    }
  },

  age_problem: {
    section: 'Math', topic: 'Word Problems', label: 'Age problem', difficulty: 2,
    generate() {
      const x = pick([8, 10, 12, 15, 18]);  // current age of younger
      const diff = pick([4, 6, 8, 10]);
      const y = x + diff;
      const yearsLater = pick([2, 3, 5, 8]);
      const sum = (x + yearsLater) + (y + yearsLater);
      const d = [x + y, sum - 2, round(sum * 0.9, 0)];
      const { options, correct_index } = buildOptions(sum, d, n => `${n}`);
      return Q('AGE', 'Math', 'Word Problems',
        `Tom is \\(${diff}\\) years older than Sarah. Sarah is \\(${x}\\). In \\(${yearsLater}\\) years, what will be the sum of their ages?`,
        options, correct_index,
        `Today: Sarah \\(= ${x}\\), Tom \\(= ${y}\\). In \\(${yearsLater}\\) years: Sarah \\(= ${x + yearsLater}\\), Tom \\(= ${y + yearsLater}\\). Sum \\(= ${x + yearsLater} + ${y + yearsLater} = ${sum}\\).`,
        2);
    }
  },

  // ================= MATH — GEOMETRY (4) =================

  rectangle_area: {
    section: 'Math', topic: 'Geometry', label: 'Rectangle area/perimeter', difficulty: 1,
    generate() {
      const l = pick([4, 5, 6, 8, 10, 12, 15, 20]);
      const w = pick([3, 4, 5, 6, 7, 8, 9, 10]);
      const variant = pick(['area', 'perimeter']);
      let q, ans, expl;
      if (variant === 'area') {
        ans = l * w;
        q = `A rectangle has length \\(${l}\\) and width \\(${w}\\). What is its area?`;
        expl = `Area \\(= l \\times w = ${l} \\times ${w} = ${ans}\\) square units.`;
      } else {
        ans = 2 * (l + w);
        q = `A rectangle has length \\(${l}\\) and width \\(${w}\\). What is its perimeter?`;
        expl = `Perimeter \\(= 2(l + w) = 2(${l} + ${w}) = ${ans}\\) units.`;
      }
      const d = [l + w, l * w + l, 2 * l * w];
      const { options, correct_index } = buildOptions(ans, d, n => `${n}`);
      return Q('RECT', 'Math', 'Geometry', q, options, correct_index, expl, 1, svgRectangle(l, w));
    }
  },

  circle_area: {
    section: 'Math', topic: 'Geometry', label: 'Circle area/circumference', difficulty: 2,
    generate() {
      const r = pick([2, 3, 4, 5, 6, 7, 8, 10]);
      const variant = pick(['area', 'circ']);
      let ans, q, expl;
      if (variant === 'area') {
        ans = round(Math.PI * r * r, 2);
        q = `A circle has radius \\(${r}\\). What is its area? (use \\(\\pi \\approx 3.14\\))`;
        expl = `\\(A = \\pi r^{2} = \\pi \\times ${r}^{2} = \\pi \\times ${r * r} \\approx ${ans}\\).`;
      } else {
        ans = round(2 * Math.PI * r, 2);
        q = `A circle has radius \\(${r}\\). What is its circumference? (use \\(\\pi \\approx 3.14\\))`;
        expl = `\\(C = 2\\pi r = 2\\pi \\times ${r} \\approx ${ans}\\).`;
      }
      const d = [round(Math.PI * r, 2), round(r * r, 2), round(2 * r, 2)];
      const { options, correct_index } = buildOptions(ans, d, n => `${n}`);
      return Q('CIRC', 'Math', 'Geometry', q, options, correct_index, expl, 2, svgCircle(r));
    }
  },

  pythagorean: {
    section: 'Math', topic: 'Geometry', label: 'Pythagorean theorem', difficulty: 2,
    generate() {
      // Pick a Pythagorean triple and scale it
      const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]];
      const [aT, bT, cT] = pick(triples);
      const variant = pick(['hyp', 'leg']);
      let q, ans, expl;
      if (variant === 'hyp') {
        ans = cT;
        q = `A right triangle has legs of length \\(${aT}\\) and \\(${bT}\\). What is the length of the hypotenuse?`;
        expl = `By the Pythagorean theorem: \\(c = \\sqrt{a^{2} + b^{2}} = \\sqrt{${aT * aT} + ${bT * bT}} = \\sqrt{${aT * aT + bT * bT}} = ${cT}\\).`;
      } else {
        ans = bT;
        q = `A right triangle has one leg of length \\(${aT}\\) and hypotenuse \\(${cT}\\). What is the length of the other leg?`;
        expl = `Rearrange Pythagorean theorem: \\(b = \\sqrt{c^{2} - a^{2}} = \\sqrt{${cT * cT} - ${aT * aT}} = \\sqrt{${cT * cT - aT * aT}} = ${bT}\\).`;
      }
      const d = [aT + bT, round(Math.sqrt(aT * aT + bT * bT / 2), 1), cT + 1];
      const { options, correct_index } = buildOptions(ans, d, n => `${n}`);
      const diagram = svgTriangle(aT, bT, cT, variant === 'hyp' ? 'c' : 'a');
      return Q('PYTH', 'Math', 'Geometry', q, options, correct_index, expl, 2, diagram);
    }
  },

  volume_box: {
    section: 'Math', topic: 'Geometry', label: 'Rectangular volume', difficulty: 1,
    generate() {
      const l = pick([3, 4, 5, 6, 8, 10]);
      const w = pick([2, 3, 4, 5, 6]);
      const h = pick([2, 3, 4, 5]);
      const ans = l * w * h;
      const d = [l + w + h, 2 * (l * w + w * h + l * h), l * w];
      const { options, correct_index } = buildOptions(ans, d, n => `${n} cubic units`);
      return Q('VOL', 'Math', 'Geometry',
        `A rectangular box has length \\(${l}\\), width \\(${w}\\), and height \\(${h}\\). What is its volume?`,
        options, correct_index,
        `\\(V = l \\times w \\times h = ${l} \\times ${w} \\times ${h} = ${ans}\\) cubic units.`, 1, svgBox(l, w, h));
    }
  },

  // ================= MECHANICAL — KINEMATICS (3) =================

  kinematics_velocity: {
    section: 'Mechanical', topic: 'Kinematics', label: 'Final velocity (v = at)', difficulty: 1,
    generate() {
      const a = pick([2, 3, 4, 5, 6, 8, 10]);
      const t = pick([2, 3, 4, 5, 6, 8]);
      const v = a * t;
      const d = [a + t, round(a / t, 2), round(0.5 * a * t, 2)];
      const { options, correct_index } = buildOptions(v, d, n => `${n} m/s`);
      return Q('KIN', 'Mechanical', 'Kinematics',
        `An object starts from rest and accelerates at \\(${a}\\) m/s\\(^{2}\\) for \\(${t}\\) seconds. What is its final velocity?`,
        options, correct_index,
        `Starting from rest: \\(v = at = ${a} \\times ${t} = ${v}\\) m/s.`, 1);
    }
  },

  kinematics_distance: {
    section: 'Mechanical', topic: 'Kinematics', label: 'Distance from rest', difficulty: 2,
    generate() {
      const a = pick([2, 3, 4, 5, 8, 10]);
      const t = pick([2, 3, 4, 5, 6]);
      const d = round(0.5 * a * t * t, 2);
      const distractors = [a * t, round(a * t * t, 2), round(2 * a * t, 2)];
      const { options, correct_index } = buildOptions(d, distractors, n => `${n} m`);
      return Q('KD', 'Mechanical', 'Kinematics',
        `An object starts from rest and accelerates at \\(${a}\\) m/s\\(^{2}\\) for \\(${t}\\) seconds. How far does it travel?`,
        options, correct_index,
        `From rest: \\(d = \\frac{1}{2}at^{2} = \\frac{1}{2}(${a})(${t})^{2} = \\frac{1}{2}(${a})(${t * t}) = ${d}\\) m.`, 2);
    }
  },

  free_fall: {
    section: 'Mechanical', topic: 'Kinematics', label: 'Free fall', difficulty: 3,
    generate() {
      const h = pick([5, 10, 20, 45, 80, 125]);  // heights where v comes out clean with g=10
      const g = 10;
      const v = round(Math.sqrt(2 * g * h), 2);
      const t = round(Math.sqrt(2 * h / g), 2);
      const variant = pick(['v', 't']);
      let q, ans, expl, fmt;
      if (variant === 'v') {
        q = `An object is dropped from a height of \\(${h}\\) m. What is its velocity just before hitting the ground? (use \\(g = 10\\) m/s\\(^{2}\\))`;
        ans = v;
        fmt = n => `${n} m/s`;
        expl = `Use \\(v^{2} = u^{2} + 2gh\\). Starting from rest \\((u = 0)\\): \\(v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times ${h}} = \\sqrt{${2 * g * h}} \\approx ${v}\\) m/s.`;
      } else {
        q = `An object is dropped from a height of \\(${h}\\) m. How long does it take to fall? (use \\(g = 10\\) m/s\\(^{2}\\))`;
        ans = t;
        fmt = n => `${n} s`;
        expl = `Use \\(h = \\frac{1}{2}gt^{2}\\). Solve for \\(t\\): \\(t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2 \\times ${h}}{10}} \\approx ${t}\\) s.`;
      }
      const distractors = [round(ans * 2, 2), round(ans / 2, 2), round(ans + 5, 2)];
      const { options, correct_index } = buildOptions(ans, distractors, fmt);
      return Q('FF', 'Mechanical', 'Kinematics', q, options, correct_index, expl, 3);
    }
  },

  // ================= MECHANICAL — FORCES (3) =================

  newtons_second: {
    section: 'Mechanical', topic: "Forces & Newton's Laws", label: "F = ma", difficulty: 1,
    generate() {
      const variant = pick(['F', 'm', 'a']);
      const m = pick([2, 3, 4, 5, 8, 10, 20]);
      const a = pick([2, 3, 4, 5, 6, 10]);
      const F = m * a;
      let q, ans, fmt, expl;
      if (variant === 'F') {
        q = `What force is needed to accelerate a \\(${m}\\) kg mass at \\(${a}\\) m/s\\(^{2}\\)?`;
        ans = F; fmt = n => `${n} N`;
        expl = `\\(F = ma = ${m} \\times ${a} = ${F}\\) N.`;
      } else if (variant === 'm') {
        q = `A force of \\(${F}\\) N accelerates an object at \\(${a}\\) m/s\\(^{2}\\). What is its mass?`;
        ans = m; fmt = n => `${n} kg`;
        expl = `\\(m = \\frac{F}{a} = \\frac{${F}}{${a}} = ${m}\\) kg.`;
      } else {
        q = `A \\(${F}\\) N force is applied to a \\(${m}\\) kg mass. What is its acceleration?`;
        ans = a; fmt = n => `${n} m/s\\(^{2}\\)`;
        expl = `\\(a = \\frac{F}{m} = \\frac{${F}}{${m}} = ${a}\\) m/s\\(^{2}\\).`;
      }
      const d = [round(ans * 2, 2), round(ans / 2, 2), round(ans + 1, 2)];
      const { options, correct_index } = buildOptions(ans, d, fmt);
      return Q('N2', 'Mechanical', "Forces & Newton's Laws", q, options, correct_index, expl, 1);
    }
  },

  friction_net_force: {
    section: 'Mechanical', topic: "Forces & Newton's Laws", label: 'Net force with friction', difficulty: 3,
    generate() {
      const m = pick([5, 10, 20, 25]);
      const applied = pick([30, 50, 80, 100, 150]);
      const mu = pick([0.1, 0.2, 0.3, 0.4]);
      const g = 10;
      const friction = round(mu * m * g, 2);
      const net = round(applied - friction, 2);
      const a = round(net / m, 2);
      const d = [round(applied / m, 2), round((applied - m) / m, 2), round(applied * mu / m, 2)];
      const { options, correct_index } = buildOptions(a, d, n => `${n} m/s\\(^{2}\\)`);
      return Q('FNF', 'Mechanical', "Forces & Newton's Laws",
        `A \\(${m}\\) kg block on a flat surface (\\(\\mu = ${mu}\\)) has a \\(${applied}\\) N horizontal force applied. Find its acceleration. (use \\(g = 10\\) m/s\\(^{2}\\))`,
        options, correct_index,
        `Friction force \\(= \\mu mg = ${mu} \\times ${m} \\times 10 = ${friction}\\) N. Net force \\(= ${applied} - ${friction} = ${net}\\) N. Acceleration \\(= \\frac{F_{\\text{net}}}{m} = \\frac{${net}}{${m}} = ${a}\\) m/s\\(^{2}\\).`,
        3);
    }
  },

  inclined_plane: {
    section: 'Mechanical', topic: "Forces & Newton's Laws", label: 'Inclined plane', difficulty: 3,
    generate() {
      const L = pick([4, 5, 8, 10, 12, 15, 20]);
      const h = pick([1, 2, 3, 4, 5]);
      const w = pick([40, 50, 60, 80, 100, 120]);
      // MA = L/h, Force needed to push up (no friction) = w * h / L
      const force = round(w * h / L, 2);
      const ma = round(L / h, 2);
      const d = [round(w, 1), round(w - force, 2), round(w / 2, 1)];
      const { options, correct_index } = buildOptions(force, d, n => `${n} lbs`);
      return Q('INC', 'Mechanical', "Forces & Newton's Laws",
        `A \\(${w}\\) lb crate is pushed up a frictionless ramp \\(${L}\\) ft long that rises \\(${h}\\) ft vertically. What force is needed to push it up?`,
        options, correct_index,
        `Mechanical advantage of ramp \\(= \\frac{L}{h} = \\frac{${L}}{${h}} = ${ma}\\). Force needed \\(= \\frac{\\text{weight}}{MA} = \\frac{${w}}{${ma}} = ${force}\\) lbs.`,
        3,
        svgRamp(L, h, w));
    }
  },

  // ================= MECHANICAL — ENERGY (3) =================

  kinetic_energy: {
    section: 'Mechanical', topic: 'Energy & Work', label: "Kinetic energy", difficulty: 2,
    generate() {
      const m = pick([2, 4, 5, 8, 10, 20]);
      const v = pick([3, 4, 5, 6, 8, 10]);
      const ke = round(0.5 * m * v * v, 2);
      const d = [round(m * v, 2), round(m * v * v, 2), round(0.5 * m * v, 2)];
      const { options, correct_index } = buildOptions(ke, d, n => `${n} J`);
      return Q('KE', 'Mechanical', 'Energy & Work',
        `A \\(${m}\\) kg object moves at \\(${v}\\) m/s. What is its kinetic energy?`,
        options, correct_index,
        `\\(KE = \\frac{1}{2}mv^{2} = \\frac{1}{2}(${m})(${v})^{2} = \\frac{1}{2}(${m})(${v * v}) = ${ke}\\) J. <strong>Key insight:</strong> velocity is squared — doubling speed quadruples energy.`,
        2);
    }
  },

  work_done: {
    section: 'Mechanical', topic: 'Energy & Work', label: 'Work (W = Fd)', difficulty: 1,
    generate() {
      const f = pick([10, 20, 30, 40, 50, 75, 100]);
      const d = pick([2, 3, 4, 5, 6, 8, 10]);
      const w = f * d;
      const distractors = [f + d, round(f / d, 1), round(w / 2, 1)];
      const { options, correct_index } = buildOptions(w, distractors, n => `${n} J`);
      return Q('WORK', 'Mechanical', 'Energy & Work',
        `A \\(${f}\\) N force pushes an object \\(${d}\\) m in the direction of the force. How much work is done?`,
        options, correct_index,
        `\\(W = Fd = ${f} \\times ${d} = ${w}\\) J.`, 1);
    }
  },

  energy_conservation: {
    section: 'Mechanical', topic: 'Energy & Work', label: 'Conservation of energy', difficulty: 3,
    generate() {
      const h = pick([5, 10, 20, 45, 80]);
      const g = 10;
      const v = round(Math.sqrt(2 * g * h), 2);
      const d = [round(h, 1), round(Math.sqrt(h), 2), round(g * h, 2)];
      const { options, correct_index } = buildOptions(v, d, n => `${n} m/s`);
      return Q('CE', 'Mechanical', 'Energy & Work',
        `A ball is dropped from \\(${h}\\) m. Using conservation of energy, find its speed just before it hits the ground. (ignore air resistance, \\(g = 10\\))`,
        options, correct_index,
        `All PE converts to KE: \\(mgh = \\frac{1}{2}mv^{2}\\). Mass cancels: \\(v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times ${h}} = \\sqrt{${2 * g * h}} \\approx ${v}\\) m/s.`,
        3);
    }
  },

  // ================= MECHANICAL — SIMPLE MACHINES (3) =================

  lever_balance: {
    section: 'Mechanical', topic: 'Levers & Torque', label: 'Lever balance', difficulty: 2,
    generate() {
      const f1 = pick([20, 30, 40, 50, 60, 80, 100]);
      const d1 = pick([2, 3, 4, 5, 6, 8, 10]);
      const d2 = pick([1, 2, 3, 4, 5]);
      const f2 = round((f1 * d1) / d2, 1);
      const d = [round((f1 * d2) / d1, 1), round(f1 + d1 - d2, 1), round(f1 * d1 * d2, 1)];
      const { options, correct_index } = buildOptions(f2, d, n => `${n} lbs`);
      return Q('LEV', 'Mechanical', 'Levers & Torque',
        `A lever has a \\(${f1}\\) lb weight \\(${d1}\\) ft from the fulcrum. What force is needed \\(${d2}\\) ft from the fulcrum (on the opposite side) to balance it?`,
        options, correct_index,
        `Lever law: \\(F_{1} d_{1} = F_{2} d_{2}\\). So \\(F_{2} = \\frac{${f1} \\times ${d1}}{${d2}} = \\frac{${f1 * d1}}{${d2}} = ${f2}\\) lbs.`,
        2,
        svgLever(f1, d1, d2, 'F = ?'));
    }
  },

  gear_ratio: {
    section: 'Mechanical', topic: 'Gears & Pulleys', label: 'Gear ratio', difficulty: 2,
    generate() {
      const t1 = pick([10, 12, 15, 20, 24, 30]);
      const rpm1 = pick([60, 100, 120, 150, 200, 240, 300]);
      const t2 = pick([15, 20, 24, 30, 36, 40, 48, 60]);
      const rpm2 = round((t1 * rpm1) / t2, 1);
      const d = [round((t2 * rpm1) / t1, 1), round(rpm1 - (t2 - t1), 1), rpm1];
      const { options, correct_index } = buildOptions(rpm2, d, n => `${n} RPM`);
      return Q('GEAR', 'Mechanical', 'Gears & Pulleys',
        `Gear A has \\(${t1}\\) teeth and spins at \\(${rpm1}\\) RPM. It drives gear B with \\(${t2}\\) teeth. What is gear B's speed?`,
        options, correct_index,
        `Conservation of teeth contact: \\(T_{1} \\cdot RPM_{1} = T_{2} \\cdot RPM_{2}\\). So \\(RPM_{2} = \\frac{${t1} \\times ${rpm1}}{${t2}} = \\frac{${t1 * rpm1}}{${t2}} = ${rpm2}\\) RPM.`,
        2,
        svgGearPair(t1, t2, rpm1, '? RPM'));
    }
  },

  pulley_ma: {
    section: 'Mechanical', topic: 'Gears & Pulleys', label: 'Pulley mechanical advantage', difficulty: 2,
    generate() {
      const ropes = pick([2, 3, 4, 5, 6]);
      const weight = pick([100, 200, 300, 400, 500, 600]);
      const force = round(weight / ropes, 2);
      const d = [weight, round(weight / 2, 1), round(weight * ropes, 1)];
      const { options, correct_index } = buildOptions(force, d, n => `${n} lbs`);
      return Q('PUL', 'Mechanical', 'Gears & Pulleys',
        `A block-and-tackle pulley system supports a \\(${weight}\\) lb load with \\(${ropes}\\) rope segments supporting the load. What force is needed to lift it?`,
        options, correct_index,
        `MA \\(=\\) number of supporting rope segments \\(= ${ropes}\\). Force \\(= \\frac{\\text{load}}{MA} = \\frac{${weight}}{${ropes}} = ${force}\\) lbs.`,
        2,
        svgPulley(ropes, weight));
    }
  },

  // ================= MECHANICAL — FLUIDS (2) =================

  pressure: {
    section: 'Mechanical', topic: 'Fluids & Pressure', label: 'Pressure (P=F/A)', difficulty: 1,
    generate() {
      const f = pick([100, 150, 200, 250, 300, 400, 500, 600]);
      const a = pick([2, 4, 5, 8, 10, 20, 25]);
      const p = round(f / a, 2);
      const d = [round(f * a, 1), round(a / f, 4), round(f - a, 1)];
      const { options, correct_index } = buildOptions(p, d, n => `${n} Pa`);
      return Q('PRES', 'Mechanical', 'Fluids & Pressure',
        `A force of \\(${f}\\) N is applied over an area of \\(${a}\\) m\\(^{2}\\). What is the pressure?`,
        options, correct_index,
        `\\(P = \\frac{F}{A} = \\frac{${f}}{${a}} = ${p}\\) Pa.`, 1);
    }
  },

  hydraulic_press: {
    section: 'Mechanical', topic: 'Fluids & Pressure', label: "Hydraulic press (Pascal's law)", difficulty: 3,
    generate() {
      const a1 = pick([2, 4, 5, 10]);
      const a2 = pick([20, 40, 50, 100, 200]);
      const f1 = pick([10, 20, 50, 100]);
      const f2 = round((f1 * a2) / a1, 1);
      const d = [round(f1 * a1 / a2, 2), round(f1 + a2 - a1, 1), f1];
      const { options, correct_index } = buildOptions(f2, d, n => `${n} N`);
      return Q('HYD', 'Mechanical', 'Fluids & Pressure',
        `A hydraulic press has a small piston of area \\(${a1}\\) cm\\(^{2}\\) and a large piston of area \\(${a2}\\) cm\\(^{2}\\). If you apply \\(${f1}\\) N to the small piston, what force does the large piston exert?`,
        options, correct_index,
        `Pascal's law: \\(\\frac{F_{1}}{A_{1}} = \\frac{F_{2}}{A_{2}}\\). So \\(F_{2} = F_{1} \\times \\frac{A_{2}}{A_{1}} = ${f1} \\times \\frac{${a2}}{${a1}} = ${f1} \\times ${a2 / a1} = ${f2}\\) N. <strong>Force amplified, but the small piston travels farther.</strong>`,
        3, svgHydraulic(a1, a2, f1));
    }
  },

  // ================= MECHANICAL — ELECTRICITY (3) =================

  ohms_law: {
    section: 'Mechanical', topic: 'Electricity', label: "Ohm's Law", difficulty: 2,
    generate() {
      const variant = pick(['V', 'I', 'R']);
      const I = pick([1, 2, 3, 4, 5, 6]);
      const R = pick([2, 4, 5, 8, 10, 12, 15, 20]);
      const V = I * R;
      let q, ans, expl, fmt;
      if (variant === 'V') {
        q = `A \\(${R}\\) \\(\\Omega\\) resistor has \\(${I}\\) A of current flowing through it. What is the voltage?`;
        ans = V; fmt = n => `${n} V`;
        expl = `\\(V = IR = ${I} \\times ${R} = ${V}\\) V.`;
      } else if (variant === 'I') {
        q = `A \\(${V}\\) V battery is connected to a \\(${R}\\) \\(\\Omega\\) resistor. What is the current?`;
        ans = I; fmt = n => `${n} A`;
        expl = `\\(I = \\frac{V}{R} = \\frac{${V}}{${R}} = ${I}\\) A.`;
      } else {
        q = `A \\(${V}\\) V source produces \\(${I}\\) A of current through a resistor. What is the resistance?`;
        ans = R; fmt = n => `${n} \\(\\Omega\\)`;
        expl = `\\(R = \\frac{V}{I} = \\frac{${V}}{${I}} = ${R}\\) \\(\\Omega\\).`;
      }
      const d = [round(ans * 2, 2), round(ans / 2, 2), round(ans + 1, 2)];
      const { options, correct_index } = buildOptions(ans, d, fmt);
      return Q('OHM', 'Mechanical', 'Electricity', q, options, correct_index, expl, 2);
    }
  },

  series_parallel: {
    section: 'Mechanical', topic: 'Electricity', label: 'Series/parallel resistance', difficulty: 3,
    generate() {
      const r1 = pick([2, 3, 4, 5, 6]);
      const r2 = pick([3, 4, 6, 8, 12]);
      const variant = pick(['series', 'parallel']);
      let ans, expl, q;
      if (variant === 'series') {
        ans = r1 + r2;
        q = `Two resistors, \\(${r1}\\) \\(\\Omega\\) and \\(${r2}\\) \\(\\Omega\\), are connected in <strong>series</strong>. What is their total resistance?`;
        expl = `Series: \\(R_{\\text{total}} = R_{1} + R_{2} = ${r1} + ${r2} = ${ans}\\) \\(\\Omega\\).`;
      } else {
        ans = round((r1 * r2) / (r1 + r2), 2);
        q = `Two resistors, \\(${r1}\\) \\(\\Omega\\) and \\(${r2}\\) \\(\\Omega\\), are connected in <strong>parallel</strong>. What is their total resistance?`;
        expl = `Parallel: \\(\\frac{1}{R_{\\text{total}}} = \\frac{1}{${r1}} + \\frac{1}{${r2}}\\), so \\(R_{\\text{total}} = \\frac{${r1} \\times ${r2}}{${r1} + ${r2}} = \\frac{${r1 * r2}}{${r1 + r2}} \\approx ${ans}\\) \\(\\Omega\\).`;
      }
      const d = [r1 + r2, round(r1 * r2, 1), round(ans * 2, 2)];
      const { options, correct_index } = buildOptions(ans, d, n => `${n} \\(\\Omega\\)`);
      return Q('SP', 'Mechanical', 'Electricity', q, options, correct_index, expl, 3, svgCircuit(r1, r2, variant));
    }
  },

  electric_power: {
    section: 'Mechanical', topic: 'Electricity', label: 'Electrical power', difficulty: 2,
    generate() {
      const V = pick([10, 12, 24, 60, 120, 240]);
      const I = pick([1, 2, 3, 5, 10]);
      const P = V * I;
      const d = [V + I, round(V / I, 2), round(P / 2, 1)];
      const { options, correct_index } = buildOptions(P, d, n => `${n} W`);
      return Q('EP', 'Mechanical', 'Electricity',
        `A device draws \\(${I}\\) A from a \\(${V}\\) V source. What is its power consumption?`,
        options, correct_index,
        `\\(P = VI = ${V} \\times ${I} = ${P}\\) W.`, 2);
    }
  },

  // ================= MECHANICAL — MOMENTUM (1) =================

  momentum: {
    section: 'Mechanical', topic: 'Momentum & Impulse', label: 'Momentum', difficulty: 2,
    generate() {
      const m = pick([2, 5, 10, 20, 50, 100, 500, 1000]);
      const v = pick([2, 3, 5, 8, 10, 15, 20, 25, 30]);
      const p = m * v;
      const d = [m + v, round(0.5 * m * v * v, 1), round(p / 2, 1)];
      const { options, correct_index } = buildOptions(p, d, n => `${n} kg·m/s`);
      return Q('MOM', 'Mechanical', 'Momentum & Impulse',
        `A \\(${m}\\) kg object moves at \\(${v}\\) m/s. What is its momentum?`,
        options, correct_index,
        `\\(p = mv = ${m} \\times ${v} = ${p}\\) kg·m/s.`, 2);
    }
  },

  // Inelastic collision — conservation of momentum (hard, trap: don't average velocities)
  momentum_collision: {
    section: 'Mechanical', topic: 'Momentum & Impulse', label: 'Inelastic collision', difficulty: 3,
    generate() {
      const m1 = pick([2, 3, 5, 8, 10]);
      const m2 = pick([2, 4, 5, 6, 8]);
      const v1 = pick([4, 6, 8, 10, 12]);
      // m2 starts at rest
      const vFinal = round((m1 * v1) / (m1 + m2), 2);
      const d = [v1, round(v1 / 2, 2), round((v1 + 0) / 2, 2)];  // trap: average
      const { options, correct_index } = buildOptions(vFinal, d, n => `${n} m/s`);
      return Q('COLL', 'Mechanical', 'Momentum & Impulse',
        `A \\(${m1}\\) kg cart moving at \\(${v1}\\) m/s collides with and sticks to a stationary \\(${m2}\\) kg cart. What is their combined velocity after the collision?`,
        options, correct_index,
        `Conservation of momentum: \\(m_1 v_1 + m_2 v_2 = (m_1 + m_2) v_f\\). Since cart 2 is at rest: \\((${m1})(${v1}) + 0 = (${m1 + m2}) v_f\\), so \\(v_f = \\frac{${m1 * v1}}{${m1 + m2}} = ${vFinal}\\) m/s. <strong>Trap:</strong> don't average the velocities — mass matters.`,
        3);
    }
  },

  // Rotational: angular velocity from linear speed
  rotational_speed: {
    section: 'Mechanical', topic: 'Gears & Pulleys', label: 'Rotational speed', difficulty: 2,
    generate() {
      const r = pick([0.2, 0.3, 0.5, 1, 1.5, 2]);  // meters
      const rpm = pick([30, 60, 90, 120, 180, 240]);
      // Linear speed v = 2πr × (rpm/60)
      const v = round(2 * Math.PI * r * rpm / 60, 2);
      const d = [round(r * rpm, 2), round(rpm * 2 * r, 2), round(v / Math.PI, 2)];
      const { options, correct_index } = buildOptions(v, d, n => `${n} m/s`);
      return Q('ROT', 'Mechanical', 'Gears & Pulleys',
        `A wheel of radius \\(${r}\\) m rotates at \\(${rpm}\\) RPM. What is the linear speed of a point on its edge?`,
        options, correct_index,
        `First convert RPM to rad/s: \\(\\omega = ${rpm} \\times \\frac{2\\pi}{60} = ${round(rpm * 2 * Math.PI / 60, 3)}\\) rad/s. Then \\(v = \\omega r = ${round(rpm * 2 * Math.PI / 60, 3)} \\times ${r} \\approx ${v}\\) m/s.`,
        2);
    }
  },

  // Spring force (Hooke's Law)
  hookes_law: {
    section: 'Mechanical', topic: 'Forces & Newton\'s Laws', label: "Hooke's Law", difficulty: 2,
    generate() {
      const k = pick([50, 100, 150, 200, 250, 400, 500]);  // N/m
      const x = pick([0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3]);  // meters
      const variant = pick(['F', 'x']);
      let q, ans, fmt, expl;
      if (variant === 'F') {
        const F = round(k * x, 2);
        q = `A spring with spring constant \\(k = ${k}\\) N/m is stretched \\(${x}\\) m from equilibrium. What force does it exert?`;
        ans = F; fmt = n => `${n} N`;
        expl = `Hooke's Law: \\(F = kx = ${k} \\times ${x} = ${F}\\) N. The negative sign in \\(F = -kx\\) just indicates direction (opposing displacement).`;
      } else {
        const F = round(k * x, 2);
        q = `A force of \\(${F}\\) N stretches a spring with spring constant \\(k = ${k}\\) N/m. How far is it stretched from equilibrium?`;
        ans = x; fmt = n => `${n} m`;
        expl = `Rearrange Hooke's Law: \\(x = \\frac{F}{k} = \\frac{${F}}{${k}} = ${x}\\) m.`;
      }
      const d = [round(ans * 2, 3), round(ans / 2, 3), round(ans + 0.05, 3)];
      const { options, correct_index } = buildOptions(ans, d, fmt);
      return Q('HOOKE', 'Mechanical', 'Forces & Newton\'s Laws', q, options, correct_index, expl, 2);
    }
  },

  // Heat transfer (Q = mcΔT)
  specific_heat: {
    section: 'Mechanical', topic: 'Heat & Thermodynamics', label: 'Specific heat', difficulty: 2,
    generate() {
      const m = pick([0.5, 1, 2, 3, 5]);    // kg
      const c = pick([900, 1000, 2000, 4186]);  // J/(kg·K) — Al, ice, oil, water
      const dT = pick([5, 10, 15, 20, 25, 50]);   // K
      const Q_val = round(m * c * dT, 0);
      const substance = c === 4186 ? 'water' : c === 2000 ? 'ice' : c === 900 ? 'aluminum' : 'oil';
      const d = [round(m * dT, 0), round(c * dT, 0), round(Q_val / 2, 0)];
      const { options, correct_index } = buildOptions(Q_val, d, n => `${n.toLocaleString()} J`);
      return Q('HEAT', 'Mechanical', 'Heat & Thermodynamics',
        `How much heat energy is needed to raise the temperature of \\(${m}\\) kg of ${substance} (specific heat \\(c = ${c}\\) J/kg·K) by \\(${dT}\\) °C?`,
        options, correct_index,
        `\\(Q = mc\\Delta T = ${m} \\times ${c} \\times ${dT} = ${Q_val.toLocaleString()}\\) J.`,
        2);
    }
  },

  // Second-class lever (wheelbarrow — mechanical advantage)
  second_class_lever: {
    section: 'Mechanical', topic: 'Levers & Torque', label: 'Second-class lever', difficulty: 3,
    generate() {
      const load = pick([60, 80, 100, 150, 200]);  // lbs
      const loadDist = pick([1, 1.5, 2]);            // ft from fulcrum
      const effortDist = pick([4, 5, 6, 8]);         // ft from fulcrum
      const effort = round((load * loadDist) / effortDist, 2);
      const MA = round(effortDist / loadDist, 2);
      const d = [load, round(load / 2, 1), round(load * loadDist, 1)];
      const { options, correct_index } = buildOptions(effort, d, n => `${n} lbs`);
      return Q('LEV2', 'Mechanical', 'Levers & Torque',
        `In a wheelbarrow (second-class lever), the load is \\(${load}\\) lbs at \\(${loadDist}\\) ft from the wheel (fulcrum). The handles are \\(${effortDist}\\) ft from the wheel. How much effort is needed to lift it?`,
        options, correct_index,
        `Lever law: \\(F_{\\text{effort}} \\times d_{\\text{effort}} = F_{\\text{load}} \\times d_{\\text{load}}\\). So \\(F_{\\text{effort}} = \\frac{${load} \\times ${loadDist}}{${effortDist}} = ${effort}\\) lbs. Mechanical advantage: \\(${effortDist}/${loadDist} = ${MA}\\) — you lift the load with \\(${MA}\\times\\) less force.`,
        3);
    }
  },

};

// ==========================================
// PUBLIC API
// ==========================================

function generateQuestions(count, filter = {}) {
  const keys = Object.keys(QUESTION_GENERATORS).filter(k => {
    const g = QUESTION_GENERATORS[k];
    if (filter.section && g.section !== filter.section) return false;
    if (filter.topic && g.topic !== filter.topic) return false;
    if (filter.difficulty && g.difficulty !== filter.difficulty) return false;
    return true;
  });

  if (keys.length === 0) return [];

  const out = [];
  for (let i = 0; i < count; i++) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    try {
      out.push(QUESTION_GENERATORS[key].generate());
    } catch (e) {
      console.warn('[Generator error]', key, e);
    }
  }
  return out;
}

function listGenerators() {
  return Object.entries(QUESTION_GENERATORS).map(([key, g]) => ({
    key,
    section: g.section,
    topic: g.topic,
    label: g.label,
    difficulty: g.difficulty,
  }));
}

// Global exposure
window.QUESTION_GENERATORS = QUESTION_GENERATORS;
window.generateQuestions = generateQuestions;
window.listGenerators = listGenerators;
