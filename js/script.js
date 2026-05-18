const title = document.querySelector(".hero-title");

document.addEventListener("mousemove", (e) => {
  const rect = title.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  title.style.setProperty("--x", `${x}px`);
  title.style.setProperty("--y", `${y}px`);
});
