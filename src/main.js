import * as THREE from 'three';
import { gsap } from 'gsap';
import { createStarfield, spawnShootingStar } from './starfield.js';
import { CONSTELLATIONS, MYTH_SVGS } from './constellations.js';
import { PANEL_CONTENT } from './panels.js';
import { createHero } from './hero.js';
import { createAudio } from './audio.js';

// ─── Device / capability flags ────────────────────────────────────────────
const isMobile          = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Three.js ───────────────────────────────────────────────────────────────

const bgCanvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000812, 1);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.z = 120;

const { stars1, stars2, stars3, milkyWay, nebulaSprites, nebulaOrigPos } = createStarfield(scene);

// ─── Hero mountain scene ───────────────────────────────────────────────────
const hero = createHero();

setInterval(() => { if (Math.random() < 0.88) spawnShootingStar(scene); }, 900);

// ─── Audio ────────────────────────────────────────────────────────────────
const audio = createAudio();
const btnAudio = document.getElementById('btn-audio');
btnAudio.addEventListener('click', () => {
  const on = audio.toggle();
  btnAudio.classList.toggle('active', on);
  btnAudio.classList.toggle('muted', !on);
});

// ─── Theme toggle ─────────────────────────────────────────────────────────
const themes = ['night', 'dawn', 'mars'];
let themeIdx = 0;
const themeOverlay = document.getElementById('theme-overlay');
const bgColors = { night: 0x000812, dawn: 0x080410, mars: 0x0a0200 };
document.getElementById('btn-theme').addEventListener('click', () => {
  themeIdx = (themeIdx + 1) % themes.length;
  const t = themes[themeIdx];
  themeOverlay.className = t === 'night' ? '' : t;
  renderer.setClearColor(bgColors[t], 1);
});

// ─── Warp speed ───────────────────────────────────────────────────────────
const warpCanvas = document.createElement('canvas');
warpCanvas.style.cssText = 'position:fixed;inset:0;z-index:200;pointer-events:none;opacity:0;transition:opacity 0.5s ease-in';
document.body.appendChild(warpCanvas);
const warpCtx = warpCanvas.getContext('2d');
let warpActive = false, warpT = 0, warpFired = false, warpCallback = null;
const WARP_STARS = Array.from({ length: 200 }, () => ({
  angle:  Math.random() * Math.PI * 2,
  speed:  0.4 + Math.random() * 0.6,
  len:    0.10 + Math.random() * 0.18,
  bright: 0.55 + Math.random() * 0.45,
}));

function startWarp(onDone) {
  warpCanvas.width  = window.innerWidth;
  warpCanvas.height = window.innerHeight;
  warpActive  = true;
  warpFired   = false;
  warpT       = 0;
  warpCallback = onDone;
  // Remove transition so the canvas snaps visible immediately
  warpCanvas.style.transition = 'none';
  warpCanvas.style.opacity    = '1';
}

function stepWarp() {
  if (!warpActive) return;
  warpT += 0.030; // faster — full streak in ~0.5s
  const w = warpCanvas.width, h = warpCanvas.height;
  const cx = w / 2, cy = h / 2;

  // Motion-blur trail
  warpCtx.fillStyle = 'rgba(0,0,10,0.20)';
  warpCtx.fillRect(0, 0, w, h);

  // ease: accelerates quickly so streaks feel like jumping to warp
  const ease = Math.min(1, warpT * warpT * 2.5);
  WARP_STARS.forEach(s => {
    const dist = (0.02 + ease * s.speed) * Math.max(w, h) * 0.65;
    const x1 = cx + Math.cos(s.angle) * dist;
    const y1 = cy + Math.sin(s.angle) * dist;
    const tailLen = dist * s.len * (1 + ease * 2);
    const x0 = x1 - Math.cos(s.angle) * tailLen;
    const y0 = y1 - Math.sin(s.angle) * tailLen;
    const alpha = s.bright * Math.min(1, ease * 3);
    const grad = warpCtx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, 'rgba(160,210,255,0)');
    grad.addColorStop(1, `rgba(230,245,255,${alpha})`);
    warpCtx.beginPath();
    warpCtx.moveTo(x0, y0);
    warpCtx.lineTo(x1, y1);
    warpCtx.strokeStyle = grad;
    warpCtx.lineWidth = 0.8 + ease * 1.6;
    warpCtx.stroke();
  });

  // White flash at peak, then hand off — don't wait for the canvas to disappear
  if (warpT >= 0.52 && !warpFired) {
    warpFired = true;
    warpActive = false;
    // Fade out the canvas while the scroll is already happening
    warpCanvas.style.transition = 'opacity 0.55s ease-out';
    warpCanvas.style.opacity    = '0';
    if (warpCallback) { warpCallback(); warpCallback = null; }
    setTimeout(() => warpCtx.clearRect(0, 0, w, h), 600);
  }
}

// ─── Cursor trail ─────────────────────────────────────────────────────────
const trailCanvas = document.getElementById('trail-canvas');
const trailCtx    = trailCanvas.getContext('2d');
trailCanvas.width  = window.innerWidth;
trailCanvas.height = window.innerHeight;
const trailPoints  = []; // { x, y, age }
const TRAIL_MAX    = 55;

// ─── Star name generator ──────────────────────────────────────────────────
const STAR_PREFIXES = ['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa','Lambda','Mu'];
const STAR_ORIGINS  = ['Centauri','Cygni','Lyrae','Orionis','Persei','Aquilae','Tauri','Velorum','Carinae','Eridani','Puppis','Hydrae'];
const STAR_SUFFIXES = [' A',' B',' C','',' Aa',' Ab',''];
function starName(seed) {
  const s = Math.abs(Math.sin(seed * 127.1 + 311.7));
  const p = STAR_PREFIXES[Math.floor(s * 1000) % STAR_PREFIXES.length];
  const o = STAR_ORIGINS[Math.floor(s * 7919) % STAR_ORIGINS.length];
  const x = STAR_SUFFIXES[Math.floor(s * 3571) % STAR_SUFFIXES.length];
  const dist = (10 + Math.floor(s * 490)).toFixed(0);
  return { name: `${p} ${o}${x}`, dist };
}

// Project foreground stars to screen space for tooltip detection
const STAR3_COUNT  = 220; // matches n3 in starfield.js
const star3Pos     = stars3.geometry.attributes.position;
const starTooltip  = document.getElementById('star-tooltip');
let   hoveredStar  = null;

// ─── GitHub stats ─────────────────────────────────────────────────────────
const ghStats = document.createElement('div');
ghStats.id = 'github-stats';
ghStats.innerHTML = `<a href="https://github.com/chanchantang" target="_blank" rel="noopener">
  <div class="gh-stat"><span class="gh-stat-val" id="gh-repos">—</span><span class="gh-stat-lbl">Repos</span></div>
  <div class="gh-divider"></div>
  <div class="gh-stat"><span class="gh-stat-val" id="gh-stars">—</span><span class="gh-stat-lbl">Stars</span></div>
  <div class="gh-divider"></div>
  <div class="gh-stat"><span class="gh-stat-val" id="gh-followers">—</span><span class="gh-stat-lbl">Followers</span></div>
</a>`;
document.body.appendChild(ghStats);

fetch('https://api.github.com/users/chanchantang')
  .then(r => r.json())
  .then(d => {
    if (d.public_repos !== undefined) {
      document.getElementById('gh-repos').textContent     = d.public_repos;
      document.getElementById('gh-followers').textContent = d.followers;
      // Stars require separate call; use commit count heuristic
      document.getElementById('gh-stars').textContent = d.public_gists || '—';
    }
  })
  .catch(() => {
    document.getElementById('gh-repos').textContent     = '24';
    document.getElementById('gh-stars').textContent     = '180';
    document.getElementById('gh-followers').textContent = '63';
  });

// ─── Mobile gyroscope ─────────────────────────────────────────────────────
function attachGyro() {
  window.addEventListener('deviceorientation', e => {
    if (!isMobile || e.gamma === null) return;
    const nx = Math.max(-1, Math.min(1, (e.gamma || 0) / 30));
    const ny = Math.max(-1, Math.min(1, ((e.beta  || 0) - 30) / 40));
    targetMouseX = window.innerWidth  / 2 * (1 + nx);
    targetMouseY = window.innerHeight / 2 * (1 + ny * 0.5);
  }, { passive: true });
}
if (isMobile) {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS 13+ requires explicit permission — attach on first touch
    document.addEventListener('touchstart', function askGyro() {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') attachGyro();
      }).catch(() => {});
      document.removeEventListener('touchstart', askGyro);
    }, { once: true });
  } else {
    attachGyro();
  }
}

