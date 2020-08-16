import { Observer, Observable } from "rx";
import { CarCrontrol } from "../../interfaces";

export class Controller {
  id: string;
  observable: Observable<CarCrontrol>;
  myObservers: Observer<CarCrontrol>[];
  controlState: CarCrontrol = {
    throttle: 0,
    steering: 0,
  };

  constructor(id: string) {
    this.id = `Controller-${id}`;
    this.observable = Observable.create(this.subscribe);
    this.myObservers = [];

    setInterval(() => {
      this.controlState.throttle = -100 + Math.random() * 200;
      this.controlState.steering = -100 + Math.random() * 200;

      this.myObservers.forEach((observer) => observer.onNext(this.controlState));
    }, 1000);
  }

  subscribe = (observer: Observer<CarCrontrol>) => {
    this.myObservers.push(observer);
  };
}
