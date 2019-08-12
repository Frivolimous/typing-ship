import * as JMBUI from '../JMGE/JMBUI';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { LevelSelectUI } from './LevelSelectUI';
import { CONFIG } from '../Config';
import { BadgesUI } from './BadgesUI';
import { MuterOverlay } from './MuterOverlay';
// import { GameManager } from '../TDDR/GameManager';
// import { facade };

export class MenuUI extends BaseUI {
  constructor() {
    super({ width: CONFIG.INIT.STAGE_WIDTH, height: CONFIG.INIT.STAGE_HEIGHT, bgColor: 0x666666, label: 'Millenium\nTyper', labelStyle: { fontSize: 30, fill: 0x3333ff } });
    this.label.x += 50;
    let _button: JMBUI.Button = new JMBUI.Button({ width: 100, height: 30, x: 200, y: 200, label: 'Start', output: this.startGame });
    this.addChild(_button);
    _button = new JMBUI.Button({ width: 100, height: 30, x: 200, y: 240, label: 'High Score', output: this.nullFunc });
    this.addChild(_button);
    _button = new JMBUI.Button({ width: 100, height: 30, x: 200, y: 280, label: 'View Badges', output: this.navBadges });
    this.addChild(_button);
    _button = new JMBUI.Button({ width: 100, height: 30, x: 200, y: 320, label: 'More Games', output: this.nullFunc });
    this.addChild(_button);
    _button = new JMBUI.Button({ width: 100, height: 30, x: 200, y: 360, label: 'Credits', output: this.nullFunc });
    this.addChild(_button);

    let muter = new MuterOverlay();
    muter.x = this.getWidth() - muter.getWidth();
    muter.y = this.getHeight() - muter.getHeight();
    this.addChild(muter);
  }

  public nullFunc = () => { };

  public startGame = () => {
    this.navForward(new LevelSelectUI());
    // this.navForward(new GameManager());
  }

  public navBadges = () => {
    this.navForward(new BadgesUI());
  }
}
