import { Controller, Car } from "..";
import { Observer } from "rx";
import { CarCrontrol } from "../../interfaces";
import { OvalCircuit } from "..";
import { World, Events } from "matter-js";

const startPoint = { x: 1500, y: 150 };

export class BasicScene {
  public static generate(engine: Matter.Engine) {
    const controller = new Controller("1");
    const car = new Car("1", engine.world, startPoint, Math.PI);
    const circuit: { inner: Matter.Body; outer: Matter.Body } = OvalCircuit.generate(
      { x: 1700, y: 900 },
      600
    );

    setInterval(() => {
      car.update([circuit.inner, circuit.outer]);
    }, 20);

    controller.subscribe(
      Observer.create(
        (data: CarCrontrol) => {
          car.throttle(data.throttle);
          car.steering(data.steering);
        },
        (err: Error) => console.error("Observer got an error: " + err),
        () => console.log("Observer got a complete notification")
      )
    );

    Events.on(engine, "collisionStart", (data: any) => {
      if (data.pairs.length) {
        console.log("BAD AI! BAD!");
        car.reset();
      }
    });

    World.add(engine.world, circuit.inner);
    World.add(engine.world, circuit.outer);
  }
}
