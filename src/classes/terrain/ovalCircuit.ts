import perlin = require("perlin-noise");
import { Body, Bodies, Vertices, Vector } from "matter-js";

const X_AXIS = 1.9;
const ROAD_WIDTH = 1.5;
const BARRIER = 1.3;
const RADIUS = 500;
const STEPS = 20;
const OUT_STEPS = 50;

const GRASS = "#556B2F";

export class OvalCircuit {
  static generate(
    center: Matter.Vector,
    radius = RADIUS
  ): { inner: Matter.Body; outer: Matter.Body } {
    let inner: Matter.Body;
    let outer: Matter.Body;

    const coordinates: Matter.Vector[] = [];
    const innerCoordinates: Matter.Vector[] = [];

    for (let i = STEPS; i >= 0; i--) {
      coordinates.push({
        x: center.x + X_AXIS * BARRIER * ROAD_WIDTH * radius * Math.cos((2 * Math.PI * i) / STEPS),
        y: center.y + BARRIER * ROAD_WIDTH * radius * Math.sin((2 * Math.PI * i) / STEPS),
      });
    }

    for (let i = 0; i <= STEPS; i++) {
      coordinates.push({
        x: center.x + X_AXIS * ROAD_WIDTH * radius * Math.cos((2 * Math.PI * i) / STEPS),
        y: center.y + ROAD_WIDTH * radius * Math.sin((2 * Math.PI * i) / STEPS),
      });

      innerCoordinates.push({
        x: center.x + X_AXIS * 1.1 * radius * Math.cos((2 * Math.PI * i) / STEPS),
        y: center.y + radius * Math.sin((2 * Math.PI * i) / STEPS),
      });
    }

    inner = Bodies.fromVertices(center.x, center.y, [Vertices.create(innerCoordinates, inner)], {
      isStatic: true,
      render: {
        fillStyle: GRASS,
      },
    });
    outer = Bodies.fromVertices(center.x, center.y, [Vertices.create(coordinates, outer)], {
      isStatic: true,
      render: {
        fillStyle: GRASS,
      },
    });
    return { inner, outer };
  }
}
