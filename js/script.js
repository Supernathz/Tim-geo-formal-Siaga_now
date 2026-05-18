

const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

let w;
let h;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// particles
const particles = [];

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 3,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6
  });
}

function animate() {

  ctx.clearRect(0, 0, w, h);

  particles.forEach((p) => {

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > w) p.dx *= -1;
    if (p.y < 0 || p.y > h) p.dy *= -1;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.r,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      "rgba(76,175,80,.4)";

    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

const checklistItems =
  document.querySelectorAll(".checklist-item");

const progressFill =
  document.querySelector(".progress-fill");

checklistItems.forEach((item) => {

  item.addEventListener("click", () => {

    item.classList.toggle("checked");

    const checked =
      document.querySelectorAll(
        ".checklist-item.checked"
      ).length;

    const total =
      checklistItems.length;

    const progress =
      (checked / total) * 100;

    progressFill.style.width =
      `${progress}%`;
  });
});

const fadeItems =
  document.querySelectorAll(".fade-up");

fadeItems.forEach((item, index) => {

  item.style.opacity = 0;

  setTimeout(() => {

    item.style.transition =
      "all .7s ease";

    item.style.opacity = 1;

    item.style.transform =
      "translateY(0px)";

  }, index * 120);
});
