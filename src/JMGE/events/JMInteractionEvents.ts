import { JMEventListener } from './JMEventListener';
import { JMRect } from '../others/JMRect';

export const JMInteractionEvents = {
  WINDOW_RESIZE: new JMEventListener<IResizeEvent>(),
};

export interface IResizeEvent {
  outerBounds: JMRect;
  innerBounds: JMRect;
}
