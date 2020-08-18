import Matter = require("matter-js");
import { BasicScene } from "./classes";

const ROAD = "#a1a1a1";

// create engine
const engine = Matter.Engine.create();
engine.world.gravity.y = 0;

const runner = Matter.Runner.create();
const render = Matter.Render.create({
  element: document.body,
  engine,
  options: {
    width: 3800,
    height: 1900,
    wireframes: false,
    background: ROAD,
  },
});

BasicScene.generate(engine);

Matter.Render.setPixelRatio(render, 1);
Matter.Render.run(render);
Matter.Runner.run(runner, engine);
