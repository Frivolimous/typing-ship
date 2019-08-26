import { BaseUI } from '../JMGE/UI/BaseUI';
import { GameManager } from '../game/GameManager';
import { WinUI } from './WinUI';
import { LossUI } from './LossUI';
import { Gauge } from '../JMGE/JMBUI';
import { CONFIG } from '../Config';
import { GameEvents, IHealthEvent, IScoreEvent, IWordEvent, IProgressEvent } from '../game/engine/GameEvents';
import { TextObject } from '../game/text/TextObject';
import { FlyingText } from '../JMGE/effects/FlyingText';
import { TutorialManager } from '../game/engine/TutorialManager';
import { AchievementManager } from '../game/engine/AchievementManager';

export class GameUI extends BaseUI {
  private manager: GameManager;
  private tutorials: TutorialManager = new TutorialManager(this);
  private achievements: AchievementManager = new AchievementManager(this);

  private healthBar: Gauge;

  private wordDisplay: PIXI.Text;
  private progress: PIXI.Text;
  private score: PIXI.Text;

  constructor(level: number, difficulty: number) {
    super();

    this.manager = new GameManager(level, difficulty, this);

    requestAnimationFrame(() => this.addHealWord(this.manager.wordInput.healWord));
    this.addChild(this.manager.display);

    this.wordDisplay = new PIXI.Text('', { fontSize: 16, fontFamily: 'Arial', fill: 0xffaaaa, stroke: 0, strokeThickness: 2 });
    this.wordDisplay.y = CONFIG.INIT.SCREEN_HEIGHT - 50;
    this.addChild(this.wordDisplay);

    this.progress = new PIXI.Text('', { fontSize: 16, fontFamily: 'Arial', fill: 0xaaffaa, stroke: 0, strokeThickness: 2 });
    this.progress.y = CONFIG.INIT.SCREEN_HEIGHT - 50;
    this.progress.x = CONFIG.INIT.SCREEN_WIDTH - 100;
    this.addChild(this.progress);

    this.score = new PIXI.Text('0', { fontSize: 16, fontFamily: 'Arial', fill: 0xaaffaa, stroke: 0, strokeThickness: 2 });
    this.score.y = CONFIG.INIT.SCREEN_HEIGHT - 100;
    this.addChild(this.score);

    this.healthBar = new Gauge(0xff0000);
    this.healthBar.x = (CONFIG.INIT.SCREEN_WIDTH - this.healthBar.getWidth()) / 2;
    this.healthBar.y = CONFIG.INIT.SCREEN_HEIGHT - 50;
    this.addChild(this.healthBar);

    GameEvents.NOTIFY_UPDATE_INPUT_WORD.addListener(this.updateText);
    GameEvents.NOTIFY_LETTER_DELETED.addListener(this.showMinusText);
    GameEvents.NOTIFY_SET_SCORE.addListener(this.setScore);
    GameEvents.NOTIFY_SET_PROGRESS.addListener(this.updateProgress);
    GameEvents.NOTIFY_SET_HEALTH.addListener(this.setPlayerHealth);
  }

  public navWin = () => {
    this.navForward(new WinUI(), this.previousUI);
  }

  public navLoss = () => {
    this.navForward(new LossUI(), this.previousUI);
  }

  public dispose = () => {
    this.manager.dispose();

    // GameEvents.NOTIFY_UPDATE_INPUT_WORD.removeListener(this.updateText);
    // GameEvents.NOTIFY_LETTER_DELETED.removeListener(this.showMinusText);
    // GameEvents.NOTIFY_SET_SCORE.removeListener(this.setScore);
    // GameEvents.NOTIFY_SET_PROGRESS.removeListener(this.updateProgress);
    // GameEvents.NOTIFY_SET_HEALTH.removeListener(this.setPlayerHealth);

    GameEvents.clearAll();

    this.destroy();
  }

  public updateProgress = (e: IProgressEvent) => {
    let progress = Math.min(100, Math.round(e.current / e.total * 100));
    this.progress.text = String(progress) + '%';
  }

  public updateText = (e: IWordEvent) => {
    this.wordDisplay.text = e.word;
  }

  public showMinusText = () => {
    new FlyingText('-1', { fontFamily: 'Arial', fontSize: 14, fill: 0xff0000 }, this.wordDisplay.x + this.wordDisplay.width, this.wordDisplay.y, this);
  }

  public setScore = (e: IScoreEvent) => {
    this.score.text = String(e.newScore);
  }

  public setPlayerHealth = (e: IHealthEvent) => {
    this.healthBar.setValue(e.newHealth, 5);
  }

  public addHealWord = (healWord: TextObject) => {
    this.addChild(healWord);
    healWord.x = this.healthBar.x + this.healthBar.getWidth();
    healWord.y = this.healthBar.y + this.healthBar.getHeight();
  }
}
