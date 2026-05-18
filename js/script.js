window.addEventListener("DOMContentLoaded", () => {

    const {
        Engine,
        Render,
        Runner,
        Bodies,
        Composite,
        Events,
        Body
    } = Matter;

    /* =========================
       HERO TITLE MOUSE EFFECT
    ========================= */

    const title = document.querySelector(".hero-title");

    let mouseX = window.innerWidth / 2;

    document.addEventListener("mousemove", (e) => {

        mouseX = e.clientX;

        if (!title) return;

        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        title.style.setProperty("--x", `${x}%`);
        title.style.setProperty("--y", `${y}%`);
    });

    /* =========================
       ENGINE + RENDER
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
       WATER LEVEL
    ========================= */

    const WATER_LINE = window.innerHeight * 0.72;

    /* =========================
       FLOOD DEBRIS
    ========================= */

    const debris = [];

    for (let i = 0; i < 12; i++) {

        const body = Bodies.rectangle(
            Math.random() * window.innerWidth,
            Math.random() * WATER_LINE,
            40,
            40,
            {
                frictionAir: 0.04,
                friction: 0.1,
                restitution: 0.2,
                render: {
                    fillStyle: ["#4caf50", "#8d6e63", "#90a4ae"][Math.floor(Math.random() * 3)],
                    opacity: 0.2
                }
            }
        );

        debris.push(body);
    }

    Composite.add(engine.world, debris);

    /* =========================
       RAIN SYSTEM
    ========================= */

    const rain = [];

    for (let i = 0; i < 70; i++) {

        const drop = Bodies.rectangle(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight,
            2,
            12,
            {
                frictionAir: 0.03,
                render: {
                    fillStyle: "#a5d6a7",
                    opacity: 0.35
                }
            }
        );

        rain.push(drop);
    }

    Composite.add(engine.world, rain);

    /* =========================
       ANIMATION LOOP
    ========================= */

    Events.on(engine, "beforeUpdate", () => {

        const time = Date.now() * 0.002;

        /* 🌊 FLOOD MOTION */
        debris.forEach(body => {

            const wave =
                Math.sin(time * 0.8 + body.position.y * 0.03) * 0.0012;

            Body.applyForce(body, body.position, {
                x: 0.0006 + wave,
                y: wave * 0.6
            });

            if (body.position.x > window.innerWidth + 120) {
                Body.setPosition(body, {
                    x: -80,
                    y: Math.random() * WATER_LINE
                });
            }
        });

        /* 🌧️ RAIN MOTION */
        rain.forEach(drop => {

            Body.applyForce(drop, drop.position, {
                x: (mouseX - drop.position.x) * 0.00001,
                y: 0.0006
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
       RESIZE
    ========================= */

    window.addEventListener("resize", () => {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
    });

});