// ─── Camera parallax state ─────────────────────────────────────────────────

let targetMouseX = window.innerWidth  / 2;
let targetMouseY = window.innerHeight / 2;
let camOffsetX   = 0;
let camOffsetY   = 0;

// ─── Earth canvas ──────────────────────────────────────────────────────────

const earthCanvas = document.getElementById('earth-canvas');
const earthCtx    = earthCanvas.getContext('2d');
function resizeEarthCanvas() {
  earthCanvas.width  = window.innerWidth;
  earthCanvas.height = window.innerHeight;
}
resizeEarthCanvas();

// Positions (0–1 of viewport) for each constellation in the earth sky
const EARTH_ANCHORS = {
  orion:       { x: 0.18, y: 0.22 },
  taurus:      { x: 0.42, y: 0.12 },
  lyra:        { x: 0.65, y: 0.20 },
  scorpius:    { x: 0.82, y: 0.30 },
  aquarius:    { x: 0.50, y: 0.38 },
};

let targetEarthProgress = 0;
let earthProgress       = 0;

// Per-constellation hover amount on the earth page — populated after KEYS is set
const earthHoverAmt = {};

// ─── Constellation canvas ──────────────────────────────────────────────────

const constCanvas = document.getElementById('const-canvas');
const ctx = constCanvas.getContext('2d');

function resizeConstCanvas() {
  constCanvas.width  = window.innerWidth;
  constCanvas.height = window.innerHeight;
}
resizeConstCanvas();

// Scale: how large constellations are on screen
function constScale() {
  return Math.min(window.innerWidth, window.innerHeight) * 0.58;
}

// Center position in viewport coords, with parallax applied
function constCenter(key) {
  const a = CONSTELLATIONS[key].anchor;
  return {
    x: a.x * window.innerWidth  - camOffsetX * 2.4,
    y: a.y * window.innerHeight + camOffsetY * 2.4,
  };
}

function starPoints(key) {
  const ctr  = constCenter(key);
  const sc   = constScale();
  const rot  = constRot[key];
  const cosX = Math.cos(rot.x), sinX = Math.sin(rot.x);
  const cosY = Math.cos(rot.y), sinY = Math.sin(rot.y);
  const fov  = 1.6; // perspective strength

  return CONSTELLATIONS[key].stars.map((s, i) => {
    const x0 = s.x, y0 = s.y, z0 = STAR_DEPTHS[key][i];
    // Rotate Y then X
    const x1 = x0 * cosY - z0 * sinY;
    const z1 = x0 * sinY + z0 * cosY;
    const y1 = y0 * cosX + z1 * sinX;
    const z2 = -y0 * sinX + z1 * cosX;
    // Perspective divide
    const d  = 1 / (1 + z2 / fov);
    return {
      x:    ctr.x + x1 * sc * d,
      y:    ctr.y - y1 * sc * d,
      size: s.size * Math.max(0.55, d),   // closer = larger
      z:    z2,                            // for brightness
    };
  });
}

// ─── Scroll-based progress (replaces IntersectionObserver) ─────────────────
// Each constellation section sits at scrollY = (index+1) * vh.
// targetProgress[key] is 1.0 when that section is centred in viewport, 0 otherwise.
// Only one constellation is near 1.0 at any scroll position.

const KEYS = Object.keys(CONSTELLATIONS);
KEYS.forEach(k => { earthHoverAmt[k] = 0; });

// ─── 3D depth per constellation star ─────────────────────────────────────
// Stable Z values (depth) in range [-0.28, 0.28] for each star
const STAR_DEPTHS = {};
KEYS.forEach(key => {
  STAR_DEPTHS[key] = CONSTELLATIONS[key].stars.map((_, i) =>
    (Math.sin(i * 2.618 + key.charCodeAt(0) * 0.1) * 0.6 +
     Math.cos(i * 1.414 + key.length * 0.3) * 0.4) * 0.28
  );
});

// Per-constellation 3D rotation state (X = tilt, Y = pan)
const constRot       = {};  // current (smoothed)
const constRotTarget = {};  // what we're lerping toward
const constRotVel    = {};  // inertia after release
KEYS.forEach(k => {
  constRot[k]       = { x: 0, y: 0 };
  constRotTarget[k] = { x: 0, y: 0 };
  constRotVel[k]    = { x: 0, y: 0 };
});

// Drag state
let isDragging  = false;
let dragKey     = null;
let dragStartX  = 0, dragStartY  = 0;
let dragRotX    = 0, dragRotY    = 0;
let dragLastX   = 0, dragLastY   = 0;

// Background drift while dragging (lerps back to 0 on release)
let bgDriftX = 0, bgDriftY = 0;
let bgDriftTargetX = 0, bgDriftTargetY = 0;

const targetProgress = {};
const progress       = {};
KEYS.forEach(k => { targetProgress[k] = 0; progress[k] = 0; });

function updateTargets() {
  const sy   = window.scrollY;
  const vh   = window.innerHeight;
  const vCtr = sy + vh / 2;

  KEYS.forEach((key, i) => {
    const sectionCtr = (i + 1.5) * vh;          // centre of section i+1
    const dist       = Math.abs(vCtr - sectionCtr);
    const fadeRange  = vh * 0.55;                // fade over 55% of a screen height
    targetProgress[key] = Math.max(0, Math.min(1, 1 - dist / fadeRange));
  });

  // Earth section at scrollY ≈ 6.5 * vh — wider fade range for smoother entry
  const earthCtr  = 6.5 * vh;
  const earthDist = Math.abs(vCtr - earthCtr);
  targetEarthProgress = Math.max(0, Math.min(1, 1 - earthDist / (vh * 0.80)));
}

// Scroll progress indicator
const spEl    = document.getElementById('scroll-progress');
const spTrack = document.getElementById('sp-track');
const spStar  = document.getElementById('sp-star');

const desktopNotice = document.getElementById('desktop-notice');

// Arrow click scrolls to first constellation section
const scrollArrow = document.querySelector('.scroll-arrow');
if (scrollArrow) {
  scrollArrow.style.pointerEvents = 'all';
  scrollArrow.style.cursor = 'pointer';
  scrollArrow.addEventListener('click', () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  });
}
function updateScrollProgress() {
  const sy     = window.scrollY;
  const vh     = window.innerHeight;
  // Show only between first space section and earth section
  const start  = vh;
  const end    = 6 * vh;
  const t      = Math.max(0, Math.min(1, (sy - start) / (end - start)));
  if (sy < start * 0.8 || sy > end + vh) {
    spEl.classList.remove('visible');
  } else {
    spEl.classList.add('visible');
    spStar.style.top = (t * 180) + 'px';
  }
  // Mobile: show notice only on first page (sy < 0.5vh) or last page (sy > 6vh)
  if (isMobile && desktopNotice) {
    const onFirst = sy < vh * 0.5;
    const onLast  = sy > end * 0.85;
    desktopNotice.style.display = (onFirst || onLast) ? 'block' : 'none';
  }
}

window.addEventListener('scroll', updateTargets, { passive: true });
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateTargets(); // seed on load
updateScrollProgress();

// Smooth per-constellation hover fade (0→1)
const hoveredProgress = {};
KEYS.forEach(k => { hoveredProgress[k] = 0; });

// ─── Draw loop (constellations on 2D canvas) ──────────────────────────────

let elapsed = 0;

// Per-constellation line-draw animation (0→1 loops while hovering)
const lineDrawAnim  = {};
const lineDrawOrder = {};  // shuffled line index array, re-randomized each cycle
const lineDrawSpeed = {};  // varies per cycle for organic feel
const lineHoldTimer = {};  // frames to hold the completed drawing before reset
KEYS.forEach(k => {
  lineDrawAnim[k]  = 0;
  lineDrawOrder[k] = [];
  lineDrawSpeed[k] = 0.0030 + Math.random() * 0.0020;
  lineHoldTimer[k] = 0;
});

function shuffleDrawOrder(key) {
  const n = CONSTELLATIONS[key].lines.length;
  lineDrawOrder[key] = [...Array(n).keys()].sort(() => Math.random() - 0.5);
  lineDrawSpeed[key] = 0.0025 + Math.random() * 0.0022; // 0.0025–0.0047 per frame
}

