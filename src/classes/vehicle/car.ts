import { Sensor } from "./sensor";
import { World, Vector, Bodies, Body } from "matter-js";
import { CarState } from "../../interfaces";

const CAR_L = 60;
const CAR_W = 27;
const CAR_RESTITUTION = 0.3;
const CAR_FRICTION = 0.06;
const SENSOR_ARC = Math.PI;

const MAX_THROTTLE = 0.009;
const MAX_STEERING = 0.00003;

const FRONT_SENSORS = 5;

export class Car {
  id: string;
  private world: Matter.World;
  private carBody: Matter.Body;

  public sensors: Sensor[] = [];
  private carState: CarState;

  private initPosition: Matter.Vector;
  private initAngle: number;

  constructor(id: string, world: Matter.World, position: Vector, angle: number) {
    this.id = `Car-${id}`;
    this.world = world;
    this.initAngle = angle;
    this.initPosition = position;
    this.carState = {
      active: false,
      movement: {
        throttle: 0,
        steering: 0,
      },
    };

    this.carBody = Bodies.rectangle(position.x, position.y, CAR_L, CAR_W, {
      restitution: CAR_RESTITUTION,
      frictionAir: CAR_FRICTION,
      isSensor: true,
      render: {
        fillStyle: "#8F8010",
        sprite: {
          texture: "img/car.png",
          xScale: 1,
          yScale: 1,
        },
      },
    });
    Body.rotate(this.carBody, Math.PI);
    World.add(this.world, this.carBody);

    this.createSensors();
    this.reset();
  }

  public reset = () => {
    Body.setAngularVelocity(this.carBody, 0);
    Body.setVelocity(this.carBody, { x: 0, y: 0 });
    Body.setAngle(this.carBody, this.initAngle);
    Body.setPosition(this.carBody, this.initPosition);
  };
  public throttle = (percentage: number) => {
    percentage = Math.max(Math.min(percentage, 100), -100);
    this.carState.movement.throttle = (percentage * MAX_THROTTLE) / 100;
  };

  public steering = (percentage: number) => {
    percentage = Math.max(Math.min(percentage, 100), -100);
    this.carState.movement.steering = (MAX_STEERING * percentage) / 100;
  };

  public update = (obstacles: Matter.Body[]) => {
    Body.applyForce(this.carBody, this.carBody.position, {
      x: this.carState.movement.throttle * this.carBody.axes[1].x,
      y: this.carState.movement.throttle * this.carBody.axes[1].y,
    });
    this.carBody.torque = (this.carState.movement.steering * this.carBody.speed) / MAX_THROTTLE;

    this.sensors.forEach((sensor) => {
      sensor.update();
      sensor.read(obstacles);
    });
  };

  private createSensors = () => {
    const radius = CAR_W / 2;
    const totalSensors = FRONT_SENSORS % 0 ? FRONT_SENSORS + 1 : FRONT_SENSORS;
    const deltaAngle = SENSOR_ARC / (totalSensors - 1);
    const center = {
      x: this.carBody.position.x + CAR_L / 2 - radius,
      y: this.carBody.position.y,
    };

    for (let i = 0; i < totalSensors; i++) {
      const sensorAngle = Math.PI / 2 - i * deltaAngle;
      const newPos = Vector.add(center, Vector.rotate({ x: radius, y: 0 }, sensorAngle));
      this.sensors.push(
        new Sensor(`${i}`, this.world, newPos, Math.PI + sensorAngle, this.carBody)
      );
    }

    this.sensors.push(
      new Sensor(
        `L-0`,
        this.world,
        { x: this.carBody.position.x - radius, y: this.carBody.position.y - radius },
        Math.PI / 2,
        this.carBody
      )
    );
    this.sensors.push(
      new Sensor(
        `L-1`,
        this.world,
        { x: this.carBody.position.x - radius, y: this.carBody.position.y + radius },
        (3 * Math.PI) / 2,
        this.carBody
      )
    );
  };
}
