import * as JMBUI from '../JMGE/JMBUI';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { LevelSelectUI } from './LevelSelectUI';
import { CONFIG } from '../Config';
import { MuterOverlay } from './MuterOverlay';
import { ScreenCover } from '../JMGE/effects/ScreenCover';

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

    // let screen = new ScreenCover(new PIXI.Rectangle(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT))
    //   .fadeOut(2000);
    // this.addChild(screen);
  }

  public navMenu = () => {
    this.navBack();
  }
}
