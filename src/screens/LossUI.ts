import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMGE/JMBUI';

import { BaseUI } from '../JMGE/UI/BaseUI';
import { CONFIG } from '../Config';
import { MuterOverlay } from '../ui/MuterOverlay';
import { ILevelInstance } from '../data/LevelInstance';
import { SaveData } from '../utils/SaveData';

const LABEL = 'LossUI';
export class LossUI extends BaseUI {
  constructor(instance: ILevelInstance) {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666, label: LABEL, labelStyle: { fontSize: 30, fill: 0x3333ff } });

    let extrinsic = SaveData.getExtrinsic();
    let currentLevel = extrinsic.data.levels[instance.level];

    let highScore = currentLevel.score;
    let newScore = instance.score;

    let s = 'You Lost :(\n\nYour score: ' + newScore + '\n';
    if (newScore > highScore) {
      s += 'Congratulations!  This is a new high score!';
      currentLevel.score = newScore;
      SaveData.saveExtrinsic();
    } else {
      s += 'Highscore: ' + highScore;
    }

    let text = new PIXI.Text(s);
    this.addChild(text);
    text.position.set(50, 50);

    let _button = new JMBUI.Button({ width: 100, height: 30, x: CONFIG.INIT.SCREEN_WIDTH - 150, y: CONFIG.INIT.SCREEN_HEIGHT - 100, label: 'Menu', output: this.navMenu });
    this.addChild(_button);

    let muter = new MuterOverlay();
    muter.x = this.getWidth() - muter.getWidth();
    muter.y = this.getHeight() - muter.getHeight();
    this.addChild(muter);
  }

  public navMenu = () => {
    this.navBack();
  }
}