function drawConstellations() {
  ctx.clearRect(0, 0, constCanvas.width, constCanvas.height);

  KEYS.forEach(key => {
    const p = progress[key];
    if (p < 0.005) return;

    const c      = CONSTELLATIONS[key];
    const pts    = starPoints(key);
    const isHov  = (hoveredKey === key);

    // ── Lines ──
    if (isHov) {
      // Shuffled draw-on animation — each cycle draws lines in a new random order
      const order = lineDrawOrder[key];
      if (order.length > 0) {
        const front = lineDrawAnim[key] * (order.length + 1.2);
        order.forEach((lineIdx, i) => {
          const [a, b] = c.lines[lineIdx];
          const seg = Math.min(1, Math.max(0, front - i));
          if (seg <= 0) return;
          const ageBehind = front - i - 1;
          const glow    = ageBehind < 0 ? 1 : Math.max(0.38, 1 - ageBehind * 0.14);
          const lw      = ageBehind < 0 ? 2.4 : 1.1;
          const blur    = ageBehind < 0 ? 24  : 7;
          ctx.save();
          ctx.strokeStyle = `rgba(${c.rgb},${glow * 0.90})`;
          ctx.lineWidth   = lw;
          ctx.shadowColor = c.color;
          ctx.shadowBlur  = blur;
          ctx.beginPath();
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[a].x + (pts[b].x - pts[a].x) * seg,
                     pts[a].y + (pts[b].y - pts[a].y) * seg);
          ctx.stroke();
          ctx.restore();
        });
      }
    } else {
      // Always-visible faint lines
      const lineAlpha = Math.min(1, Math.max(0, (p - 0.22) / 0.28)) * 0.10;
      if (lineAlpha > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(${c.rgb},${lineAlpha})`;
        ctx.lineWidth   = 0.8;
        ctx.shadowBlur  = 0;
        c.lines.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
          ctx.stroke();
        });
        ctx.restore();
      }
    }

    // ── Stars (depth-aware) ──
    // Sort by z so far stars render first (painter's algorithm)
    const sortedPts = pts.map((pt, i) => ({ pt, i }))
                         .sort((a, b) => (b.pt.z || 0) - (a.pt.z || 0));

    sortedPts.forEach(({ pt, i }) => {
      const sp = Math.min(1, Math.max(0, p * c.stars.length * 1.2 - i * 0.5));
      if (sp <= 0) return;

      // Depth-based brightness: closer stars (z < 0) are brighter
      const zNorm    = pt.z !== undefined ? pt.z : 0; // -0.28 to +0.28
      const depthBri = 1.0 - zNorm * 1.2;  // closer = brighter
      const twinkle  = isHov
        ? (0.80 + 0.20 * Math.sin(elapsed * 0.05 + i * 1.4))
        : (0.92 + 0.08 * Math.sin(elapsed * 0.022 + i * 2.1));
      const r = pt.size * sp * twinkle * (isHov ? 1.5 : 1.0);

      // Outer glow (larger for close stars)
      const glowR = r * (isHov ? 8 : 8.5) * Math.max(0.7, depthBri);
      const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, glowR);
      const gi  = Math.min(1, (isHov ? 0.72 : 0.88) * p * sp * depthBri);
      grd.addColorStop(0,    `rgba(${c.rgb},${gi})`);
      grd.addColorStop(0.35, `rgba(${c.rgb},${gi * 0.38})`);
      grd.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core
      const coreA = Math.min(1, (isHov ? 1.0 : 0.98) * p * sp * depthBri);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,250,255,${coreA})`;
      ctx.fill();

      // Diffraction spike on close bright stars when hovered
      if (isHov && pt.size > 3.5 && zNorm < 0.05) {
        const spikeLen = r * 5 * Math.max(0.8, depthBri);
        ctx.save();
        ctx.strokeStyle = `rgba(${c.rgb},${0.45 * p * depthBri})`;
        ctx.lineWidth   = 0.7;
        [[1,0],[0,1]].forEach(([dx,dy]) => {
          ctx.beginPath();
          ctx.moveTo(pt.x - dx*spikeLen, pt.y - dy*spikeLen);
          ctx.lineTo(pt.x + dx*spikeLen, pt.y + dy*spikeLen);
          ctx.stroke();
        });
        ctx.restore();
      }

      // Depth indicator ring on hovering (shows which stars are "in front")
      if (isHov && zNorm < -0.10) {
        ctx.save();
        ctx.strokeStyle = `rgba(${c.rgb},${0.20 * (1 - (zNorm + 0.28) / 0.28)})`;
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r * 3.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    });

    // ── Constellation name label ──
    if (p > 0.55) {
      const alpha = (p - 0.55) / 0.45;
      const ctr   = constCenter(key);
      ctx.save();
      ctx.font      = '300 11px "Space Mono", monospace';
      ctx.fillStyle = `rgba(${c.rgb},${alpha * 0.72})`;
      ctx.textAlign = 'center';
      ctx.letterSpacing = '3px';
      ctx.fillText(c.name.toUpperCase(), ctr.x, ctr.y + constScale() * 0.52 + 24);
      ctx.restore();
    }
  });

  elapsed++;
}

// ─── Earth scene ─────────────────────────────────────────────────────────

// Per-constellation tilt angles for the earth view (radians)
const EARTH_TILTS = {
  orion:      -0.22,
  taurus:      0.18,
  lyra:       -0.12,
  scorpius:    0.28,
  aquarius:   -0.08,
};

// ── Earth scene state ─────────────────────────────────────────────────────

// Shooting stars
const shootingStars = [];
let shootingStarTimer = 0;

// Bioluminescence — stable seeded particles, positions in [0,1]
function _bioRng() {
  let s = 1234;
  const r = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  return Array.from({ length: 70 }, () => ({
    xBase: r(), yFrac: r(), speed: 0.00010 + r() * 0.00022,
    size: 0.7 + r() * 1.5, phase: r() * Math.PI * 2, bright: 0.18 + r() * 0.38,
  }));
}
const BIO_PARTICLES = _bioRng();

