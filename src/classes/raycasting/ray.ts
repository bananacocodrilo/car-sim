import { Raycol } from "./raycol";
import { Vector, Body } from "matter-js";
import { Vec2 } from "./vec2";

// data type that contains information and methods for a
// ray object
export class Ray {
  start: any;
  end: any;
  verts: any[];
  // initializes a ray instance with the given parameters
  // param 'start' - the starting point of the ray
  // param 'end' - the ending point of the ray
  constructor(start: Vector, end: Vector) {
    this.start = start;
    this.end = end;
  }

  yValueAt(x: number) {
    // returns the y value on the ray at the specified x
    // slope-intercept form:
    // y = m * x + b
    return this.offsetY + this.slope * x;
  }
  xValueAt(y: number) {
    // returns the x value on the ray at the specified y
    // slope-intercept form:
    // x = (y - b) / m
    return (y - this.offsetY) / this.slope;
  }

  pointInBounds(point: Vector) {
    // checks to see if the specified point is within
    // the ray's bounding box (inclusive)
    const minX = Math.min(this.start.x, this.end.x);
    const maxX = Math.max(this.start.x, this.end.x);
    const minY = Math.min(this.start.y, this.end.y);
    const maxY = Math.max(this.start.y, this.end.y);
    return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
  }
  calculateNormal(ref: Vector) {
    // calulates the normal based on a specified
    // reference point
    const dif = this.difference;

    // gets the two possible normals as points that lie
    // perpendicular to the ray
    const norm1 = dif.normalized().rotate(Math.PI / 2);
    const norm2 = dif.normalized().rotate(Math.PI / -2);

    // returns the normal that is closer to the provided
    // reference point
    if (this.start.plus(norm1).distance(ref) < this.start.plus(norm2).distance(ref)) return norm1;
    return norm2;
  }

  get difference() {
    // pretty self explanitory
    return this.end.minus(this.start);
  }
  get slope() {
    const dif = this.difference;
    return dif.y / dif.x;
  }
  get offsetY() {
    // the y-offset at x = 0, in slope-intercept form:
    // b = y - m * x
    // offsetY = start.y - slope * start.x
    return this.start.y - this.slope * this.start.x;
  }
  get isHorizontal() {
    return compareNum(this.start.y, this.end.y);
  }
  get isVertical() {
    return compareNum(this.start.x, this.end.x);
  }

  static intersect(rayA: Ray, rayB: Ray) {
    // returns the intersection point between two rays
    // null if no intersection

    // conditional checks for axis aligned rays
    if (rayA.isVertical && rayB.isVertical) return null;
    if (rayA.isVertical) return new Vec2(rayA.start.x, rayB.yValueAt(rayA.start.x));
    if (rayB.isVertical) return new Vec2(rayB.start.x, rayA.yValueAt(rayB.start.x));
    if (compareNum(rayA.slope, rayB.slope)) return null;
    if (rayA.isHorizontal) return new Vec2(rayB.xValueAt(rayA.start.y), rayA.start.y);
    if (rayB.isHorizontal) return new Vec2(rayA.xValueAt(rayB.start.y), rayB.start.y);

    // slope intercept form:
    // y1 = m2 * x + b2; where y1 = m1 * x + b1:
    // m1 * x + b1 = m2 * x + b2:
    // x = (b2 - b1) / (m1 - m2)
    const x = (rayB.offsetY - rayA.offsetY) / (rayA.slope - rayB.slope);
    return new Vec2(x, rayA.yValueAt(x));
  }
  static collisionPoint(rayA: Ray, rayB: Ray) {
    // returns the collision point of two rays
    // null if no collision
    const intersection = Ray.intersect(rayA, rayB);
    if (!intersection) return null;
    if (!rayA.pointInBounds(intersection)) return null;
    if (!rayB.pointInBounds(intersection)) return null;
    return intersection;
  }

  static bodyEdges(body: Body) {
    // returns all of the edges of a body in the
    // form of an array of ray objects
    const r = [];
    for (let i = body.parts.length - 1; i >= 0; i--) {
      for (let k = body.parts[i].vertices.length - 1; k >= 0; k--) {
        let k2 = k + 1;
        if (k2 >= body.parts[i].vertices.length) k2 = 0;
        const tray = new Ray(Vec2.fromOther(body.parts[i].vertices[k]), Vec2.fromOther(body.parts[i].vertices[k2]));

        // stores the vertices inside the edge
        // ray for future reference
        tray.verts = [body.parts[i].vertices[k], body.parts[i].vertices[k2]];

        r.push(tray);
      }
    }
    return r;
  }
  static bodyCollisions(rayA: Ray, body: Body) {
    // returns all the collisions between a specified ray
    // and body in the form of an array of 'raycol' objects
    const r = [];

    // gets the edge rays from the body
    const edges = Ray.bodyEdges(body);

    // iterates through each edge and tests for collision
    // with 'rayA'
    for (let i = edges.length - 1; i >= 0; i--) {
      // gets the collision point
      const colpoint = Ray.collisionPoint(rayA, edges[i]);

      // if there is no collision, then go to next edge
      if (!colpoint) continue;

      // calculates the edge's normal
      const normal = edges[i].calculateNormal(rayA.start);

      // adds the ray collision to the return array
      r.push(new Raycol(body, colpoint, normal, edges[i].verts));
    }

    return r;
  }
}

// in order to avoid miscalculations due to floating point
// errors
// example:
// 	var m = 6; m -= 1; m -= 3; m += 4
// 	now 'm' probably equals 6.0000000008361 or something stupid
const compareNum = (a: number, b: number, leniency = 0.00001) => {
  return Math.abs(b - a) <= leniency;
};
