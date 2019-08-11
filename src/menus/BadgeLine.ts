import * as JMBUI from '../JMGE/JMBUI';
import { TextureData } from '../TextureData';
import { BadgeState } from '../game/data/PlayerData';

export class BadgeLine extends JMBUI.BasicElement {
  public symbol: PIXI.Sprite;
  constructor(label: string = 'Hello World!', state: BadgeState = BadgeState.NONE) {
    super({ width: 100, height: 50, label });
    this.symbol = new PIXI.Sprite(TextureData.medal);
    // this.symbol.anchor.set(0.5,0.5);
    // this.symbol.x=-15;
    // this.symbol.y=this.getHeight()/2;
    this.label.x = 30;
    this.addChild(this.symbol);
    this.setState(state);
  }

  public setState(state: BadgeState) {
    this.symbol.tint = state;
  }
}
