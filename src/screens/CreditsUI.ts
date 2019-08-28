import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMGE/JMBUI';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { CONFIG } from '../Config';
import { MuterOverlay } from '../ui/MuterOverlay';

const LABEL = 'CreditsUI';
export class CreditsUI extends BaseUI {
  constructor() {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666, label: LABEL, labelStyle: { fontSize: 30, fill: 0x3333ff } });

    let _button = new JMBUI.Button({ width: 100, height: 30, x: CONFIG.INIT.SCREEN_WIDTH - 150, y: CONFIG.INIT.SCREEN_HEIGHT - 100, label: 'Menu', output: this.navMenu });
    this.addChild(_button);

    let muter = new MuterOverlay();
    muter.x = this.getWidth() - muter.getWidth();
    muter.y = this.getHeight() - muter.getHeight();
    this.addChild(muter);

    let s = `
      Programmer: Jeremy Moshe
      Artist: ???
      Music: Binyamin Bair-Moshe
      Sound Effects: Jeremy Moshe

      Special Thanks:
      Avi Kentridge
      A. Walker
      Sofia Moshe
      Damon Kentridge
      Kurosai
      and YOU!
    `;
    let text = new PIXI.Text(s);
    this.addChild(text);
    text.position.set(50, 50);
  }

  public navMenu = () => {
    this.navBack();
  }
}
