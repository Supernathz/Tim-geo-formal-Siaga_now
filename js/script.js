const { Engine, Render, Runner, Bodies, Composite, Events, Body } = Matter;

/* =========================
   HERO TITLE MOUSE EFFECT
========================= */

const title = document.querySelector(".hero-title");

document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    title.style.setProperty("--x", `${x}%`);
    title.style.setProperty("--y", `${y}%`);

    mouseX = e.clientX;
});

/* =========================
   ENGINE SETUP (ONLY ONCE)
========================= */

const canvas = document.getElementById("physics-canvas");

const engine = Engine.create();

const render = Render.create({
    canvas,
    engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "transparent"
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

/* =========================
   CONFIG
========================= */

const WATER_LINE = window.innerHeight * 0.72;

/* =========================
   FLOOD DEBRIS
========================= */

const debrisBodies = [];

for (let i = 0; i < 12; i++) {

    const size = Math.random() * 30 + 20;

    const debris = Bodies.rectangle(
        Math.random() * window.innerWidth,
        Math.random() * WATER_LINE,
        size,
        size,
        {
            restitution: 0.25,
            frictionAir: 0.02,
            render: {
                fillStyle: ["#4caf50", "#8d6e63", "#90a4ae"][Math.floor(Math.random() * 3)],
                opacity: 0.18
            }
        }
    );

    debrisBodies.push(debris);
}

Composite.add(engine.world, debrisBodies);

/* =========================
   RAIN
========================= */

const rainDrops = [];

for (let i = 0; i < 80; i++) {

    const drop = Bodies.rectangle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        2,
        10,
        {
            frictionAir: 0.02,
            render: {
                fillStyle: "#a5d6a7",
                opacity: 0.25
            }
        }
    );

    rainDrops.push(drop);
}

Composite.add(engine.world, rainDrops);

/* =========================
   MOUSE CONTROL
========================= */

let mouseX = window.innerWidth / 2;

/* =========================
   MAIN LOOP
========================= */

Events.on(engine, "beforeUpdate", () => {

    const time = Date.now() * 0.002;

    /* =========================
       FLOOD SYSTEM
    ========================= */

    debrisBodies.forEach(body => {

        // 🌊 current flow
        Body.applyForce(body, body.position, {
            x: 0.0012,
            y: 0
        });

        // 🌊 wave motion
        const wave = Math.sin(time + body.position.y * 0.02) * 0.0004;

        Body.applyForce(body, body.position, {
            x: 0,
            y: wave
        });

        // 🌊 buoyancy
        if (body.position.y > WATER_LINE) {
            Body.applyForce(body, body.position, {
                x: 0,
                y: -0.0015
            });
        }

        // ♻️ loop
        if (body.position.x > window.innerWidth + 100) {
            Body.setPosition(body, {
                x: -120 - Math.random() * 50,
                y: Math.random() * WATER_LINE
            });
        }
    });

    /* =========================
       RAIN SYSTEM (MOUSE FOLLOW)
    ========================= */

    rainDrops.forEach(drop => {

        const forceX = (mouseX - drop.position.x) * 0.00001;

        Body.applyForce(drop, drop.position, {
            x: forceX,
            y: 0.002
        });

        if (drop.position.y > window.innerHeight + 50) {
            Body.setPosition(drop, {
                x: Math.random() * window.innerWidth,
                y: -50
            });
        }
    });
});

/* =========================
   RESIZE HANDLING
========================= */

window.addEventListener("resize", () => {

    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
});
