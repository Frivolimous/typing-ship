import * as PIXI from 'pixi.js';
import { TextureData } from '../../utils/TextureData';
import { BadgeState } from '../../data/PlayerData';
import { ITooltip } from '../../JMGE/TooltipReader';
import { Colors } from '../../data/Colors';
import { Fonts } from '../../data/Fonts';

export class BadgeLine extends PIXI.Container {
  public symbol: PIXI.Sprite;
  constructor(public tooltipConfig: ITooltip, state: BadgeState = BadgeState.NONE) {
    super();
    let graphic = new PIXI.Graphics();
    graphic.beginFill(0xaaaaaa).drawRoundedRect(0, 0, 250, 50, 10);
    this.addChild(graphic);
    let label = new PIXI.Text(tooltipConfig.title, {fontFamily: Fonts.UI});
    this.addChild(label);
    label.x = 30;
    label.y = (50 - label.height) / 2;
    this.symbol = new PIXI.Sprite(TextureData.cache.getTexture('medal'));
    this.symbol.x = 5;
    this.symbol.y = (50 - this.symbol.height) / 2;
    this.addChild(this.symbol);
    this.setState(state);
    this.interactive = true;
  }

  public getHeight = () => 50;
  public getWidth = () => 250;

  public setState(state: BadgeState) {
    let color: number;
    switch (state) {
      case BadgeState.NONE: color = 0; break;
      case BadgeState.BRONZE: color = Colors.BRONZE; break;
      case BadgeState.SILVER: color = Colors.SILVER; break;
      case BadgeState.GOLD: color = Colors.GOLD; break;
    }
    this.symbol.tint = color;
  }
}
