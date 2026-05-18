const title = document.querySelector(".hero-title");

document.addEventListener("mousemove", (e) => {
  title.style.position = "absolute";
  title.style.left = `${e.clientX}px`;
  title.style.top = `${e.clientY}px`;
});
