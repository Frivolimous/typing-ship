import * as PIXI from 'pixi.js';
import { JMTween } from '../../JMGE/JMTween';
import { Colors } from '../../data/Colors';

export class Shield extends PIXI.Graphics {
  private tween: JMTween;

  constructor() {
    super();
    this.beginFill(0xffffff, 0.5);
    this.drawCircle(0, 0, 100);
    this.alpha = 0;
    this.tint = Colors.GAME.SHIELD;
  }

  public fadeIn(alpha: number = 1) {
    this.alpha = 0;
    if (this.tween) {
      this.tween.stop();
    }
    this.tween = new JMTween<Shield>(this, 200).to({ alpha }).start();
  }

  public fadeTo(alpha: number) {
    if (this.tween) {
      this.tween.stop();
    }
    this.tween = new JMTween<Shield>(this, 200).to({ alpha }).start();
  }

public fadeOut() {
    new JMTween<Shield>(this, 100).colorTo({ tint: 0xffffff }).start();
    if (this.tween) {
      this.tween.stop();
    }
    this.tween = new JMTween<Shield>(this, 400).to({ alpha: 0 }).onComplete( () => this.parent.removeChild(this)).start();
  }
}
