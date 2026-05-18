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
       FORCED VISUAL DEBUG (IMPORTANT)
    ========================= */

    const testBox = Bodies.rectangle(200, 200, 80, 80, {
        render: { fillStyle: "#4caf50" }
    });

    Composite.add(engine.world, testBox);

    /* =========================
       HERO MOUSE EFFECT
    ========================= */

    const title = document.querySelector(".hero-title");

    document.addEventListener("mousemove", (e) => {

        if (!title) return;

        title.style.setProperty("--x", `${(e.clientX / window.innerWidth) * 100}%`);
        title.style.setProperty("--y", `${(e.clientY / window.innerHeight) * 100}%`);
    });

    /* =========================
       FLOOD SYSTEM
    ========================= */

    const WATER_LINE = window.innerHeight * 0.72;

    const debris = [];

    for (let i = 0; i < 10; i++) {

        const body = Bodies.rectangle(
            Math.random() * window.innerWidth,
            Math.random() * WATER_LINE,
            40,
            40,
            {
                frictionAir: 0.02,
                render: {
                    fillStyle: "#2e7d32"
                }
            }
        );

        debris.push(body);
    }

    Composite.add(engine.world, debris);

    /* =========================
       RAIN (VERY VISIBLE NOW)
    ========================= */

    const rain = [];

    for (let i = 0; i < 60; i++) {

        const drop = Bodies.rectangle(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight,
            3,
            14,
            {
                frictionAir: 0.01,
                render: {
                    fillStyle: "#a5d6a7"
                }
            }
        );

        rain.push(drop);
    }

    Composite.add(engine.world, rain);

    let mouseX = window.innerWidth / 2;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
    });

    /* =========================
       FORCE LOOP
    ========================= */

    Events.on(engine, "beforeUpdate", () => {

        debris.forEach(b => {

            Body.applyForce(b, b.position, {
                x: 0.0015,
                y: 0
            });

            if (b.position.x > window.innerWidth + 100) {
                Body.setPosition(b, {
                    x: -50,
                    y: Math.random() * WATER_LINE
                });
            }
        });

        rain.forEach(r => {

            Body.applyForce(r, r.position, {
                x: (mouseX - r.position.x) * 0.00002,
                y: 0.003
            });

            if (r.position.y > window.innerHeight + 50) {
                Body.setPosition(r, {
                    x: Math.random() * window.innerWidth,
                    y: -50
                });
            }
        });
    });

});