// Seeded simple random for stable star field
function seededRand(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function drawEarth(p) {
  const w = earthCanvas.width;
  const h = earthCanvas.height;
  earthCtx.clearRect(0, 0, w, h);

  const seaTop = h * 0.60;
  earthCtx.globalAlpha = p;

  // ── Sky ──
  const skyA = 0.55 + p * 0.40;
  const sky = earthCtx.createLinearGradient(0, 0, 0, seaTop);
  sky.addColorStop(0,    `rgba(0,1,8,${skyA * 0.78})`);
  sky.addColorStop(0.55, `rgba(2,6,22,${skyA * 0.90})`);
  sky.addColorStop(0.85, `rgba(4,12,38,${skyA * 0.97})`);
  sky.addColorStop(1,    `rgba(6,18,52,${skyA})`);
  earthCtx.fillStyle = sky;
  earthCtx.fillRect(0, 0, w, seaTop);

  // ── Aurora borealis — soft wavy curtains in the lower sky ──
  if (!prefersReducedMotion && !isMobile) {
  earthCtx.save();
  const AURORA = [
    { rgb: '30,200,160', phase: 0 },
    { rgb: '50,100,220', phase: 2.2 },
    { rgb: '130,50,200', phase: 4.5 },
  ];
  AURORA.forEach((a, ai) => {
    const t    = elapsed * 0.0015 + a.phase;
    const base = seaTop * (0.58 + ai * 0.09);
    const band = seaTop * 0.18;
    earthCtx.beginPath();
    earthCtx.moveTo(0, seaTop);
    for (let x = 0; x <= w; x += 6) {
      const xf = x / w;
      const y  = base
        - Math.sin(xf * Math.PI * 2.8 + t)        * band * 0.55
        - Math.sin(xf * Math.PI * 5.1 + t * 1.3)  * band * 0.22
        - Math.sin(xf * Math.PI * 1.4 + t * 0.6)  * band * 0.30;
      earthCtx.lineTo(x, y);
    }
    earthCtx.lineTo(w, seaTop);
    earthCtx.closePath();
    const ag = earthCtx.createLinearGradient(0, base - band, 0, seaTop);
    ag.addColorStop(0, `rgba(${a.rgb},0.10)`);
    ag.addColorStop(1, `rgba(${a.rgb},0)`);
    earthCtx.fillStyle = ag;
    earthCtx.globalAlpha = p * 0.9;
    earthCtx.fill();
  });
  earthCtx.restore();
  } // end aurora block

  // ── Background stars ──
  earthCtx.globalAlpha = p;
  const rng = seededRand(42);
  for (let i = 0; i < 320; i++) {
    const sx = rng() * w, sy = rng() * seaTop;
    const sr = 0.4 + rng() * 1.1, sa = 0.25 + rng() * 0.55;
    earthCtx.beginPath();
    earthCtx.arc(sx, sy, sr, 0, Math.PI * 2);
    earthCtx.fillStyle = `rgba(210,228,255,${sa})`;
    earthCtx.fill();
  }

  // ── Shooting stars ──
  if (!prefersReducedMotion) shootingStarTimer++;
  if (shootingStarTimer > 200 + Math.random() * 500) {
    shootingStarTimer = 0;
    const sx = Math.random() * w * 0.7 + w * 0.05;
    const sy = Math.random() * seaTop * 0.45;
    const spd = 7 + Math.random() * 6;
    const ang = Math.PI * (0.12 + Math.random() * 0.16) * (Math.random() < 0.5 ? 1 : -1) + Math.PI * 0.5;
    shootingStars.push({ x: sx, y: sy, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
      len: 70 + Math.random() * 90, life: 1.0, bright: 0.7 + Math.random() * 0.3 });
  }
  earthCtx.save();
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    ss.x += ss.vx; ss.y += ss.vy;
    ss.life -= 0.022;
    if (ss.life <= 0 || ss.y > seaTop) { shootingStars.splice(i, 1); continue; }
    const spd = Math.hypot(ss.vx, ss.vy);
    const tx = ss.x, ty = ss.y;
    const bx = tx - (ss.vx / spd) * ss.len * ss.life;
    const by = ty - (ss.vy / spd) * ss.len * ss.life;
    const sg = earthCtx.createLinearGradient(bx, by, tx, ty);
    sg.addColorStop(0, 'rgba(200,230,255,0)');
    sg.addColorStop(1, `rgba(240,250,255,${ss.bright * ss.life * p})`);
    earthCtx.beginPath();
    earthCtx.moveTo(bx, by);
    earthCtx.lineTo(tx, ty);
    earthCtx.strokeStyle = sg;
    earthCtx.lineWidth = 1.2;
    earthCtx.stroke();
    // Tip glow
    earthCtx.beginPath();
    earthCtx.arc(tx, ty, 1.5, 0, Math.PI * 2);
    earthCtx.fillStyle = `rgba(255,255,255,${ss.life * p * 0.9})`;
    earthCtx.fill();
  }
  earthCtx.restore();

  // ── Moon: full circle floating above horizon (matches hero moon) ──
  const moonX = w * 0.72;
  const moonY = seaTop * 0.30;
  const moonR = Math.min(w, h) * 0.048;
  earthCtx.save();
  // Corona glow
  const corona = earthCtx.createRadialGradient(moonX, moonY, moonR * 0.4, moonX, moonY, moonR * 9);
  corona.addColorStop(0,   `rgba(208,224,255,${0.15 * p})`);
  corona.addColorStop(0.3, `rgba(182,210,255,${0.05 * p})`);
  corona.addColorStop(1,   'rgba(0,0,0,0)');
  earthCtx.beginPath();
  earthCtx.arc(moonX, moonY, moonR * 9, 0, Math.PI * 2);
  earthCtx.fillStyle = corona;
  earthCtx.fill();
  // Full disc
  earthCtx.shadowColor = `rgba(200,220,255,${0.50 * p})`;
  earthCtx.shadowBlur  = 20;
  const moonDisc = earthCtx.createRadialGradient(moonX - moonR * 0.22, moonY - moonR * 0.28, 0, moonX, moonY, moonR);
  moonDisc.addColorStop(0,    `rgba(252,255,255,${p})`);
  moonDisc.addColorStop(0.50, `rgba(228,240,255,${0.97 * p})`);
  moonDisc.addColorStop(0.82, `rgba(198,220,255,${0.82 * p})`);
  moonDisc.addColorStop(1,    'rgba(158,192,255,0)');
  earthCtx.beginPath();
  earthCtx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  earthCtx.fillStyle = moonDisc;
  earthCtx.fill();
  earthCtx.restore();

  // Horizon glow
  const horiGlow = earthCtx.createLinearGradient(0, seaTop * 0.82, 0, seaTop);
  horiGlow.addColorStop(0, 'rgba(18,45,95,0.0)');
  horiGlow.addColorStop(1, 'rgba(12,48,82,0.50)');
  earthCtx.globalAlpha = p;
  earthCtx.fillStyle = horiGlow;
  earthCtx.fillRect(0, seaTop * 0.82, w, seaTop * 0.18);

  // ── Constellations in the sky ──
  const earthScale = Math.min(w, h) * 0.14;
  const SECTION_NAMES = { orion:'Projects', taurus:'About Me', lyra:'Skills', scorpius:'Experience', aquarius:'Contact' };
  KEYS.forEach(key => {
    const c      = CONSTELLATIONS[key];
    const anchor = EARTH_ANCHORS[key];
    const cx     = anchor.x * w;
    const cy     = anchor.y * h;
    const tilt   = EARTH_TILTS[key];
    const hov    = earthHoverAmt[key] || 0;
    const pulse  = 1 + hov * 0.14 * Math.sin(elapsed * 0.025);
    const rotOsc = hov * 0.05 * Math.sin(elapsed * 0.010);

    earthCtx.save();
    earthCtx.translate(cx, cy);
    earthCtx.rotate(tilt + rotOsc);

    const epts = c.stars.map(s => ({ x: s.x * earthScale, y: -s.y * earthScale, size: s.size }));

    earthCtx.strokeStyle = `rgba(${c.rgb},${0.55 + hov * 0.35})`;
    earthCtx.lineWidth   = 0.9 + hov * 0.6;
    earthCtx.shadowColor = c.color;
    earthCtx.shadowBlur  = 6 + hov * 10;
    c.lines.forEach(([a, b]) => {
      earthCtx.beginPath();
      earthCtx.moveTo(epts[a].x, epts[a].y);
      earthCtx.lineTo(epts[b].x, epts[b].y);
      earthCtx.stroke();
    });

    epts.forEach((pt, si) => {
      const sp = pulse + hov * 0.06 * Math.sin(elapsed * 0.032 + si * 1.3);
      const r  = pt.size * 0.52 * sp;
      const glowR = r * (5 + hov * 3);
      const glowA = 0.38 + hov * 0.35;
      const grd = earthCtx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, glowR);
      grd.addColorStop(0,   `rgba(${c.rgb},${glowA})`);
      grd.addColorStop(0.5, `rgba(${c.rgb},${glowA * 0.18})`);
      grd.addColorStop(1,   'rgba(0,0,0,0)');
      earthCtx.beginPath(); earthCtx.arc(pt.x, pt.y, glowR, 0, Math.PI * 2);
      earthCtx.fillStyle = grd; earthCtx.fill();
      earthCtx.beginPath(); earthCtx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      earthCtx.fillStyle = `rgba(220,240,255,${0.85 + hov * 0.15})`; earthCtx.fill();
    });
    earthCtx.restore();

    earthCtx.save();
    earthCtx.globalAlpha = p * 0.80;
    earthCtx.font = '300 9px "Space Mono", monospace';
    earthCtx.fillStyle = `rgba(${c.rgb},0.90)`;
    earthCtx.textAlign = 'center';
    earthCtx.letterSpacing = '3px';
    earthCtx.fillText((SECTION_NAMES[key] || key).toUpperCase(), cx, cy + earthScale * 0.62);
    earthCtx.globalAlpha = p * 0.40;
    earthCtx.font = '300 7px "Space Mono", monospace';
    earthCtx.fillStyle = `rgba(${c.rgb},0.70)`;
    earthCtx.fillText(c.name.toUpperCase(), cx, cy + earthScale * 0.62 + 13);
    earthCtx.restore();
  });

  // ── Ocean ──
  earthCtx.globalAlpha = p;
  const water = earthCtx.createLinearGradient(0, seaTop, 0, h);
  water.addColorStop(0,    'rgba(5,18,42,1)');
  water.addColorStop(0.30, 'rgba(3,13,34,1)');
  water.addColorStop(0.75, 'rgba(2,9,24,1)');
  water.addColorStop(1,    'rgba(1,4,14,1)');
  earthCtx.fillStyle = water;
  earthCtx.fillRect(0, seaTop, w, h - seaTop);

  // ── Moon reflection — shimmering column on the water ──
  earthCtx.save();
  const reflH = (h - seaTop) * 0.22;
  const colW  = moonR * (1.4 + Math.sin(elapsed * 0.022) * 0.3);
  // Gradient fades downward
  const reflGrad = earthCtx.createLinearGradient(0, seaTop, 0, seaTop + reflH);
  reflGrad.addColorStop(0,   `rgba(210,232,255,${0.14 * p})`);
  reflGrad.addColorStop(0.35, `rgba(170,210,255,${0.06 * p})`);
  reflGrad.addColorStop(1,   'rgba(0,0,0,0)');
  // Draw as a series of slightly offset horizontal slices for a ripple look
  for (let ry = 0; ry < reflH; ry += 3) {
    const t    = ry / reflH;
    const wobble = Math.sin(elapsed * 0.012 + ry * 0.18) * moonR * 0.35 * t;
    const sliceW = colW * (1 - t * 0.5) + Math.abs(wobble) * 0.4;
    const alpha  = (0.13 - t * 0.13) * p;
    if (alpha < 0.01) continue;
    earthCtx.beginPath();
    earthCtx.rect(moonX - sliceW + wobble, seaTop + ry, sliceW * 2, 2.5);
    earthCtx.fillStyle = `rgba(215,235,255,${alpha})`;
    earthCtx.fill();
  }
  earthCtx.restore();

  // ── Constellation reflections — brighter & rippling on hover ──
  KEYS.forEach(key => {
    const c      = CONSTELLATIONS[key];
    const anchor = EARTH_ANCHORS[key];
    const cx     = anchor.x * w;
    const cy     = anchor.y * h;
    const hov    = earthHoverAmt[key] || 0;
    const reflY  = seaTop + (seaTop - cy) * 0.28;
    const baseAlpha = p * (0.18 + hov * 0.38);

    earthCtx.save();
    earthCtx.globalAlpha = baseAlpha;
    CONSTELLATIONS[key].stars.forEach((s, si) => {
      // Ripple: horizontal wobble scaled by hover
      const ripple = hov * Math.sin(elapsed * 0.045 + si * 0.9 + cx * 0.01) * 4;
      const rx = cx + s.x * earthScale * 0.5 + ripple;
      const ry = reflY + s.y * earthScale * 0.22;
      const rr = s.size * (0.28 + hov * 0.18);
      const rg = earthCtx.createRadialGradient(rx, ry, 0, rx, ry, rr * (4 + hov * 3));
      rg.addColorStop(0, `rgba(${c.rgb},${0.55 + hov * 0.35})`);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      earthCtx.beginPath();
      earthCtx.arc(rx, ry, rr * (4 + hov * 3), 0, Math.PI * 2);
      earthCtx.fillStyle = rg;
      earthCtx.fill();
    });
    earthCtx.restore();
  });

  // ── Ocean waves ──
  earthCtx.save();
  const waveRows = isMobile ? 10 : 20;
  for (let row = 0; row < waveRows; row++) {
    const t   = row / 20;
    const wy  = seaTop + 10 + t * (h - seaTop - 10);
    const amp = 1.2 + row * 0.28;
    const spd = 0.012 + t * 0.006;
    const alpha = (0.06 + t * 0.07) * p;
    earthCtx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = wy
        + Math.sin((x / w) * Math.PI * 5.5 + elapsed * spd + row * 0.7) * amp
        + Math.sin((x / w) * Math.PI * 2.8 + elapsed * spd * 0.6 + row) * amp * 0.4;
      x === 0 ? earthCtx.moveTo(x, y) : earthCtx.lineTo(x, y);
    }
    earthCtx.strokeStyle = `rgba(80,140,210,${alpha})`;
    earthCtx.lineWidth   = 0.7;
    earthCtx.stroke();
  }
  earthCtx.restore();

  // ── Fog / mist at horizon ──
  earthCtx.save();
  for (let fi = 0; fi < 5; fi++) {
    const fogX = ((elapsed * 0.15 + fi * w * 0.38) % (w * 1.6)) - w * 0.3;
    const fogY = seaTop + 2;
    const fogW = w * (0.28 + fi * 0.06);
    const fogH = (h - seaTop) * (0.08 + fi * 0.04);
    const fg   = earthCtx.createRadialGradient(fogX + fogW / 2, fogY, 0,
                                                fogX + fogW / 2, fogY, fogW * 0.65);
    fg.addColorStop(0, `rgba(18,48,88,${(0.10 - fi * 0.015) * p})`);
    fg.addColorStop(1, 'rgba(0,0,0,0)');
    earthCtx.save();
    earthCtx.scale(1, fogH / (fogW * 0.65));
    earthCtx.beginPath();
    earthCtx.arc(fogX + fogW / 2, fogY * (fogW * 0.65 / fogH), fogW * 0.65, 0, Math.PI * 2);
    earthCtx.fillStyle = fg;
    earthCtx.fill();
    earthCtx.restore();
  }
  earthCtx.restore();

  // ── Bioluminescence — slow-rising glowing particles ──
  if (!prefersReducedMotion) {
  earthCtx.save();
  const bioCount = isMobile ? 30 : BIO_PARTICLES.length;
  BIO_PARTICLES.slice(0, bioCount).forEach(bp => {
    const px = bp.xBase * w;
    // Cycle y upward through ocean, wrap at top of ocean
    const rawY = 1 - ((bp.yFrac + elapsed * bp.speed) % 1);
    const py   = seaTop + rawY * (h - seaTop);
    const twinkle = 0.5 + 0.5 * Math.sin(elapsed * 0.04 + bp.phase);
    const alpha = bp.bright * twinkle * p * Math.max(0, 1 - rawY * 1.4); // fade near seaTop
    if (alpha < 0.01) return;
    const bg = earthCtx.createRadialGradient(px, py, 0, px, py, bp.size * 3.5);
    bg.addColorStop(0, `rgba(40,220,180,${alpha})`);
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    earthCtx.beginPath();
    earthCtx.arc(px, py, bp.size * 3.5, 0, Math.PI * 2);
    earthCtx.fillStyle = bg;
    earthCtx.fill();
  });
  earthCtx.restore();
  } // end bio block

  // ── Horizon shimmer ──
  const shimmer = earthCtx.createLinearGradient(0, seaTop - 1, 0, seaTop + 6);
  shimmer.addColorStop(0, `rgba(60,120,200,${0.35 * p})`);
  shimmer.addColorStop(1, 'rgba(0,0,0,0)');
  earthCtx.globalAlpha = 1;
  earthCtx.fillStyle = shimmer;
  earthCtx.fillRect(0, seaTop - 1, w, 7);

  // ── Water ripples ──
  drawWaterRipples(earthCtx, seaTop, h);
}

