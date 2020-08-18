import { World, Vector, Body, Bodies, Engine, Composite } from "matter-js";
import { raycast } from "../raycasting/raycast";

const DEFAULT_FOV = 350;

const SENSOR_ON = "#1F8F10";
const SENSOR_OFF = "#8F1010";
const INDICATOR_COLOR = "#8F1010";

export class Sensor {
  public id: string;
  mark: Body;
  lineIndicator: Body;
  detectionMark: Body;

  platform: Matter.Body;
  relativePosition: Matter.Vector;
  relativeAngle: number;

  fovDistance: number;
  fov: Matter.Vector;
  /**
   *
   * @param id Unique id for logs
   * @param world World in order to create the bodies
   * @param position Absolute position in the world
   * @param angle Absolute angle where the sensor is facing
   * @param platform Body that the sensor is attached to
   * @param fovDistance Max distance the sensor can reach
   */
  constructor(
    id: string,
    world: Matter.World,
    position: Matter.Vector,
    angle: number,
    platform: Matter.Body,
    fovDistance = DEFAULT_FOV
  ) {
    this.id = `Sensor-${id}`;
    this.fovDistance = fovDistance;

    this.platform = platform;
    this.relativePosition = Vector.sub(platform.position, position);
    this.relativeAngle = angle - platform.angle;

    this.mark = Bodies.rectangle(0, 0, 10, 4, {
      isSensor: true,
      isStatic: true,
      collisionFilter: {
        group: -1,
        category: 2,
        mask: 0,
      },
      render: {
        fillStyle: SENSOR_OFF,
      },
    });

    this.lineIndicator = Bodies.rectangle(0, 0, this.fovDistance, 1, {
      isStatic: true,
      isSensor: true,
      collisionFilter: {
        group: -1,
        category: 2,
        mask: 0,
      },
      render: {
        fillStyle: INDICATOR_COLOR,
      },
    });

    this.detectionMark = Bodies.circle(0, 0, 9, {
      isSensor: false,
      isStatic: true,
      collisionFilter: {
        group: -1,
        category: 2,
        mask: 0,
      },
      render: {
        visible: false,
        fillStyle: INDICATOR_COLOR,
      },
    });

    World.add(world, this.mark);
    World.add(world, this.lineIndicator);
    World.add(world, this.detectionMark);
  }

  /**
   * Updates the position of the sensor according to the platform
   */
  public update = () => {
    const newPos = Vector.add(
      this.platform.position,
      Vector.rotate(this.relativePosition, this.platform.angle)
    );
    this.setPosition(newPos);
    this.setAngle(this.platform.angle + this.relativeAngle);
  };

  public read = (obstacles: Body[]): number => {
    const collisions = raycast(
      obstacles,
      this.mark.position,
      Vector.add(this.fov, this.mark.position)
    );
    let measure = this.fovDistance;

    if (collisions.length > 0) {
      measure = Vector.magnitude(Vector.sub(collisions[0].point, this.mark.position));

      if (this.lineIndicator.render.visible) {
        Body.set(this.detectionMark, {
          render: { visible: true, fillStyle: INDICATOR_COLOR },
          position: { ...collisions[0].point },
        });
      }
    } else if (this.detectionMark.render.visible) {
      Body.set(this.detectionMark, { render: { visible: false } });
    }

    if (this.mark.render.visible) {
      Body.set(this.mark, {
        render: {
          visible: true,
          fillStyle: collisions.length > 0 ? SENSOR_ON : SENSOR_OFF,
        },
      });
    }

    return measure;
  };

  public show = () => {
    this.mark.render.visible = true;
  };

  public showIndicator = () => {
    this.mark.render.visible = true;
    this.lineIndicator.render.visible = true;
  };

  public hide = () => {
    this.mark.render.visible = false;
    this.lineIndicator.render.visible = false;
  };

  public hideIndicator = () => {
    this.lineIndicator.render.visible = false;
  };

  setAngle = (angle: number) => {
    Body.setAngle(this.mark, angle);
    this.fov = Vector.create(
      this.fovDistance * this.mark.axes[1].x,
      this.fovDistance * this.mark.axes[1].y
    );

    Body.set(this.lineIndicator, {
      angle,
      position: {
        x: this.mark.position.x + this.fov.x / 2,
        y: this.mark.position.y + this.fov.y / 2,
      },
    });
  };

  setPosition = (position: Vector) => {
    Body.setPosition(this.mark, position);
  };
}
