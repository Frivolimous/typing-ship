import * as PIXI from 'pixi.js';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { CONFIG } from '../Config';
import { MuterOverlay } from '../ui/MuterOverlay';
import { ILevelInstance } from '../data/LevelInstance';
import { SaveData } from '../utils/SaveData';
import { IResizeEvent } from '../JMGE/events/JMInteractionEvents';
import { Button } from '../ui/buttons/Button';

export class LossUI extends BaseUI {
  private title: PIXI.Text;
  private muter: MuterOverlay;

  constructor(instance: ILevelInstance) {
    super({bgColor: 0x666666});

    this.title = new PIXI.Text('LossUI', { fontSize: 30, fill: 0x3333ff });
    this.addChild(this.title);

    let extrinsic = SaveData.getExtrinsic();
    let currentLevel = extrinsic.data.levels[instance.level] || {};

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

    let _button = new Button({ width: 100, height: 30, label: 'Menu', onClick: this.navMenu });
    _button.position.set(CONFIG.INIT.SCREEN_WIDTH - 150, CONFIG.INIT.SCREEN_HEIGHT - 100);
    this.addChild(_button);

    this.muter = new MuterOverlay();
    this.addChild(this.muter);
  }

  protected positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
    this.muter.x = e.outerBounds.right - this.muter.getWidth();
    this.muter.y = e.outerBounds.bottom - this.muter.getHeight();
  }

  private navMenu = () => {
    this.navBack();
  }
}
