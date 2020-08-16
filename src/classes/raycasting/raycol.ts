export class Raycol {
  point: any;
  body: any;
  normal: any;
  verts: any;

  constructor(body: any, point: any, normal: any, verts: any) {
    this.body = body;
    this.point = point;
    this.normal = normal;
    this.verts = verts;
  }
}
