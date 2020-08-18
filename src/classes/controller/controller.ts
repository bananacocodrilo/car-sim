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
  subscription: any;

  _receiveKeyboardEvent = (event: KeyboardEvent) => {
    switch (event.key) {
      case "a":
      case "A":
        this.controlState.steering = event.type === "keydown" ? -100 : 0;
        break;
      case "d":
      case "D":
        this.controlState.steering = event.type === "keydown" ? 100 : 0;
        break;
      case "w":
      case "W":
        this.controlState.throttle = event.type === "keydown" ? 100 : 0;
        break;
      case "s":
      case "S":
        this.controlState.throttle = event.type === "keydown" ? -100 : 0;
        break;
      default:
        return;
    }
    this.myObservers.forEach((observer) => observer.onNext(this.controlState));
  };

  constructor(id: string) {
    this.id = `Controller-${id}`;
    this.observable = Observable.create(this.subscribe);
    this.myObservers = [];

    this.subscription = Observable.fromEvent(document, "keydown").subscribe(
      this._receiveKeyboardEvent
    );
    this.subscription = Observable.fromEvent(document, "keyup").subscribe(
      this._receiveKeyboardEvent
    );
  }

  subscribe = (observer: Observer<CarCrontrol>) => {
    this.myObservers.push(observer);
  };
}
