import * as JMBUI from '../JMGE/JMBUI';
import { CONFIG } from '../Config';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { GameUI } from './GameUI';
import { DifficultyPopup } from '../ui/DifficultyPopup';
import { SaveData } from '../utils/SaveData';
import { LevelButton } from '../ui/LevelButton';
import { MuterOverlay } from '../ui/MuterOverlay';
import { SoundData } from '../utils/SoundData';

export class LevelSelectUI extends BaseUI {
  public currentLevel: number = 0;
  public currentDifficulty: number = 1;

  public NUMSHOWN: number = 3;
  public C_SHOWN: number = 0;
  public nextB: JMBUI.Button;
  public prevB: JMBUI.Button;
  public difficultyPopup: DifficultyPopup;
  public muter: MuterOverlay;

  public levelButtons: LevelButton[] = [];

  constructor() {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666 });

    let _button: JMBUI.Button = new JMBUI.Button({ width: 100, height: 30, x: 20, y: CONFIG.INIT.SCREEN_HEIGHT - 50, label: 'Menu', output: this.leave });
    this.addChild(_button);

    for (let i = 0; i < 12; i++) {
      let button: LevelButton = new LevelButton(i, () => this.changeLevelAndStartGame(i, button));
      button.position.set(5 + Math.floor(i / 6) * 130, 20 + (i % 6) * 40);
      this.levelButtons.push(button);
      this.addChild(button);
    }
    this.interactive = true;
    this.addListener('mousedown', e => {
      if (e.target === this) {
        if (this.difficultyPopup) {
          this.difficultyPopup.destroy();
        }
      }
    });

    this.muter = new MuterOverlay();
    this.muter.x = this.getWidth() - this.muter.getWidth();
    this.muter.y = this.getHeight() - this.muter.getHeight();
    this.addChild(this.muter);
  }

  public resetLevelStuff = () => {
    let extrinsics = SaveData.getExtrinsic();

    this.levelButtons.forEach((button, i) => button.updateFromData(extrinsics.data.levels[i]));
  }

  public changeLevelAndStartGame = (level: number, button: LevelButton) => {
    console.log(level);
    this.currentLevel = level;
    if (this.difficultyPopup) {
      this.difficultyPopup.destroy();
    }
    this.difficultyPopup = new DifficultyPopup(button.data.score, this.changeDifficultyAndStartGame);
    this.difficultyPopup.x = button.x + 50;
    this.difficultyPopup.y = button.y + 30;
    this.addChild(this.difficultyPopup);
    // this.startGame();
  }

  public changeDifficultyAndStartGame = (difficulty: number) => {
    this.currentDifficulty = difficulty;
    this.startGame();
  }

  public startGame = () => {
    console.log(this.currentDifficulty);
    this.navForward(new GameUI(this.currentLevel, this.currentDifficulty));
    if (this.difficultyPopup) {
      this.difficultyPopup.destroy();
      this.difficultyPopup = null;
    }
  }

  public leave = () => {
    this.navBack();
  }

  public navIn = () => {
    this.resetLevelStuff();
    this.muter.reset();
    SoundData.playMusic(0);
  }
}
