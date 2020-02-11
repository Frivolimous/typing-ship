import * as PIXI from 'pixi.js';
import * as _ from 'lodash';

export interface IBasicElement {
  color?: number;
  width?: number;
  height?: number;
  rounding?: number;
  label?: string;
  labelStyle?: PIXI.TextStyleOptions;
}

export class BasicElement extends PIXI.Container {
  public background: PIXI.Graphics;
  private label: PIXI.Text;

  constructor(private config: IBasicElement) {
    super();
    config = _.assign({width: 200, height: 50, rounding: 5, color: 0x8080ff}, config);
    this.background = new PIXI.Graphics();
    this.addChild(this.background);
    this.background.beginFill(0xffffff).drawRoundedRect(0, 0, config.width, config.height, config.rounding);
    this.background.tint = config.color;

    if (config.label) {
      this.addLabel(config.label, config.labelStyle);
    }
  }

  public getWidth() {
    return this.config.width;
  }

  public getHeight() {
    return this.config.height;
  }

  public addLabel(s: string, style?: PIXI.TextStyleOptions) {
    if (this.label) {
      this.label.text = s;
      if (style) this.label.style = new PIXI.TextStyle(style);
      this.label.scale.set(1, 1);
    } else {
      this.label = new PIXI.Text(s, style || {});
      this.addChild(this.label);
    }
    if (this.label.width > this.getWidth() * 0.9) {
      this.label.width = this.getWidth() * 0.9;
    }
    this.label.scale.y = this.label.scale.x;
    this.label.x = (this.getWidth() - this.label.width) / 2;
    this.label.y = (this.getHeight() - this.label.height) / 2;
  }
}
