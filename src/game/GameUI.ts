import { CONFIG } from '../Config';
import * as JMBL from '../JMGE/JMBL';
import { FlyingText } from '../JMGE/effects/FlyingText';
import { Gauge } from '../JMGE/JMBUI';
import { TextObject } from './text/TextObject';
import { GameEvents, IProgressEvent, IWordEvent, IScoreEvent, IHealthEvent } from './engine/GameEvents';

export class GameUI extends PIXI.Container {
  public healthBar: Gauge;

  private wordDisplay: PIXI.Text;
  private progress: PIXI.Text;
  private score: PIXI.Text;

  constructor() {
    super();
    this.wordDisplay = new PIXI.Text('', { fontSize: 16, fontFamily: 'Arial', fill: 0xffaaaa, stroke: 0, strokeThickness: 2 });
    this.addChild(this.wordDisplay);
    this.wordDisplay.y = CONFIG.INIT.SCREEN_HEIGHT - 50;

    this.progress = new PIXI.Text('', { fontSize: 16, fontFamily: 'Arial', fill: 0xaaffaa, stroke: 0, strokeThickness: 2 });
    this.addChild(this.progress);
    this.progress.y = CONFIG.INIT.SCREEN_HEIGHT - 50;
    this.progress.x = CONFIG.INIT.SCREEN_WIDTH - 100;

    this.score = new PIXI.Text('0', { fontSize: 16, fontFamily: 'Arial', fill: 0xaaffaa, stroke: 0, strokeThickness: 2 });
    this.score.y = CONFIG.INIT.SCREEN_HEIGHT - 100;
    this.addChild(this.score);

    this.healthBar = new Gauge(0xff0000);
    this.healthBar.x = (CONFIG.INIT.SCREEN_WIDTH - this.healthBar.getWidth()) / 2;
    this.healthBar.y = CONFIG.INIT.SCREEN_HEIGHT - 50;
    this.addChild(this.healthBar);

    GameEvents.ticker.add(this.update);
    GameEvents.NOTIFY_UPDATE_INPUT_WORD.addListener(this.updateText);
    GameEvents.NOTIFY_LETTER_DELETED.addListener(this.showMinusText);
    GameEvents.NOTIFY_SET_SCORE.addListener(this.setScore);
    GameEvents.NOTIFY_SET_PROGRESS.addListener(this.updateProgress);
    GameEvents.NOTIFY_SET_HEALTH.addListener(this.setPlayerHealth);
  }

  public dispose() {
    GameEvents.ticker.remove(this.update);
    GameEvents.NOTIFY_UPDATE_INPUT_WORD.removeListener(this.updateText);
    GameEvents.NOTIFY_LETTER_DELETED.removeListener(this.showMinusText);
    GameEvents.NOTIFY_SET_SCORE.removeListener(this.setScore);
    GameEvents.NOTIFY_SET_PROGRESS.removeListener(this.updateProgress);
    GameEvents.NOTIFY_SET_HEALTH.removeListener(this.setPlayerHealth);
    this.destroy();
  }

  public update = () => {

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
