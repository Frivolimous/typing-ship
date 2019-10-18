import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMGE/JMBUI';
import { TextureData } from '../utils/TextureData';
import { BadgeState } from '../data/PlayerData';
import { ITooltip } from '../JMGE/TooltipReader';
import { Colors } from '../data/Colors';

export class BadgeLine extends JMBUI.BasicElement {
  public symbol: PIXI.Sprite;
  constructor(public tooltipConfig: ITooltip, state: BadgeState = BadgeState.NONE) {
    super({ width: 100, height: 50, label: tooltipConfig.title });
    this.symbol = new PIXI.Sprite(TextureData.cache.getTexture('medal'));
    this.label.x = 30;
    this.addChild(this.symbol);
    this.setState(state);
    this.interactive = true;
  }

  public setState(state: BadgeState) {
    let color: number;
    switch(state) { 
      case BadgeState.NONE: color = 0; break;
      case BadgeState.BRONZE: color = Colors.BRONZE; break;
      case BadgeState.SILVER: color = Colors.SILVER; break;
      case BadgeState.GOLD: color = Colors.GOLD; break;
    }
    this.symbol.tint = color;
  }
}
