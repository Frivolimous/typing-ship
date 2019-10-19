import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { JMTween } from '../../JMGE/JMTween';
import { interactionMode } from '../../index';

const CLICK_DELAY = 200;

export interface IButton {
  color?: number;
  width?: number;
  height?: number;
  rounding?: number;
  label?: string;
  labelStyle?: PIXI.TextStyleOptions;
  onClick: (e: PIXI.interaction.InteractionEvent) => void;
  onOver?: (e: PIXI.interaction.InteractionEvent) => void;
  onOut?: (e: PIXI.interaction.InteractionEvent) => void;
}

export class Button extends PIXI.Container {
  public background: PIXI.Graphics;
  private label: PIXI.Text;
  private timeout: boolean = null;
  private _Disabled: boolean;
  private downOnThis: boolean;

  private _Highlight: PIXI.Graphics;
  private _HighlightTween: JMTween;

  private overlay: PIXI.Graphics;

  constructor(private config: IButton) {
    super();
    this.config = config = _.assign({width: 200, height: 50, rounding: 5, color: 0x8080ff}, config);
    this.background = new PIXI.Graphics();
    this.addChild(this.background);
    this.background.beginFill(0xffffff).drawRoundedRect(0, 0, config.width, config.height, config.rounding);
    this.background.tint = config.color;

    if (config.label) {
      this.addLabel(config.label, config.labelStyle);
    }

    this.overlay = new PIXI.Graphics();
    this.addChild(this.overlay);
    this.overlay.beginFill(0xffffff).drawRoundedRect(0, 0, config.width, config.height, config.rounding);
    this.overlay.alpha = 0;

    this.interactive = true;
    this.buttonMode = true;

    if (interactionMode === 'desktop') {
      this.addListener('pointerover', (e: PIXI.interaction.InteractionEvent) => {
        if (!this.disabled) {
          this.setDisplayState('over');
          if (this.config.onOver) {
            this.config.onOver(e);
          }
        }
      });

      this.addListener('pointerout', (e: PIXI.interaction.InteractionEvent) => {
        if (!this.disabled) {
          this.setDisplayState('normal');
          if (this.config.onOut) {
            this.config.onOut(e);
          }
        }
        this.downOnThis = false;
      });

      this.addListener('pointerdown', (e: PIXI.interaction.InteractionEvent) => {
        if (!this.disabled) this.setDisplayState('down');
        this.downOnThis = true;
        if (this.timeout === false) {
          this.timeout = true;

          window.setTimeout(() => this.timeout = false, CLICK_DELAY);
        }
      });
      this.addListener('pointerup', (e: PIXI.interaction.InteractionEvent) => {
        if (!this.disabled) this.setDisplayState('over');
        if (this.downOnThis && !this.disabled && this.timeout !== false) this.config.onClick(e);
        this.downOnThis = false;
      });
    } else {
      this.addListener('touchend', (e: PIXI.interaction.InteractionEvent) => {
        if (!this.disabled) this.config.onClick(e);
      });
    }
  }

  public set disabled(b: boolean) {
    this._Disabled = b;
    if (b) {
      this.setDisplayState('disabled');
    } else {
      this.setDisplayState('normal');
    }
  }

  public get disabled() {
    return this._Disabled;
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

  public setDisplayState(state: 'normal'|'over'|'disabled'|'down') {
    switch (state) {
      case 'over':
        this.overlay.tint = 0;
        this.overlay.alpha = 0.5;
        break;
      case 'disabled':
        this.overlay.tint = 0;
        this.overlay.alpha = 0.8;
        break;
      case 'down':
        this.overlay.tint = 0xffffff;
        this.overlay.alpha = 0.3;
        break;
      case 'normal':
      default:
        this.overlay.alpha = 0;
        break;
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
