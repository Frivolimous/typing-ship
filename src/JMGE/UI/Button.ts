import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { colorLuminance } from '../others/Colors';
import { Fonts } from '../../data/Fonts';
import { JMTween } from '../JMTween';

const defaultConfig: Partial<IButton> = { width: 200, height: 50, rounding: 8, color: 0x77ccff };

const defaultLabelStyle: PIXI.TextStyleOptions = { fill: 0, fontFamily: Fonts.UI };

export interface IButton {
  color?: number;
  width?: number;
  height?: number;
  rounding?: number;
  label?: string;
  labelStyle?: any;
  onClick: () => void;
}

export class Button extends PIXI.Container {
  private background: PIXI.Graphics;

  private label: PIXI.Text;
  private inner: PIXI.Container;
  private color: number;

  private disabledColor = 0x999999;

  private _Disabled: boolean;

  private _Highlight: PIXI.Graphics;
  private _HighlightTween: JMTween;

  constructor(protected config: IButton) {
    super();
    config = _.defaults(config, defaultConfig);
    this.color = config.color;

    this.hitArea = new PIXI.Rectangle(0, 0, config.width, config.height);

    this.inner = new PIXI.Container();
    this.inner.pivot.set(config.width / 2, config.height / 2);
    this.inner.position.set(config.width / 2, config.height / 2);
    this.addChild(this.inner);
    this.background = new PIXI.Graphics();
    this.background.beginFill(0xffffff).drawRoundedRect(0, 0, config.width, config.height, config.rounding);
    this.background.tint = config.color;
    let style = _.defaults(config.labelStyle, defaultLabelStyle);

    this.inner.addChild(this.background);
    this.label = new PIXI.Text(config.label, style);
    this.addLabel();
    this.inner.addChild(this.label);

    this.interactive = true;
    this.buttonMode = true;

    this.addListener('mouseover', () => {
      this.background.tint = colorLuminance(this.color, 0.8);
      this.inner.scale.set(1.1);
    });
    this.addListener('mouseout', () => {
      this.background.tint = this.color;
      this.inner.scale.set(1);
    });
    this.addListener('mouseup', () => {
      this.background.tint = colorLuminance(this.color, 0.8);
      this.inner.scale.set(1);
      config.onClick();
    });

    this.addListener('touchend', () => {
      this.background.tint = this.color;
      this.inner.scale.set(1);
      config.onClick();
    });

    this.addListener('pointerdown', () => {
      this.background.tint = colorLuminance(this.color, 0.8);
      this.inner.scale.set(0.9);
    });
  }

  public setColor(color: number) {
    this.color = color;
    this.background.tint = color;
  }

  public addLabel(s?: string) {
    if (s) {
      this.label.text = s;
    }
    this.label.scale.set(1, 1);

    if (this.label.width > this.background.width * 0.9) {
      this.label.width = this.background.width * 0.9;
    }
    this.label.scale.y = this.label.scale.x;
    this.label.x = (this.background.width - this.label.width) / 2;
    this.label.y = (this.background.height - this.label.height) / 2;
  }

  public getLabel() { return this.label.text; }

  public set disabled(b: boolean) {
    this._Disabled = b;
    this.interactive = !b;
    this.buttonMode = !b;
    if (b) {
      this.background.tint = this.disabledColor;
    } else {
      this.background.tint = this.color;
    }
  }

  public get disabled() {
    return this._Disabled;
  }

  public getWidth(withScale = true) {
    return this.config.width * (withScale ? this.scale.x : 1);
  }

  public getHeight(withScale = true) {
    return this.config.height * (withScale ? this.scale.y : 1);
  }

    public highlight(b: boolean) {
    if (b) {
      if (this._Highlight) return;
      this._Highlight = new PIXI.Graphics();
      this._Highlight.lineStyle(3, 0xffff00);
      this._Highlight.drawRoundedRect(0, 0, this.getWidth(), this.getHeight(), this.config.rounding);
      this._HighlightTween = new JMTween(this._Highlight, 500).to({alpha: 0}).yoyo().start();
      this.addChild(this._Highlight);
    } else {
      if (this._HighlightTween) {
        this._HighlightTween.stop();
        this._HighlightTween = null;
      }
      if (this._Highlight) {
        this._Highlight.destroy();
        this._Highlight = null;
      }
    }
  }
}
