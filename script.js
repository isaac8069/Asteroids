/* ----------------------------
   Asteroids — vanilla JS build
   Works with your provided HTML
   ---------------------------- */

// -------- Canvas & DOM ----------
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const $scoreEl = document.querySelector('#btmLeft h2');
const $statusEl = document.getElementById('status');
const $movementEl = document.getElementById('movement');
const $timerEl = document.getElementById('timer');

const $start = document.getElementById('start');
const $gameOver = document.getElementById('game-over');

function resizeCanvas() {
  // Fill the main area nicely
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(640, Math.min(window.innerWidth - 40, 1200));
  const h = Math.max(400, Math.min(window.innerHeight - 200, 800));
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// -------- Game State ------------
const STATE = {
  running: false,
  over: false,
  startedAt: 0,
  // entities
  player: null,
  asteroids: [],
  ufos: [],
  // scoring
  score: 0,
  // spawn timers
  nextAsteroidIn: 0,
  nextUfoIn: 0,
};

const CONFIG = {
  playerSpeed: 4,          // pixels per frame @ ~60fps
  playerRadius: 14,
  asteroidRadius: [8, 18], // min,max
  ufoRadius: [12, 18],
  asteroidEveryMs: [600, 1200], // random spawn window
  ufoEveryMs: [1200, 2200],
  asteroidValue: 10,
  friction: 0.9,           // optional inertia (set to 1 for no inertia)
  wrap: true,              // wrap screen edges (classic feel)
  safeSpawnRadius: 120,    // keep spawns away from player
};

// -------- Utilities -------------
const rand = (min, max) => Math.random() * (max - min) + min;
const randi = (min, max) => Math.floor(rand(min, max));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function dist(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.hypot(dx, dy);
}

function spawnAwayFrom(cx, cy, minDist) {
  // Find a random point on canvas not too close to (cx,cy)
  let x, y, tries = 0;
  do {
    x = rand(0, canvas.clientWidth);
    y = rand(0, canvas.clientHeight);
    tries++;
  } while (dist(x, y, cx, cy) < minDist && tries < 100);
  return { x, y };
}

// -------- Input (WASD + Arrows, diagonals, no scroll) -----
const keysDown = new Set();

function shouldPreventDefault(e) {
  const el = e.target;
  const typing = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
  if (typing) return false;
  return e.code.startsWith('Arrow') || e.code === 'Space';
}

window.addEventListener('keydown', (e) => {
  if (shouldPreventDefault(e)) e.preventDefault();
  keysDown.add(e.code);
  updateMovementFromKeys();
});

window.addEventListener('keyup', (e) => {
  if (shouldPreventDefault(e)) e.preventDefault();
  keysDown.delete(e.code);
  updateMovementFromKeys();
});

window.addEventListener('blur', () => {
  keysDown.clear();
  updateMovementFromKeys();
});

function computeMoveVector() {
  const left  = keysDown.has('KeyA') || keysDown.has('ArrowLeft');
  const right = keysDown.has('KeyD') || keysDown.has('ArrowRight');
  const up    = keysDown.has('KeyW') || keysDown.has('ArrowUp');
  const down  = keysDown.has('KeyS') || keysDown.has('ArrowDown');

  let x = (right ? 1 : 0) + (left ? -1 : 0);
  let y = (down ? 1 : 0)  + (up ? -1 : 0);

  if (x !== 0 && y !== 0) {
    const inv = 1 / Math.sqrt(2);
    x *= inv; y *= inv;
  }
  return { x, y };
}

function updateMovementFromKeys() {
  if (!STATE.player) return;
  const mv = computeMoveVector();
  STATE.player.vx = mv.x * CONFIG.playerSpeed;
  STATE.player.vy = mv.y * CONFIG.playerSpeed;

  // UI direction text
  const dir =
    mv.x === 0 && mv.y === 0 ? 'Idle' :
    `${mv.y < 0 ? 'Up' : mv.y > 0 ? 'Down' : ''}${(mv.x !== 0 && mv.y !== 0) ? '-' : ''}${mv.x < 0 ? 'Left' : mv.x > 0 ? 'Right' : ''}`;
  if ($movementEl) $movementEl.textContent = `Direction: ${dir}`;
}

// -------- Entities ---------------
function makePlayer() {
  return {
    x: canvas.clientWidth / 2,
    y: canvas.clientHeight / 2,
    r: CONFIG.playerRadius,
    vx: 0,
    vy: 0,
    color: '#fff',
  };
}

function makeAsteroid() {
  const player = STATE.player;
  const spot = spawnAwayFrom(player.x, player.y, CONFIG.safeSpawnRadius);
  return {
    type: 'asteroid',
    x: spot.x,
    y: spot.y,
    r: rand(CONFIG.asteroidRadius[0], CONFIG.asteroidRadius[1]),
    color: '#1e90ff', // blue
    vx: rand(-0.5, 0.5),
    vy: rand(-0.5, 0.5),
  };
}

function makeUfo(color = 'black') {
  const player = STATE.player;
  const spot = spawnAwayFrom(player.x, player.y, CONFIG.safeSpawnRadius + 40);
  return {
    type: 'ufo',
    x: spot.x,
    y: spot.y,
    r: rand(CONFIG.ufoRadius[0], CONFIG.ufoRadius[1]),
    color, // 'black' or 'green'
    vx: rand(-1.2, 1.2),
    vy: rand(-1.2, 1.2),
  };
}

// -------- Spawning ----------------
function scheduleNextAsteroid() {
  STATE.nextAsteroidIn = performance.now() + randi(CONFIG.asteroidEveryMs[0], CONFIG.asteroidEveryMs[1]);
}
function scheduleNextUfo() {
  STATE.nextUfoIn = performance.now() + randi(CONFIG.ufoEveryMs[0], CONFIG.ufoEveryMs[1]);
}

// -------- Game Loop ---------------
let rafId = null;
let lastTs = 0;

function update(dt) {
  const p = STATE.player;
  if (!p) return;

  // Player motion (optional friction for smoother feel)
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.vx *= CONFIG.friction;
  p.vy *= CONFIG.friction;

  // Wrap/clamp
  if (CONFIG.wrap) {
    if (p.x < -p.r) p.x = canvas.clientWidth + p.r;
    if (p.x > canvas.clientWidth + p.r) p.x = -p.r;
    if (p.y < -p.r) p.y = canvas.clientHeight + p.r;
    if (p.y > canvas.clientHeight + p.r) p.y = -p.r;
  } else {
    p.x = clamp(p.x, p.r, canvas.clientWidth - p.r);
    p.y = clamp(p.y, p.r, canvas.clientHeight - p.r);
  }

  // Move asteroids
  for (const a of STATE.asteroids) {
    a.x += a.vx * dt;
    a.y += a.vy * dt;
    wrapEntity(a);
  }

  // Move ufos (bounce a little)
  for (const u of STATE.ufos) {
    u.x += u.vx * dt;
    u.y += u.vy * dt;

    if (u.x < u.r || u.x > canvas.clientWidth - u.r) u.vx *= -1;
    if (u.y < u.r || u.y > canvas.clientHeight - u.r) u.vy *= -1;
  }

  // Collisions: player vs asteroids (collect)
  for (let i = STATE.asteroids.length - 1; i >= 0; i--) {
    const a = STATE.asteroids[i];
    if (dist(p.x, p.y, a.x, a.y) <= p.r + a.r) {
      STATE.asteroids.splice(i, 1);
      STATE.score += CONFIG.asteroidValue;
      updateScoreUI();
      // feedback
      pulseStatus(`+${CONFIG.asteroidValue} points!`);
    }
  }

  // Collisions: player vs ufos (lose)
  for (const u of STATE.ufos) {
    if (dist(p.x, p.y, u.x, u.y) <= p.r + u.r) {
      endGame('Crashed into a UFO!');
      return;
    }
  }

  // Spawning
  const now = performance.now();
  if (now >= STATE.nextAsteroidIn) {
    STATE.asteroids.push(makeAsteroid());
    scheduleNextAsteroid();
  }
  if (now >= STATE.nextUfoIn) {
    STATE.ufos.push(makeUfo(Math.random() < 0.5 ? 'black' : 'green'));
    scheduleNextUfo();
  }

  // Timer UI
  const elapsed = Math.max(0, Math.floor((now - STATE.startedAt) / 1000));
  if ($timerEl) $timerEl.textContent = `Time: ${elapsed}s`;
}

function wrapEntity(e) {
  if (!CONFIG.wrap) return;
  if (e.x < -e.r) e.x = canvas.clientWidth + e.r;
  if (e.x > canvas.clientWidth + e.r) e.x = -e.r;
  if (e.y < -e.r) e.y = canvas.clientHeight + e.r;
  if (e.y > canvas.clientHeight + e.r) e.y = -e.r;
}

function draw() {
  // Background
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  // Stars (simple parallax-like sprinkle)
  // (cheap: random static noise feel)
  // You can comment this out if you want a solid background
  for (let i = 0; i < 60; i++) {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ffffff';
    const x = (i * 73) % canvas.clientWidth;
    const y = (i * 137) % canvas.clientHeight;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Draw asteroids (blue)
  for (const a of STATE.asteroids) {
    ctx.beginPath();
    ctx.fillStyle = a.color;
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw ufos (black/green discs with outline)
  for (const u of STATE.ufos) {
    ctx.beginPath();
    ctx.fillStyle = u.color === 'green' ? '#2ecc71' : '#000000';
    ctx.arc(u.x, u.y, u.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#13ff00';
    ctx.stroke();
  }

  // Draw player (white triangle ship)
  drawPlayerShip(STATE.player);
}

function drawPlayerShip(p) {
  if (!p) return;
  const angle = Math.atan2(p.vy, p.vx) || 0; // aim ship where it moves
  const r = p.r;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(angle);

  // Ship body
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(-r * 0.7, r * 0.6);
  ctx.lineTo(-r * 0.7, -r * 0.6);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#5dade2';
  ctx.stroke();

  // Thruster flicker if moving
  if (Math.hypot(p.vx, p.vy) > 0.5) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, 0);
    ctx.lineTo(-r * 1.2, 3);
    ctx.lineTo(-r * 1.2, -3);
    ctx.closePath();
    ctx.fillStyle = '#ff9900';
    ctx.fill();
  }

  ctx.restore();
}

function loop(ts) {
  if (!STATE.running) return;
  if (!lastTs) lastTs = ts;
  const dt = Math.min(33, ts - lastTs) / (1000 / 60); // normalize ~60fps
  lastTs = ts;

  update(dt);
  draw();

  rafId = requestAnimationFrame(loop);
}

// -------- UI Helpers -------------
function updateScoreUI() {
  if ($scoreEl) $scoreEl.textContent = `Score: ${STATE.score}`;
}

let statusTimeout = null;
function pulseStatus(msg) {
  if (!$statusEl) return;
  $statusEl.textContent = msg;
  clearTimeout(statusTimeout);
  statusTimeout = setTimeout(() => {
    if ($statusEl.textContent === msg) $statusEl.textContent = '';
  }, 800);
}

function showStartUI() {
  $start.style.display = 'block';
  $gameOver.style.display = 'none';
}
function showGameOverUI() {
  $start.style.display = 'none';
  $gameOver.style.display = 'block';
}
function hideMenus() {
  $start.style.display = 'none';
  $gameOver.style.display = 'none';
}

// -------- Public Controls (HTML onclick hooks) ----------
window.startGame = function startGame() {
  // Reset state
  STATE.running = true;
  STATE.over = false;
  STATE.startedAt = performance.now();
  STATE.player = makePlayer();
  STATE.asteroids = [];
  STATE.ufos = [];
  STATE.score = 0;
  updateScoreUI();
  if ($statusEl) $statusEl.textContent = '';
  if ($timerEl) $timerEl.textContent = 'Time: 0s';
  updateMovementFromKeys();
  scheduleNextAsteroid();
  scheduleNextUfo();
  hideMenus();

  cancelAnimationFrame(rafId);
  lastTs = 0;
  rafId = requestAnimationFrame(loop);
};

function endGame(reason = 'Game Over') {
  STATE.running = false;
  STATE.over = true;
  cancelAnimationFrame(rafId);
  rafId = null;
  if ($statusEl) $statusEl.textContent = reason;
  showGameOverUI();
}

// If user refreshes mid-game, show start
showStartUI();
