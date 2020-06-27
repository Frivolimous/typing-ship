import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { JMTween, JMEasing } from '../JMTween';

const defaultConfig: IGauge = { width: 100, height: 30, rounding: 15, bgColor: 0x333333, color: 0x888888 };

interface IGauge {
  width: number;
  height: number;
  rounding: number;
  bgColor: number;
  color: number;
}

export class Gauge extends PIXI.Container {
  public percent = 1;

  private back = new PIXI.Graphics();
  private front = new PIXI.Graphics();
  private overlay = new PIXI.Graphics();

  constructor(private config: IGauge) {
    super();

    this.config = _.defaults(config, defaultConfig);

    this.addChild(this.back, this.front, this.overlay);

    this.setWidth(this.config.width);
  }

  public setWidth(width?: number) {
    this.back.clear().beginFill(this.config.bgColor).drawRoundedRect(0, 0, width, this.config.height, this.config.rounding);
    this.overlay.clear().beginFill(0xffffff, 0.3).lineStyle(0).drawRoundedRect(this.config.height / 2, 3, width - this.config.height, 4, 2);
    this.setPercent(this.percent);
  }

  public setPercent(percent: number) {
    let oldWidth = Math.max(this.back.width * this.percent, this.config.height);

    percent = Math.max(0, Math.min(1, percent));
    this.percent = percent;

    let width = Math.max(this.back.width * percent, this.config.height);

    new JMTween({width: oldWidth}, 200).to({width}).start().easing(JMEasing.Quadratic.InOut).onUpdate((data) => {
      this.front.clear().beginFill(this.config.color).drawRoundedRect(0, 0, data.width, this.config.height, this.config.rounding);
    }).onComplete(data => {
      this.front.clear().beginFill(this.config.color).drawRoundedRect(0, 0, data.width, this.config.height, this.config.rounding);
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
