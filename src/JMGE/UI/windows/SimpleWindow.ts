import * as PIXI from 'pixi.js';
import { BaseWindow } from './_BaseWindow';
import { Button } from '../Button';
import { JMTween, JMEasing } from '../../JMTween';
import { Fonts } from '../../../data/Fonts';

export interface ISimpleWindow {
  colorBack: number;
  colorFront: number;
  closeText?: string;
}

export class SimpleWindow extends BaseWindow {
  private scoreText: PIXI.Text;
  private closeButton: Button;

  constructor(message: string, private config: ISimpleWindow, width: number, height: number, private onClose?: () => void) {
    super();

    this.pivot.set(width / 2, height / 2);

    let shadow = new PIXI.Graphics();
    shadow.beginFill(0, 0.4).drawRoundedRect(5, 5, width + 10, height + 10, 10);
    this.addChild(shadow);
    let background = new PIXI.Graphics();
    background.lineStyle(3, this.config.colorFront).beginFill(this.config.colorBack).drawRoundedRect(0, 0, width, height, 10);
    this.addChild(background);

    this.scoreText = new PIXI.Text(message, { fontSize: 33, fontFamily: Fonts.UI, fill: this.config.colorFront, wordWrap: true, wordWrapWidth: width - 100 });
    this.addChild(this.scoreText);

    this.scoreText.position.set(50, 50);
    if (onClose !== null) {
      this.closeButton = new Button({
        label: this.config.closeText || 'Close',
        width: width / 4,
        height: 60,
        onClick: this.closeWindow,
        color: this.config.colorFront,
        labelStyle: {fill: this.config.colorBack},
      });

      this.addChild(this.closeButton);

      this.closeButton.y = height - this.closeButton.height - 20;
      this.closeButton.x = width / 20 * 2 + width / 4;
    }
  }

  public closeWindow = () => {
    this.animating = true;
    this.tween = new JMTween(this.scale, 300).to({x: 0, y: 0}).easing(JMEasing.Back.In).start().onComplete(() => {
      this.tween = null;
      this.animating = false;
      this.destroy();
      this.onClose && this.onClose();
    });
  }
}
