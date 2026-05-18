const title = document.querySelector(".hero-title");

document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;

  title.style.setProperty("--x", `${x}px`);
  title.style.setProperty("--y", `${y}px`);
});
