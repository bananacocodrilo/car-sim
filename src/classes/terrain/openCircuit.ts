import perlin = require("perlin-noise");
import { Body, Bodies, Vertices } from "matter-js";

declare global {
  interface Window {
    decomp: any;
  }
}

// tslint:disable-next-line
window.decomp = require("poly-decomp");

const VERTEX_DISTANCE = 30;
const NOISE_AMPLITUDE = 300;

export class OpenCircuit {
  static generate(startingPoint: Matter.Vector, length: number): Matter.Body {
    const noise = perlin.generatePerlinNoise(length, 1, {
      octaveCount: 4,
      amplitude: 0.1,
      persistence: 0.2,
    });
    console.log(noise);
    const vertexSet: Matter.Vector[] = [];

    for (let i = 0; i < length; i++) {
      const vertex = { ...startingPoint };
      vertex.x += i * VERTEX_DISTANCE;
      vertex.y += NOISE_AMPLITUDE * noise[i];
      vertexSet.push(vertex);

      vertex.y += 20;
      vertexSet.push(vertex);
    }

    let body: Matter.Body;
    body = Bodies.fromVertices(0, 0, [Vertices.create(vertexSet, body)], {
      isStatic: true,
      isSensor: false,
      render: {
        strokeStyle: "#C41D18",
        lineWidth: 3,
      },
    });

    return body;
  }
}