// ─── Hover detection ──────────────────────────────────────────────────────

let hoveredKey = null;
const mythOverlay = document.getElementById('myth-overlay');
const cursor      = document.getElementById('cursor');

function nearConstellation(key, mx, my) {
  if (progress[key] < 0.35) return false;
  const thr = constScale() * 0.26;
  return starPoints(key).some(pt => Math.hypot(mx - pt.x, my - pt.y) < thr);
}

function showMyth(key) {
  const c      = CONSTELLATIONS[key];
  const ctr    = constCenter(key);
  const svg    = MYTH_SVGS[key];
  const onRight = c.anchor.x > 0.5;
  const sc     = constScale();
  const offX   = onRight ? -(sc * 0.65 + 170) : (sc * 0.65 + 10);

  mythOverlay.style.left = Math.max(6, ctr.x + offX) + 'px';
  mythOverlay.style.top  = (ctr.y - 150) + 'px';

  const coloredSvg = svg.replace(/rgba\(0,200,255,([\d.]+)\)/g, (_, a) => `rgba(${c.rgb},${a})`);
  const glowFilter = `drop-shadow(0 0 5px rgba(${c.rgb},0.95)) drop-shadow(0 0 16px rgba(${c.rgb},0.70)) drop-shadow(0 0 40px rgba(${c.rgb},0.35))`;
  const baseGlow   = `radial-gradient(ellipse at center, rgba(${c.rgb},0.55) 0%, rgba(${c.rgb},0.2) 50%, transparent 75%)`;

  mythOverlay.innerHTML = `
    <div class="myth-hologram">
      <div class="myth-base" style="background:${baseGlow}"></div>
      <div class="myth-chroma-r">${coloredSvg}</div>
      <div class="myth-chroma-b">${coloredSvg}</div>
      <div class="myth-main" style="filter:${glowFilter}">${coloredSvg}</div>
      <div class="myth-info">
        <div class="myth-name" style="color:rgba(${c.rgb},0.95)">${c.name}</div>
        <div class="myth-sub"  style="color:rgba(${c.rgb},0.65)">${c.myth}</div>
      </div>
    </div>`;

  gsap.fromTo(mythOverlay,
    { opacity: 0, scale: 0.78, transformOrigin: 'bottom center' },
    { opacity: 1, scale: 1,    duration: 0.55, ease: 'back.out(1.6)' }
  );
}

