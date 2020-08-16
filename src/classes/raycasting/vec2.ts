import { Vector } from "matter-js";

export class Vec2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromOther(other: Vector) {
    return new Vec2(other.x, other.y);
  }

  minus(other: Vector) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  plus(other: Vector) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  div(n: number) {
    return new Vec2(this.x / n, this.y / n);
  }

  normalized() {
    return new Vec2(this.x / this.mag(), this.y / this.mag());
  }

  rotate(angle: number) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Vec2(c * this.x - s * this.y, s * this.x + c * this.y);
  }

  distance(other: Vector) {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }
}
