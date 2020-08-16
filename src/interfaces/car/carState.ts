export interface CarState {
  movement: {
    throttle: number;
    steering: number;
  };
  active: boolean;
}