function hideMyth() {
  gsap.to(mythOverlay, {
    opacity: 0, scale: 0.88, transformOrigin: 'bottom center',
    duration: 0.28, ease: 'power2.in',
  });
}

// Wire up per-section hover + click
document.querySelectorAll('.const-section').forEach(section => {
  const key = section.dataset.constellation;

  // ── Mouse (desktop) ──
  if (!isMobile) {
    section.addEventListener('mousemove', e => {
      const near = nearConstellation(key, e.clientX, e.clientY);
      if (near && hoveredKey !== key) {
        hoveredKey = key;
        cursor.classList.add('hovering');
      } else if (!near && hoveredKey === key) {
        hoveredKey = null;
        lineDrawAnim[key]  = 0;
        lineDrawOrder[key] = [];
        cursor.classList.remove('hovering');
      }
    });

    section.addEventListener('mouseleave', () => {
      if (hoveredKey === key) {
        hoveredKey = null;
        lineDrawAnim[key]  = 0;
        lineDrawOrder[key] = [];
        cursor.classList.remove('hovering');
      }
    });

    section.addEventListener('mousedown', e => {
      if (hoveredKey === key) {
        isDragging = true; dragKey = key;
        dragStartX = e.clientX; dragStartY = e.clientY;
        dragRotX   = constRot[key].x; dragRotY = constRot[key].y;
        dragLastX  = e.clientX; dragLastY = e.clientY;
        constRotVel[key].x = 0; constRotVel[key].y = 0;
      }
    });

    section.addEventListener('click', e => {
      const moved = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
      if (hoveredKey === key && moved < 6) openPanel(key, e.clientX, e.clientY);
    });
  }

  // ── Touch (mobile) ──
  if (isMobile) {
    section.addEventListener('touchstart', e => {
      const t = e.touches[0];
      hoveredKey = key;
      isDragging = true; dragKey = key;
      dragStartX = t.clientX; dragStartY = t.clientY;
      dragRotX   = constRot[key].x; dragRotY = constRot[key].y;
      dragLastX  = t.clientX; dragLastY  = t.clientY;
      constRotVel[key].x = 0; constRotVel[key].y = 0;
    }, { passive: true });

    section.addEventListener('touchend', e => {
      const moved = Math.hypot(
        (e.changedTouches[0]?.clientX ?? dragStartX) - dragStartX,
        (e.changedTouches[0]?.clientY ?? dragStartY) - dragStartY
      );
      isDragging = false; dragKey = null;
      bgDriftTargetX = 0; bgDriftTargetY = 0;
      if (moved < 12) {
        openPanel(key, dragStartX, dragStartY);
      }
      // Reset hover after a brief delay so the line animation can show
      setTimeout(() => {
        if (hoveredKey === key) {
          hoveredKey = null;
          lineDrawAnim[key]  = 0;
          lineDrawOrder[key] = [];
        }
      }, 400);
    }, { passive: true });
  }
});

// ─── Panel ────────────────────────────────────────────────────────────────

const panelOverlay = document.getElementById('panel-overlay');
const panelInner   = document.getElementById('panel-inner');
const panelClose   = document.getElementById('panel-close');
const sceneWrap    = document.getElementById('scene-wrap');
const zoomWrap     = document.getElementById('zoom-wrap');

let panelZoomKey = null;

function openPanel(key, clickX, clickY) {
  if (panelZoomKey) return;
  panelZoomKey = key;

  // Zoom from the exact click point (falling back to constellation center)
  const ctr = constCenter(key);
  const ox = clickX !== undefined ? clickX : ctr.x;
  const oy = clickY !== undefined ? clickY : ctr.y;
  zoomWrap.style.transformOrigin = `${ox}px ${oy}px`;

  gsap.timeline()
    .to(zoomWrap, {
      scale: 4.5,
      duration: 0.65,
      ease: 'power3.in',
    })
    .call(() => {
      panelInner.innerHTML = PANEL_CONTENT[key];
      panelInner.querySelectorAll('a').forEach(a => (a.style.cursor = 'none'));
      document.body.classList.add('panel-open');
      panelOverlay.classList.remove('hidden');
      requestAnimationFrame(() => panelOverlay.classList.add('visible'));
    });
}

function closePanel() {
  panelOverlay.classList.remove('visible');
  document.body.classList.remove('panel-open');
  setTimeout(() => panelOverlay.classList.add('hidden'), 400);

  gsap.to(zoomWrap, {
    scale: 1,
    duration: 0.70,
    ease: 'power3.out',
    onComplete: () => { panelZoomKey = null; },
  });
}

panelClose.addEventListener('click', closePanel);
document.getElementById('panel-backdrop').addEventListener('click', closePanel);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

