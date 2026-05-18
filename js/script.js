// ─────────────────────────────────────────────
// HERO CANVAS SETUP
// ─────────────────────────────────────────────
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

let W, H;

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener("resize", resize);

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const rand = (a, b) => a + Math.random() * (b - a);

// ─────────────────────────────────────────────
// MATERI.JS FLOOD SYSTEM
// ─────────────────────────────────────────────
const { Engine, World, Bodies, Body } = Matter;

const engine = Engine.create();
engine.gravity.y = 0.5;

let bodies = [];
let floodLevel = 0;
let t = 0;

// ─────────────────────────────────────────────
// INIT FLOOD OBJECTS
// ─────────────────────────────────────────────
function initFlood() {
  floodLevel = H;

  // clear old bodies
  for (const b of bodies) {
    World.remove(engine.world, b);
  }
  bodies = [];

  // spawn floating debris
  for (let i = 0; i < 25; i++) {
    const box = Bodies.rectangle(
      rand(0, W),
      rand(H * 0.2, H),
      rand(20, 60),
      rand(10, 25),
      {
        restitution: 0.4,
        friction: 0.3,
        density: 0.002
      }
    );

    bodies.push(box);
    World.add(engine.world, box);
  }
}

// ─────────────────────────────────────────────
// UPDATE + DRAW FLOOD
// ─────────────────────────────────────────────
function drawFlood() {
  ctx.clearRect(0, 0, W, H);

  Engine.update(engine);

  // rising flood
  floodLevel -= 0.15;
  if (floodLevel < H * 0.35) floodLevel = H * 0.35;

  // ── WATER SURFACE ──
  ctx.beginPath();
  ctx.moveTo(0, floodLevel);

  for (let x = 0; x <= W; x += 10) {
    const wave =
      Math.sin(x * 0.02 + t * 0.02) * 12 +
      Math.sin(x * 0.05 + t * 0.01) * 6;

    ctx.lineTo(x, floodLevel + wave);
  }

  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, floodLevel, 0, H);
  grad.addColorStop(0, "rgba(26,115,232,0.65)");
  grad.addColorStop(1, "rgba(0,20,60,0.85)");

  ctx.fillStyle = grad;
  ctx.fill();

  // ── FLOATING OBJECTS ──
  for (const b of bodies) {
    const v = b.vertices;

    // buoyancy (fake water lift)
    if (b.position.y < floodLevel) {
      Body.applyForce(b, b.position, {
        x: 0,
        y: -0.0018
      });
    }

    ctx.beginPath();
    ctx.moveTo(v[0].x, v[0].y);

    for (let i = 1; i < v.length; i++) {
      ctx.lineTo(v[i].x, v[i].y);
    }

    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fill();
  }

  t++;
}

// ─────────────────────────────────────────────
// MAIN LOOP
// ─────────────────────────────────────────────
function loop() {
  drawFlood();
  requestAnimationFrame(loop);
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
initFlood();
loop();
