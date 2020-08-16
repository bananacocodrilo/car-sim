/**
 * Raycast functionality integrated with matter.js since there is no built-in method for raycasting that returns the
 *  ray's intersection points
 *
 * Based on the code by Isaiah Smith. The original can be found here:
 * https://github.com/Technostalgic/MatterJS_Raycast.git
 *
 * The original works perfectly as is, I only modified it to follow my ts setup because otherwise my OCD wouldn't
 * let me sleep :)
 */
import { Vector, Query, Body } from "matter-js";

import { Vec2 } from "./vec2";
import { Ray } from "./ray";

/**
 *
 * @function raycast - returns an array of 'raycol' objects
 * @param bodies  bodies to check collision with; passed through 'Matter.Query.ray()
 * @param start  start point of raycast
 * @param end  end point of raycast
 * @param sort  whether or not the ray collisions should be sorted based on distance from the origin
 */
export const raycast = (bodies: Body[], start: Vector, end: Vector, sort = true) => {
  // Convert the start & end parameters to my custom
  // 'Vec2' object type
  start = Vec2.fromOther(start);
  end = Vec2.fromOther(end);

  // The bodies that the raycast will be tested against
  // are queried and stored in the variable 'query'.
  // This uses the built-in raycast method which takes
  // advantage of the broad-phase collision optomizations
  // instead of iterating through each body in the list
  const query = Query.ray(bodies, start, end);

  // 'cols': the array that will contain the ray
  // collision information
  const cols = [];
  // 'raytest': the ray object that will be tested for
  // collision against the bodies
  const raytest = new Ray(start, end);

  // Next, since all the bodies that the ray collides with
  // have already been queried, we iterate through each
  // one to see where the ray intersects with the body
  // and gather other information
  for (let i = query.length - 1; i >= 0; i--) {
    const bcols = Ray.bodyCollisions(raytest, query[i].body);
    for (let k = bcols.length - 1; k >= 0; k--) {
      cols.push(bcols[k]);
    }
  }

  // if desired, we then sort the collisions based on the
  // distance from the ray's start
  if (sort)
    cols.sort((a, b) => {
      return a.point.distance(start) - b.point.distance(start);
    });

  return cols;
};