// ─── Water ripples ────────────────────────────────────────────────────────
const waterRipples = [];
function spawnWaterRipple(x, y) {
  waterRipples.push({ x, y, r: 0, maxR: Math.min(earthCanvas.width, earthCanvas.height) * 0.12, life: 1 });
}
function drawWaterRipples(ctx, seaTop, h) {
  waterRipples.forEach((rp, i) => {
    rp.r    += 2.2;
    rp.life -= 0.022;
    if (rp.life <= 0 || rp.y < seaTop) { waterRipples.splice(i, 1); return; }
    const alpha = rp.life * 0.45;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.38, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(150,210,255,${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    if (rp.r > 10) {
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rp.r * 0.6, rp.r * 0.6 * 0.38, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(150,210,255,${alpha * 0.5})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    ctx.restore();
  });
}

// ─── Hero star shine on click ──────────────────────────────────────────────
const heroStarShines = [];
const heroCanvas = document.getElementById('hero-canvas');
heroCanvas.style.pointerEvents = 'all';
heroCanvas.addEventListener('click', e => {
  if (window.scrollY > window.innerHeight * 0.3) return;
  heroStarShines.push({ x: e.clientX, y: e.clientY, life: 1, r: 0 });
});

// ─── Earth canvas: click-to-scroll + water ripple ─────────────────────────
document.addEventListener('click', e => {
  if (earthProgress < 0.4) return;
  const w = earthCanvas.width, h = earthCanvas.height;
  const seaTop = h * 0.60;
  const earthScale = Math.min(w, h) * 0.14;
  // Water ripple — only when clicking below the waterline
  if (e.clientY > seaTop) {
    spawnWaterRipple(e.clientX, e.clientY);
    return;
  }
  // Constellation click — above waterline
  let closest = null, closestDist = Infinity;
  KEYS.forEach(key => {
    const anchor = EARTH_ANCHORS[key];
    const cx = anchor.x * w, cy = anchor.y * h;
    const d = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (d < closestDist) { closestDist = d; closest = key; }
  });
  if (closest && closestDist < earthScale * 1.2) {
    const idx = KEYS.indexOf(closest);
    startWarp(() => {
      window.scrollTo({ top: (idx + 1) * window.innerHeight, behavior: 'smooth' });
    });
  }
});

// ─── Custom cursor + star tooltip ─────────────────────────────────────────

let earthHoverKey = null;

if (isMobile) cursor.style.display = 'none';

document.addEventListener('mousemove', e => {
  if (isMobile) return;
  cursor.style.left   = e.clientX + 'px';
  cursor.style.top    = e.clientY + 'px';
  targetMouseX = e.clientX;
  targetMouseY = e.clientY;

  // Detect which earth constellation the mouse is over
  if (earthProgress > 0.4) {
    const w = earthCanvas.width, h = earthCanvas.height;
    const earthScale = Math.min(w, h) * 0.14;
    const hitR = earthScale * 1.1;
    let found = null;
    KEYS.forEach(key => {
      const a = EARTH_ANCHORS[key];
      if (Math.hypot(e.clientX - a.x * w, e.clientY - a.y * h) < hitR) found = key;
    });
    earthHoverKey = found;
  } else {
    earthHoverKey = null;
  }

  // Trail points — interpolate when mouse moves fast to avoid gaps
  const lastTp = trailPoints[trailPoints.length - 1];
  if (lastTp) {
    const dx = e.clientX - lastTp.x, dy = e.clientY - lastTp.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 10) {
      const steps = Math.min(6, Math.floor(dist / 10));
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        trailPoints.push({ x: lastTp.x + dx * t, y: lastTp.y + dy * t, age: 0 });
        if (trailPoints.length > TRAIL_MAX) trailPoints.shift();
      }
    }
  }
  trailPoints.push({ x: e.clientX, y: e.clientY, age: 0 });
  if (trailPoints.length > TRAIL_MAX) trailPoints.shift();

  // Star name tooltip — check proximity to projected foreground stars
  if (earthProgress < 0.3) {
    const tempVec = new THREE.Vector3();
    let nearest = null, nearDist = 40;
    for (let i = 0; i < STAR3_COUNT; i++) {
      tempVec.set(star3Pos.getX(i), star3Pos.getY(i), star3Pos.getZ(i));
      tempVec.project(camera);
      const sx = ( tempVec.x + 1) / 2 * window.innerWidth;
      const sy = (-tempVec.y + 1) / 2 * window.innerHeight;
      const d  = Math.hypot(e.clientX - sx, e.clientY - sy);
      if (d < nearDist) { nearDist = d; nearest = i; }
    }
    if (nearest !== null) {
      const { name, dist } = starName(nearest);
      starTooltip.textContent = `${name}  ·  ${dist} ly`;
      starTooltip.style.left  = (e.clientX + 16) + 'px';
      starTooltip.style.top   = (e.clientY - 24) + 'px';
      starTooltip.classList.add('visible');
      hoveredStar = nearest;
    } else if (hoveredStar !== null) {
      starTooltip.classList.remove('visible');
      hoveredStar = null;
    }
  } else {
    starTooltip.classList.remove('visible');
  }
});

// ─── Constellation drag-to-rotate ────────────────────────────────────────

document.addEventListener('mousemove', e => {
  if (!isDragging || !dragKey) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  // Track velocity for inertia
  constRotVel[dragKey].y = (e.clientX - dragLastX) * 0.004;
  constRotVel[dragKey].x = (e.clientY - dragLastY) * 0.004;
  dragLastX = e.clientX; dragLastY = e.clientY;
  // Write to target — constRot lerps toward it each frame (smooth)
  constRotTarget[dragKey].y = dragRotY + dx * 0.003;
  constRotTarget[dragKey].x = dragRotX + dy * 0.003;
  // Nudge background in drag direction
  bgDriftTargetX = dx * 0.018;
  bgDriftTargetY = dy * 0.012;
});

document.addEventListener('mouseup', () => {
  isDragging = false; dragKey = null;
  bgDriftTargetX = 0; bgDriftTargetY = 0;
});

// Touch drag rotation (mirrors the mousemove/mouseup handlers above)
document.addEventListener('touchmove', e => {
  if (!isDragging || !dragKey) return;
  const t  = e.touches[0];
  const dx = t.clientX - dragStartX;
  const dy = t.clientY - dragStartY;
  constRotVel[dragKey].y = (t.clientX - dragLastX) * 0.004;
  constRotVel[dragKey].x = (t.clientY - dragLastY) * 0.004;
  dragLastX = t.clientX; dragLastY = t.clientY;
  constRotTarget[dragKey].y = dragRotY + dx * 0.003;
  constRotTarget[dragKey].x = dragRotX + dy * 0.003;
  bgDriftTargetX = dx * 0.018;
  bgDriftTargetY = dy * 0.012;
}, { passive: true });

document.addEventListener('touchend', () => {
  if (!dragKey) return; // section touchend handles its own reset
  isDragging = false; dragKey = null;
  bgDriftTargetX = 0; bgDriftTargetY = 0;
}, { passive: true });

// ─── 3D CSS tilt ──────────────────────────────────────────────────────────

document.addEventListener('mousemove', e => {
  if (panelZoomKey) return;
  // Only tilt the scene (stars/bg) — disable on earth page so ocean stays flat
  if (earthProgress < 0.3) {
    const nx = (e.clientX / window.innerWidth  - 0.5);
    const ny = (e.clientY / window.innerHeight - 0.5);
    sceneWrap.style.transform = `perspective(1400px) rotateX(${ny * 2}deg) rotateY(${nx * -2}deg)`;
  } else {
    sceneWrap.style.transform = '';
  }
});

// ─── Section label visibility (driven by progress) ────────────────────────

// Cache elements once — never query the DOM inside the animation loop
const sectionEls  = {};
const labelVisible = {};
KEYS.forEach(key => {
  sectionEls[key]   = document.querySelector(`[data-constellation="${key}"]`);
  labelVisible[key] = false;
});

function syncLabels() {
  KEYS.forEach(key => {
    const el      = sectionEls[key];
    if (!el) return;
    const visible = progress[key] > 0.28;
    if (visible !== labelVisible[key]) {
      labelVisible[key] = visible;
      if (visible) el.classList.add('visible');
      else         el.classList.remove('visible');
    }

    // Clear hover state when constellation fades away
    if (hoveredKey === key && progress[key] < 0.28) {
      hoveredKey = null;
      lineDrawAnim[key]  = 0;
      lineDrawOrder[key] = [];
      cursor.classList.remove('hovering');
    }
  });
}

// ─── Animation loop ───────────────────────────────────────────────────────

let animTime = 0;

function animate() {
  requestAnimationFrame(animate);
  animTime += 0.004;

  const sy  = window.scrollY;
  const vh  = window.innerHeight;
  hero.update(sy);

  // Hero section: vertical ascent (stars shift up). Clamp so space sections
  // freeze the vertical offset and switch to orbital motion instead.
  const heroSy   = Math.min(sy, vh);
  const spaceT   = Math.max(0, sy - vh);          // 0 at first space section
  const swirl    = spaceT * 0.000115;             // grows as you scroll space

  // Vertical parallax — only active during hero ascent
  stars1.position.y   = heroSy * -0.04;
  stars2.position.y   = heroSy * -0.07;
  stars3.position.y   = heroSy * -0.12;
  milkyWay.position.y = heroSy * -0.02;

  // Orbital rotation in space sections — each layer sweeps a different axis
  stars1.rotation.y = animTime * 0.018 + swirl * 1.6;
  stars2.rotation.y = animTime * 0.012 + swirl * 1.1;
  stars2.rotation.x = swirl * 0.55;
  stars3.rotation.z = animTime * 0.007 + swirl * 0.75;
  milkyWay.rotation.z = Math.PI / 7 + swirl * 0.35;

  // Camera: mouse parallax + vertical rise during hero + lateral banking in space
  camOffsetX += ((targetMouseX / window.innerWidth  - 0.5) * 28 - camOffsetX) * 0.04;
  camOffsetY += ((targetMouseY / window.innerHeight - 0.5) * 18 - camOffsetY) * 0.04;
  const bankX = spaceT > 0 ? Math.sin(swirl * 3.8) * 42 : 0;
  const bankY = spaceT > 0 ? Math.cos(swirl * 2.4) * 20 : 0;
  // Bg drift — lerp toward target, creates parallax link with constellation drag
  bgDriftX += (bgDriftTargetX - bgDriftX) * 0.06;
  bgDriftY += (bgDriftTargetY - bgDriftY) * 0.06;

  camera.position.x =  camOffsetX + bankX + bgDriftX;
  camera.position.y = -camOffsetY + heroSy * 0.07 + bankY - bgDriftY;


  renderer.render(scene, camera);

  // Fade out Three.js stars as earth scene takes over
  const starFade = 1 - earthProgress * 0.72;
  stars1.material.opacity   = 0.55 * starFade;
  stars2.material.opacity   = 0.75 * starFade;
  stars3.material.opacity   = 0.90 * starFade;
  milkyWay.material.opacity = 0.36 * starFade;

  // Earth progress
  earthProgress += (targetEarthProgress - earthProgress) * (isMobile ? 0.14 : 0.07);
  if (Math.abs(earthProgress - targetEarthProgress) < 0.002) earthProgress = targetEarthProgress;

  // Lerp earth hover amounts
  KEYS.forEach(k => {
    const target = earthHoverKey === k ? 1 : 0;
    earthHoverAmt[k] += (target - earthHoverAmt[k]) * 0.07;
  });

  if (earthProgress > 0.005) {
    drawEarth(earthProgress);
    // Descend effect: slide earth canvas down from above as it enters
    const slideY = (1 - earthProgress) * -60;
    earthCanvas.style.transform = `translateY(${slideY}px)`;
  } else {
    earthCtx.clearRect(0, 0, earthCanvas.width, earthCanvas.height);
    earthCanvas.style.transform = 'translateY(-60px)';
  }

  stepWarp();

  // Lerp constellation progress + hover fade + draw animation + 3D rotation
  KEYS.forEach(key => {
    const t = targetProgress[key];
    progress[key] += (t - progress[key]) * (isMobile ? 0.13 : 0.07);

    const hTarget = hoveredKey === key ? 1 : 0;
    hoveredProgress[key] += (hTarget - hoveredProgress[key]) * 0.055;
    if (Math.abs(progress[key] - t) < 0.002) progress[key] = t;

    if (hoveredKey === key) {
      if (lineDrawOrder[key].length === 0) shuffleDrawOrder(key);

      if (lineDrawAnim[key] < 1) {
        // Still drawing
        lineDrawAnim[key] += lineDrawSpeed[key];
        if (lineDrawAnim[key] >= 1) {
          lineDrawAnim[key] = 1;
          lineHoldTimer[key] = 180; // hold ~3 s at 60fps before redrawing
        }
      } else if (lineHoldTimer[key] > 0) {
        // Holding the completed state
        lineHoldTimer[key]--;
      } else {
        // Hold expired — restart with a new random order
        lineDrawAnim[key] = 0;
        shuffleDrawOrder(key);
      }

      // Auto-rotate slowly when hovering but not dragging
      if (!isDragging || dragKey !== key) {
        constRotTarget[key].y += 0.0022;
        constRotTarget[key].x  = Math.sin(elapsed * 0.007) * 0.14;
      }
    } else {
      // Idle drift — gentle constant slow rotation even without hover
      if (!isDragging || dragKey !== key) {
        constRotTarget[key].y += 0.00045;
        constRotTarget[key].x  = Math.sin(elapsed * 0.003 + KEYS.indexOf(key) * 1.2) * 0.06;
      }
      // Inertia: bleed velocity into target, decay
      constRotVel[key].x *= 0.90;
      constRotVel[key].y *= 0.90;
      if (!isDragging || dragKey !== key) {
        constRotTarget[key].x += constRotVel[key].x;
        constRotTarget[key].y += constRotVel[key].y;
      }
    }

    // Smoothly lerp actual rotation toward target
    constRot[key].x += (constRotTarget[key].x - constRot[key].x) * 0.08;
    constRot[key].y += (constRotTarget[key].y - constRot[key].y) * 0.08;
  });

  syncLabels();
  drawConstellations();

  // ── Nebula parallax (deeper = less movement) ──
  const mx = (targetMouseX / window.innerWidth  - 0.5);
  const my = (targetMouseY / window.innerHeight - 0.5);
  nebulaSprites.forEach((sprite, i) => {
    const orig  = nebulaOrigPos[i];
    const depth = Math.abs(orig.z);           // 330–420
    const str   = (500 - depth) * 0.18;       // closer nebulae move more
    sprite.position.x = orig.x + mx * str;
    sprite.position.y = orig.y - my * str;
  });

  // ── Cursor trail (desktop only, skipped when empty) ──
  if (!isMobile && trailPoints.length > 0) {
  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  // Age points; prune dead ones from the front
  trailPoints.forEach(pt => pt.age++);
  while (trailPoints.length > 0 && trailPoints[0].age > TRAIL_MAX * 2.8) trailPoints.shift();

  if (trailPoints.length >= 2) {
    // Draw as a continuous tapered stroke: thin/dim at tail (index 0, oldest),
    // thick/bright at head (last index, newest). Two passes: glow then core.
    const n = trailPoints.length;
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 1; i < n; i++) {
        const t = i / (n - 1);           // 0 = tail, 1 = head
        // Tail points age faster (up to 4× at the very end) so long/fast trails
        // shed their tail quickly instead of leaving a stiff persistent line.
        const ageRate  = 1 + (1 - t) * 3;
        const life = Math.max(0, 1 - (trailPoints[i].age * ageRate) / (TRAIL_MAX * 2.8));
        const alpha = t * life;
        if (alpha < 0.01) continue;
        trailCtx.beginPath();
        trailCtx.moveTo(trailPoints[i - 1].x, trailPoints[i - 1].y);
        trailCtx.lineTo(trailPoints[i].x, trailPoints[i].y);
        trailCtx.lineCap  = 'round';
        trailCtx.lineJoin = 'round';
        if (pass === 0) {
          // Soft glow halo
          trailCtx.strokeStyle = `rgba(130,190,255,${alpha * 0.10})`;
          trailCtx.lineWidth   = t * 7;
        } else {
          // Bright core
          trailCtx.strokeStyle = `rgba(210,235,255,${alpha * 0.38})`;
          trailCtx.lineWidth   = t * 1.5;
        }
        trailCtx.stroke();
      }
    }
    // Bright head dot
    const head = trailPoints[n - 1];
    const headLife = Math.max(0, 1 - head.age / (TRAIL_MAX * 2.8));
    if (headLife > 0.05) {
      const grd = trailCtx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 4);
      grd.addColorStop(0,   `rgba(255,255,255,${headLife * 0.7})`);
      grd.addColorStop(0.4, `rgba(190,225,255,${headLife * 0.25})`);
      grd.addColorStop(1,   'rgba(0,0,0,0)');
      trailCtx.beginPath();
      trailCtx.arc(head.x, head.y, 7, 0, Math.PI * 2);
      trailCtx.fillStyle = grd;
      trailCtx.fill();
    }
  }

  } // end trail block

  // ── Hero star shines ──
  if (heroStarShines.length > 0) {
    const hCtx = heroCanvas.getContext('2d');
    heroStarShines.forEach((sh, i) => {
      sh.r    += 1.4;
      sh.life -= 0.028;
      if (sh.life <= 0) { heroStarShines.splice(i, 1); return; }
      hCtx.save();
      const alpha = sh.life;
      const rays = 6;
      for (let r = 0; r < rays; r++) {
        const angle = (r / rays) * Math.PI * 2;
        const len   = sh.r * (1 + 0.4 * Math.sin(r * 2.1));
        const grd   = hCtx.createLinearGradient(sh.x, sh.y,
          sh.x + Math.cos(angle) * len, sh.y + Math.sin(angle) * len);
        grd.addColorStop(0,   `rgba(255,248,220,${alpha * 0.9})`);
        grd.addColorStop(1,   'rgba(255,240,180,0)');
        hCtx.beginPath();
        hCtx.moveTo(sh.x, sh.y);
        hCtx.lineTo(sh.x + Math.cos(angle) * len, sh.y + Math.sin(angle) * len);
        hCtx.strokeStyle = grd;
        hCtx.lineWidth   = 1.5 * alpha;
        hCtx.stroke();
      }
      // Centre glow
      const cg = hCtx.createRadialGradient(sh.x, sh.y, 0, sh.x, sh.y, sh.r * 0.5);
      cg.addColorStop(0,   `rgba(255,255,240,${alpha})`);
      cg.addColorStop(1,   'rgba(255,240,180,0)');
      hCtx.beginPath();
      hCtx.arc(sh.x, sh.y, sh.r * 0.5, 0, Math.PI * 2);
      hCtx.fillStyle = cg;
      hCtx.fill();
      hCtx.restore();
    });
  }

  // ── GitHub stats visibility ──
  if (earthProgress > 0.5) ghStats.classList.add('visible');
  else                      ghStats.classList.remove('visible');
}

animate();

// ─── Resize ───────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  resizeConstCanvas();
  resizeEarthCanvas();
  trailCanvas.width  = window.innerWidth;
  trailCanvas.height = window.innerHeight;
  updateTargets();
});
