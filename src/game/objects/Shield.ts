import * as PIXI from 'pixi.js';
import { JMTween } from '../../JMGE/JMTween';

export class Shield extends PIXI.Graphics {
  constructor() {
    super();
    this.beginFill(0xffffff, 0.5);
    this.drawCircle(0, 0, 100);
    this.alpha = 0;
    this.tint = 0x00aaff;
  }

  public fadeIn(alpha: number = 1) {
    this.alpha = 0;
    new JMTween<Shield>(this, 200).to({ alpha }).start();
  }

  public fadeTo(alpha: number) {
    new JMTween<Shield>(this, 200).to({ alpha }).start();
  }

  public fadeOut() {
    new JMTween<Shield>(this, 100).colorTo({ tint: 0xffffff }).start();
    new JMTween<Shield>(this, 400).to({ alpha: 0 }).onComplete( () => this.parent.removeChild(this)).start();
  }
}
