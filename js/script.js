// =====================================================
// SIAGANOW CLEAN BUILD
// Hero Title FX + Flood Physics (BANJIR ONLY)
// =====================================================

// ─────────────────────────────────────────────
// HERO CANVAS SETUP
// ─────────────────────────────────────────────
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

let W = 0, H = 0;

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resize);
resize();

// ─────────────────────────────────────────────
// HERO TITLE PARTICLE EFFECT (KEPT + CLEANED)
// ─────────────────────────────────────────────
const titleParticles = [];

function spawnTitleParticle() {
  titleParticles.push({
    x: Math.random() * W,
    y: Math.random() * H * 0.4,
    vx: (Math.random() - 0.5) * 0.4,
    vy: 0.3 + Math.random() * 0.6,
    r: 1 + Math.random() * 2,
    alpha: 0.2 + Math.random() * 0.5
  });
}

// ─────────────────────────────────────────────
// FLOOD PHYSICS SYSTEM (BANJIR)
// ─────────────────────────────────────────────
const waterPoints = [];
const POINTS = 90;

const bodies = [];
const rain = [];

let waveT = 0;

// init water surface
function initWater() {
  waterPoints.length = 0;
  for (let i = 0; i <= POINTS; i++) {
    waterPoints.push({
      x: (i / POINTS) * W,
      y: H * 0.68,
      vy: 0,
      target: H * 0.68
    });
  }
}
initWater();

// floating objects
function spawnBody() {
  bodies.push({
    x: Math.random() * W,
    y: -40,
    vx: (Math.random() - 0.5) * 1.2,
    vy: Math.random() * 1.5,
    size: 10 + Math.random() * 18,
    buoyancy: 0.03 + Math.random() * 0.02,
    drag: 0.985,
    color: `hsl(${30 + Math.random() * 30}, 55%, 40%)`
  });
}

// rain
function spawnRain() {
  rain.push({
    x: Math.random() * W,
    y: -10,
    vy: 7 + Math.random() * 6,
    len: 10 + Math.random() * 12,
    alpha: 0.3 + Math.random() * 0.4
  });
}

// water wave physics (spring system)
function updateWater() {
  waveT += 0.04;

  for (let i = 0; i < waterPoints.length; i++) {
    const p = waterPoints[i];

    const wave =
      Math.sin(i * 0.22 + waveT) * 10 +
      Math.sin(i * 0.06 + waveT * 1.4) * 20;

    p.target = H * 0.72 + wave;

    const force = (p.target - p.y) * 0.02;
    p.vy += force;
    p.vy *= 0.86;
    p.y += p.vy;
  }
}

// disturb water when object hits
function splash(x, power = 1) {
  const idx = Math.floor((x / W) * POINTS);
  for (let i = -4; i <= 4; i++) {
    const p = waterPoints[idx + i];
    if (!p) continue;
    p.vy -= power * (1 - Math.abs(i) / 5) * 6;
  }
}

// physics update
function updateBodies() {
  for (let b of bodies) {
    b.vy += 0.14;

    const waterY = getWater(b.x);

    if (b.y > waterY) {
      const depth = b.y - waterY;
      b.vy -= depth * b.buoyancy;
      b.vx *= 0.98;

      splash(b.x, 0.8);
    }

    b.x += b.vx;
    b.y += b.vy;

    b.vx *= b.drag;

    if (b.y > H + 120) {
      b.x = Math.random() * W;
      b.y = -50;
      b.vy = 0;
    }
  }
}

// get water height at x
function getWater(x) {
  const i = Math.floor((x / W) * POINTS);
  return waterPoints[i]?.y || H;
}

// ─────────────────────────────────────────────
// DRAW FUNCTIONS
// ─────────────────────────────────────────────
function drawBackground() {
  const g = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, H);
  g.addColorStop(0, "rgba(0,50,100,0.25)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

// water surface
function drawWater() {
  ctx.beginPath();
  ctx.moveTo(0, H);

  for (let p of waterPoints) {
    ctx.lineTo(p.x, p.y);
  }

  ctx.lineTo(W, H);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, H * 0.4, 0, H);
  grad.addColorStop(0, "rgba(26,115,232,0.55)");
  grad.addColorStop(1, "rgba(0,15,50,0.9)");

  ctx.fillStyle = grad;
  ctx.fill();
}

// floating debris
function drawBodies() {
  for (let b of bodies) {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.size, b.size * 0.6);
  }
}

// rain
function drawRain() {
  for (let i = rain.length - 1; i >= 0; i--) {
    const r = rain[i];

    r.y += r.vy;
    r.x -= 1.3;

    ctx.strokeStyle = `rgba(180,220,255,${r.alpha})`;
    ctx.beginPath();
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x + 2, r.y + r.len);
    ctx.stroke();

    if (r.y > H) rain.splice(i, 1);
  }
}

// ─────────────────────────────────────────────
// TITLE PARTICLES DRAW (SUBTLE FLOAT EFFECT)
// ─────────────────────────────────────────────
function drawTitleParticles() {
  for (let i = titleParticles.length - 1; i >= 0; i--) {
    const p = titleParticles[i];

    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.003;

    if (p.alpha <= 0) {
      titleParticles.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "rgba(255,140,0,1)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ─────────────────────────────────────────────
// MAIN LOOP
// ─────────────────────────────────────────────
let timer = 0;

function loop() {
  ctx.clearRect(0, 0, W, H);

  drawBackground();

  updateWater();
  updateBodies();

  drawRain();
  drawWater();
  drawBodies();
  drawTitleParticles();

  // spawning logic
  if (timer % 3 === 0) spawnRain();
  if (timer % 100 === 0) spawnBody();
  if (timer % 2 === 0) spawnTitleParticle();

  timer++;

  requestAnimationFrame(loop);
}
loop();

// ─────────────────────────────────────────────
// INIT RESET
// ─────────────────────────────────────────────
window.addEventListener("resize", () => {
  resize();
  initWater();
});

// ─────────────────────────────────────────────
// MODE SWITCH (SAFE, NO OTHER SYSTEMS)
// ─────────────────────────────────────────────
function switchDisaster(mode, btn) {
  document.querySelectorAll(".dtab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  if (mode !== "banjir") {
    console.log("Only flood mode is active in this build.");
  }
}
