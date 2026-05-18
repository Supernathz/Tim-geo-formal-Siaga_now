const title = document.querySelector(".hero-title");

document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    title.style.setProperty("--x", `${x}%`);
    title.style.setProperty("--y", `${y}%`);
});
