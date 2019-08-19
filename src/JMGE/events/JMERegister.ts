import { IJMERegister, JMEvents } from './JMEvents';
import { MouseObject } from '../JMBL';

export class JMERegister<T = any> implements IJMERegister<T> {
  public listeners: ((event: T) => void)[] = [];
  public once: ((event: T) => void)[] = [];

  public events: T[] = [];
  public active = false;

  constructor(private onlyLastListener?: boolean, private onlyLastEvent?: boolean) { }

  public addListener(output: (event: T) => void) {
    if (this.onlyLastListener) {
      this.listeners = [output];
    } else {
      this.listeners.push(output);
    }
  }

  public removeListener(output: (event: T) => void) {
    let i = this.listeners.indexOf(output);
    if (i >= 0) {
      this.listeners.splice(i, 1);
    }
  }

  public addOnce(output: (event: T) => void) {
    this.once.push(output);
  }

  public publish(event?: T) {
    JMEvents.selfPublish(this, event, this.onlyLastEvent);
  }
}

export const JMInteractionEvents = {
  MOUSE_MOVE: new JMERegister<MouseObject>(),
  MOUSE_DOWN: new JMERegister<MouseObject>(),
  MOUSE_UP: new JMERegister<MouseObject>(),
  MOUSE_CLICK: new JMERegister<MouseObject>(),
  MOUSE_WHEEL: new JMERegister<IMouseWheelEvent>(),

  KEY_DOWN: new JMERegister<IKeyboardEvent>(),
  KEY_UP: new JMERegister<IKeyboardEvent>(),

  UI_OVER: new JMERegister<IMouseWheelEvent>(),
  UI_OFF: new JMERegister<IMouseWheelEvent>(),
};

export interface IMouseWheelEvent {
  mouse: MouseObject;
  deltaY: number;
}

export interface IKeyboardEvent {
  key: string;
}
