import * as PIXI from 'pixi.js';

interface IGauge {
  width: number;
  height: number;
  rounding: number;
  bgColor: number;
  color: number;
}

export class Gauge extends PIXI.Container {
  public value: number;
  public max: number;
  public percent: number;
  private front: PIXI.Graphics;

  constructor(private config: IGauge) {
    super();

    let back = new PIXI.Graphics();
    back.beginFill(config.bgColor).drawRoundedRect(0, 0, config.width, config.height, config.rounding);
    this.addChild(back);
    this.front = new PIXI.Graphics();
    this.redrawFront(1);
    this.addChild(this.front);
  }

  public setValue(value: number, max: number = -1) {
    if (max >= 1) this.max = max;
    this.value = value;
    this.percent = this.value / this.max;
    this.redrawFront(this.percent);
  }

  public setMax(max: number) {
    if (max >= 1) this.max = max;
    this.percent = this.value / this.max;
    this.redrawFront(this.percent);
  }

  public redrawFront(percent: number) {
    percent = Math.min(Math.max(0, percent), 1);
    this.front.clear();
    this.front.beginFill(this.config.color);
    let width = this.config.width * percent;
    this.front.drawRoundedRect(0, 0, width, this.config.height, Math.min(this.config.rounding, width / 2));
  }

  public getWidth() {
    return this.config.width;
  }

  public getHeight() {
    return this.config.height;
  }
}
