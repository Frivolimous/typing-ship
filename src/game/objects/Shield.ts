import * as PIXI from 'pixi.js';
import { JMTween } from '../../JMGE/JMTween';

export class Shield extends PIXI.Graphics {
  constructor() {
    super();
    this.beginFill(0x00aaff, 0.5);
    this.drawCircle(0, 0, 100);
    this.alpha = 0;
  }

  public fadeIn(alpha: number = 1) {
    this.alpha = 0;
    new JMTween<Shield>(this).to({ alpha }).over(200).start();
  }

  public fadeTo(alpha: number) {
    new JMTween<Shield>(this).to({ alpha }).over(200).start();
  }

  public fadeOut() {
    new JMTween<Shield>(this).to({ alpha: 0 }).over(200).onComplete( () => this.parent.removeChild(this)).start();
  }
}
