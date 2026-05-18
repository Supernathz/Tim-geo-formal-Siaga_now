const title = document.querySelector(".hero-title");

document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    title.style.setProperty("--x", `${x}%`);
    title.style.setProperty("--y", `${y}%`);
});

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

    canvas: canvas,
    engine: engine,

    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "transparent"
    }
});

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

/* =========================
   FLOOD DEBRIS
========================= */

const debrisBodies = [];

for (let i = 0; i < 12; i++) {

    const size = Math.random() * 30 + 20;

    const debris = Bodies.rectangle(

        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.7,

        size,
        size,

        {

            restitution: 0.4,
            frictionAir: 0.02,

            render: {

                fillStyle: [
                    "#4caf50",
                    "#8d6e63",
                    "#90a4ae"
                ][Math.floor(Math.random() * 3)],

                opacity: 0.18
            }
        }
    );

    debrisBodies.push(debris);
}

Composite.add(engine.world, debrisBodies);

/* =========================
   WALLS
========================= */

const walls = [

    Bodies.rectangle(
        window.innerWidth / 2,
        -30,
        window.innerWidth,
        60,
        { isStatic: true }
    ),

    Bodies.rectangle(
        window.innerWidth / 2,
        window.innerHeight + 30,
        window.innerWidth,
        60,
        { isStatic: true }
    ),

    Bodies.rectangle(
        -30,
        window.innerHeight / 2,
        60,
        window.innerHeight,
        { isStatic: true }
    ),

    Bodies.rectangle(
        window.innerWidth + 30,
        window.innerHeight / 2,
        60,
        window.innerHeight,
        { isStatic: true }
    )
];

Composite.add(engine.world, walls);


Events.on(engine, "beforeUpdate", () => {

    debrisBodies.forEach(body => {

        if (body.position.y > window.innerHeight * 0.65) {

            Body.applyForce(
                body,
                body.position,
                {
                    x: 0,
                    y: -0.002
                }
            );
        }
    });
});


window.addEventListener("resize", () => {

    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
});
