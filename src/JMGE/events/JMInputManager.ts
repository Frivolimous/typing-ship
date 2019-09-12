import { JMInteractionEvents } from "./JMInteractionEvents";
import { MouseObject } from "./objects/MouseObject";

export class InputManager {
  MOUSE_HOLD: number = 200;
  mouse: MouseObject;

  constructor(private app: PIXI.Application) {
    this.mouse = new MouseObject();
    this.mouse.addCanvas(app.stage);

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    window.addEventListener("mousewheel", this.onWheel);
  }

  onWheel = (e: WheelEvent) => {
    JMInteractionEvents.MOUSE_WHEEL.publish({mouse: this.mouse, deltaY: e.deltaY });
  }

  onKeyDown = (e: any) => {
    //if (external keyboard override) dothat;
    switch (e.key) {
      case "a": case "A": break;
      case "Control": this.mouse.ctrlKey = true; break;
    }

    JMInteractionEvents.KEY_DOWN.publish({key: e.key});
  }

  onKeyUp = (e: any) => {
    switch (e.key) {
      case "Control": this.mouse.ctrlKey = false; break;
    }

    JMInteractionEvents.KEY_UP.publish({ key: e.key });
  }
}