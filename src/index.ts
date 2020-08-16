import { Vector, Body } from "matter-js";
import { Controller, Sensor, Car } from "./classes";
import Matter = require("matter-js");

const Engine = Matter.Engine;
// create engine
let engine = Engine.create();
engine.world.gravity.y = 0;

console.log(engine.world.gravity);

console.log(engine.world.gravity);

let runner = Matter.Runner.create();
let render = Matter.Render.create({
  element: document.body,
  engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false,
    background: "#DDD",
  },
});

Matter.Render.setPixelRatio(render, 1);
Matter.Render.run(render);
Matter.Runner.run(runner, engine);

let car: Car;

const sensors: Sensor[] = [];
const center = { x: 100, y: 300 };

setTimeout(() => {
  const box = Matter.Bodies.rectangle(450, 200, 20, 200, {
    isSensor: true,
    isStatic: false,
    frictionAir: 0,
    friction: 0,
    render: {
      strokeStyle: "#C41D18",
      lineWidth: 3,
    },
  });
  Matter.Body.setAngularVelocity(box, 0.04);
  Matter.World.add(engine.world, [box]);

  car = new Car("1", engine.world, center, 0.3);
  // car.throttle(30);
  // car.steering(30);

  setInterval(() => {
    car.update([box]);
  }, 20);

  Matter.Body.setVelocity(box, { x: 0, y: 1 });
  setInterval(() => {
    if (box.position.y > 500) {
      Matter.Body.setVelocity(box, { x: 0, y: -1 });
    } else if (box.position.y < 100) {
      Matter.Body.setVelocity(box, { x: 0, y: 1 });
    }
  }, 500);
}, 150);
