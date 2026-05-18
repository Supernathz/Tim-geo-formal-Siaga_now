
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

let W = 0, H = 0;

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resize);
resize();

// ─── SIMPLE TITLE PARTICLES ───
const particles = [];

function spawnParticle() {
  particles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.3,
    vy: 0.2 + Math.random() * 0.5,
    r: 1 + Math.random() * 2,
    alpha: 0.2 + Math.random() * 0.5
  });
}

// ─── DRAW ───
function draw() {
  ctx.clearRect(0, 0, W, H);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.002;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "rgba(255, 107, 0, 1)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // keep it alive
  if (particles.length < 120) {
    spawnParticle();
  }
}

// ─── LOOP ───
function loop() {
  draw();
  requestAnimationFrame(loop);
}
loop();

// ─── RESIZE SAFETY ───
window.addEventListener("resize", resize);
