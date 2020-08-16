export class Controller {
  private id: string;
  private throttleValue: number;
  private steeringValue: number;

  constructor(id: string) {
    this.id = `Controller-${id}`;
    console.log("TODO: Subscribe to mqtt topic: controller/$id/steering and  controller/$id/throttle");

    setInterval(() => this._updateThrottle(Math.random()), 500);
  }

  private _updateThrottle(value: number): void {
    this.throttleValue = Math.min(Math.max(value, -1), 1);
  }
  private _updateSteering(value: number): void {
    this.steeringValue = Math.min(Math.max(value, -1), 1);
  }

  /**
   * Returns a value in [-1, 1]
   */
  getThrottle(): number {
    return this.throttleValue;
  }

  /**
   * Returns a value in [-1, 1]
   */
  getSteering(): number {
    return this.steeringValue;
  }
}
