import * as JMBUI from '../JMGE/JMBUI';
import { CONFIG } from '../Config';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { GameUI } from './GameUI';
import { DifficultyPopup } from '../ui/DifficultyPopup';

export class LevelSelectUI extends BaseUI {
  public currentLevel: number = 0;
  public currentDifficulty: number = 1;
  public NUMSHOWN: number = 3;
  public C_SHOWN: number = 0;
  public nextB: JMBUI.Button;
  public prevB: JMBUI.Button;
  public difficultyPopup: DifficultyPopup;

  constructor() {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666 });

    let _button: JMBUI.Button = new JMBUI.Button({ width: 100, height: 30, x: 20, y: CONFIG.INIT.SCREEN_HEIGHT - 50, label: 'Menu', output: this.leave });
    this.addChild(_button);
    _button = new JMBUI.Button({ width: 100, height: 30, x: CONFIG.INIT.SCREEN_WIDTH - 120, y: CONFIG.INIT.SCREEN_HEIGHT - 50, label: 'Start', output: this.startGame });
    this.addChild(_button);
    for (let i = 0; i < 12; i++) {
      this.makeLevelButton(i, 5 + Math.floor(i / 6) * 60, 20 + (i % 6) * 40);
    }
  }

  public makeLevelButton(i: number, x: number, y: number) {
    let _button: JMBUI.Button = new JMBUI.Button({ width: 50, height: 30, x, y, label: 'Level ' + i, output: () => this.changeLevelAndStartGame(i, _button) });
    this.addChild(_button);
  }

  public changeLevelAndStartGame = (level: number, button: PIXI.Container) => {
    this.currentLevel = level;
    if (this.difficultyPopup) {
      this.difficultyPopup.destroy();
    }
    this.difficultyPopup = new DifficultyPopup(100, this.changeDifficultyAndStartGame);
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
}
