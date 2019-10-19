import * as PIXI from 'pixi.js';
import { CONFIG } from '../Config';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { GameUI } from './GameUI';
import { DifficultyPopup } from '../ui/DifficultyPopup';
import { SaveData } from '../utils/SaveData';
import { LevelButton } from '../ui/buttons/LevelButton';
import { MuterOverlay } from '../ui/MuterOverlay';
import { SoundData } from '../utils/SoundData';
import { TypingTestUI } from './TypingTestUI';
import { StringData } from '../data/StringData';
import { Colors } from '../data/Colors';
import { TooltipReader } from '../JMGE/TooltipReader';
import { IResizeEvent } from '../JMGE/events/JMInteractionEvents';
import { Button } from '../ui/buttons/Button';
import { BasicElement } from '../ui/BasicElement';

export class LevelSelectUI extends BaseUI {
  public currentLevel: number = 0;
  public currentDifficulty: number = 1;

  public NUMSHOWN: number = 3;
  public C_SHOWN: number = 0;
  public nextB: Button;
  public prevB: Button;
  public difficultyPopup: DifficultyPopup;
  public muter: MuterOverlay;

  public levelButtons: LevelButton[] = [];
  private typingTestButton: Button;
  private wpmText: PIXI.Text;
  private recommendedSuper: PIXI.Text;
  private recommended: BasicElement;

  constructor() {
    super({ bgColor: 0x666666 });

    let _button: Button = new Button({ width: 100, height: 30, label: 'Menu', onClick: this.leave });
    _button.x = 20;
    _button.y = CONFIG.INIT.SCREEN_HEIGHT - 50;
    this.addChild(_button);

    _button = new Button({ width: 100, height: 30, label: 'Typing Test', onClick: this.navTypingTest });
    _button.x = 20;
    _button.y = CONFIG.INIT.SCREEN_HEIGHT - 100;
    this.addChild(_button);
    this.typingTestButton = _button;

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

    _button = new Button({ width: 100, height: 30, label: 'TEST LEVEL', onClick: () => (this.currentLevel = -2, this.startGame()) });
    _button.x = 20;
    _button.y = CONFIG.INIT.SCREEN_HEIGHT - 150;
    this.addChild(_button);

    this.muter = new MuterOverlay();
    this.addChild(this.muter);
  }

  public navIn = () => {
    this.resetLevelStuff();
    this.muter.reset();
    SoundData.playMusic(0);
  }

  protected positionElements = (e: IResizeEvent) => {
    this.muter.x = e.outerBounds.right - this.muter.getWidth();
    this.muter.y = e.outerBounds.bottom - this.muter.getHeight();
  }

  private resetLevelStuff = () => {
    let extrinsics = SaveData.getExtrinsic();
    let wpm = extrinsics.data.wpm;
    let recommended = extrinsics.data.recommended;
    this.levelButtons.forEach((button, i) => button.updateFromData(extrinsics.data.levels[i]));

    if (wpm) {
      this.typingTestButton.highlight(false);
      TooltipReader.addTooltip(this.typingTestButton, null);
    } else {
      this.typingTestButton.highlight(true);
      TooltipReader.addTooltip(this.typingTestButton, {title: StringData.TYPING_TEST_TITLE, description: StringData.TYPING_TEST_DESC});
    }

    if (this.recommended) {
      this.recommended.destroy();
    }

    if (recommended) {
      this.recommended = new BasicElement({label: StringData.DIFFICULTY[recommended], color: Colors.DIFFICULTY[recommended], width: 100, height: 30});
      this.recommended.x = this.typingTestButton.x + this.typingTestButton.getWidth() + 10;
      this.recommended.y = this.typingTestButton.y;
      TooltipReader.addTooltip(this.recommended, {title: StringData.RECOMMENDED_TITLE, description: StringData.RECOMMENDED_DESC});
      this.addChild(this.recommended);
      if (!this.wpmText) {
        this.wpmText = new PIXI.Text('');
        this.wpmText.position.set(this.typingTestButton.x + this.typingTestButton.getWidth() + 10, this.typingTestButton.y);
        TooltipReader.addTooltip(this.wpmText, {title: StringData.RECOMMENDED_TITLE, description: StringData.RECOMMENDED_DESC});
        this.addChild(this.wpmText);
      }
      this.wpmText.text = 'WPM:' + String(Math.round(wpm));
      this.recommended.x = this.wpmText.x + this.wpmText.width + 5;
      if (!this.recommendedSuper) {
        this.recommendedSuper = new PIXI.Text('Recommended:', {fontSize: 14});
        this.addChild(this.recommendedSuper);
      }
      this.recommendedSuper.position.set(this.recommended.x + (this.recommended.getWidth() - this.recommendedSuper.width) / 2, this.recommended.y - this.recommendedSuper.height - 3);
    }
  }

  private changeLevelAndStartGame = (level: number, button: LevelButton) => {
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

  private changeDifficultyAndStartGame = (difficulty: number) => {
    this.currentDifficulty = difficulty;
    this.startGame();
  }

  private startGame = () => {
    console.log(this.currentDifficulty);
    this.navForward(new GameUI(this.currentLevel, this.currentDifficulty));
    if (this.difficultyPopup) {
      this.difficultyPopup.destroy();
      this.difficultyPopup = null;
    }
  }

  private leave = () => {
    this.navBack();
  }

  private navTypingTest = () => {
    this.navForward(new TypingTestUI());
  }
}
