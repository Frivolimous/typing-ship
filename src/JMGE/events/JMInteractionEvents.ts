import { JMEventListener } from './JMEventListener';
import { MouseObject } from './objects/MouseObject';
import { JMRect } from '../others/JMRect';

export const JMInteractionEvents = {
  MOUSE_MOVE: new JMEventListener<MouseObject>(),
  MOUSE_DOWN: new JMEventListener<MouseObject>(),
  MOUSE_UP: new JMEventListener<MouseObject>(),
  MOUSE_CLICK: new JMEventListener<MouseObject>(),
  MOUSE_WHEEL: new JMEventListener<IMouseWheelEvent>(),

  KEY_DOWN: new JMEventListener<IKeyboardEvent>(),
  KEY_UP: new JMEventListener<IKeyboardEvent>(),

  UI_OVER: new JMEventListener<IMouseWheelEvent>(),
  UI_OFF: new JMEventListener<IMouseWheelEvent>(),
  WINDOW_RESIZE: new JMEventListener<IResizeEvent>(),
};

export interface IMouseWheelEvent {
  mouse: MouseObject;
  deltaY: number;
}

export interface IKeyboardEvent {
  key: string;
}

export interface IResizeEvent {
  outerBounds: JMRect;
  innerBounds: JMRect;
}
