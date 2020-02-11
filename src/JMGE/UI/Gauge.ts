import * as PIXI from 'pixi.js';
import { JMTween, JMEasing } from '../JMTween';

export class Gauge extends PIXI.Container {
  public percent = 1;

  private back = new PIXI.Graphics();
  private front = new PIXI.Graphics();
  private overlay = new PIXI.Graphics();

  constructor(width: number, private backHeight: number, private colorBack: number, private colorFront: number) {
    super();

    this.addChild(this.back, this.front, this.overlay);

    this.setWidth(width);
  }

  public setWidth(width?: number) {
    this.back.clear().beginFill(this.colorBack).drawRoundedRect(0, 0, width, this.backHeight, this.backHeight / 2);
    this.overlay.clear().beginFill(0xffffff, 0.3).lineStyle(0).drawRoundedRect(this.backHeight / 2, 3, width - this.backHeight, 4, 2);
    this.setPercent(this.percent);
  }

  public setPercent(percent: number) {
    let oldWidth = Math.max(this.back.width * this.percent, this.backHeight);

    percent = Math.max(0, Math.min(1, percent));
    this.percent = percent;

    let width = Math.max(this.back.width * percent, this.backHeight);

    new JMTween({width: oldWidth}, 200).to({width}).start().easing(JMEasing.Quadratic.InOut).onUpdate((data) => {
      this.front.clear().beginFill(this.colorFront).drawRoundedRect(0, 0, data.width, this.backHeight, this.backHeight / 2);
    }).onComplete(data => {
      this.front.clear().beginFill(this.colorFront).drawRoundedRect(0, 0, data.width, this.backHeight, this.backHeight / 2);
    });
  }

  public setFraction(count: number, total: number) {
    this.setPercent(count / total);
  }

  public getWidth() {
    return this.back.width * this.scale.x;
  }

  public getHeight() {
    return this.back.height * this.scale.y;
  }
}
