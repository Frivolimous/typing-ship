import * as PIXI from 'pixi.js';
import { BaseUI, IFadeTiming } from '../JMGE/UI/BaseUI';
import { GameManager } from '../game/GameManager';
import { WinUI } from './WinUI';
import { LossUI } from './LossUI';
import { Gauge } from '../JMGE/JMBUI';
import { CONFIG } from '../Config';
import { GameEvents, IHealthEvent, IScoreEvent, IWordEvent, IProgressEvent, IPauseEvent } from '../utils/GameEvents';
import { TextObject } from '../game/text/TextObject';
import { FlyingText } from '../JMGE/effects/FlyingText';
import { ILevelInstance } from '../data/LevelInstance';
import { MuterOverlay } from '../ui/MuterOverlay';
import { PauseOverlay } from '../ui/PauseOverlay';
import { SoundData } from '../utils/SoundData';
import { IResizeEvent } from '../JMGE/events/JMInteractionEvents';

export class GameUI extends BaseUI {
  private manager: GameManager;
  private healthBar: Gauge;

  private pauseOverlay: PauseOverlay;
  private muter: MuterOverlay;
  private wordDisplay: PIXI.Text;
  private progress: PIXI.Text;
  private score: PIXI.Text;
  private overlay: PIXI.Graphics = new PIXI.Graphics();

  private fadeTiming: IFadeTiming = {
    color: 0xffffff,
    fadeIn: 2000,
    fadeOut: 500,
    delay: 3000,
    delayBlank: 1000,
  };

  constructor(level: number, difficulty: number) {
    super({bgColor: 0x333333});
    let background = new PIXI.Graphics();
    background.beginFill(0).drawRect(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT);
    this.addChild(background);

    this.manager = new GameManager(level, difficulty, this);

    requestAnimationFrame(() => this.addHealWord(this.manager.wordInput.healWord));
    this.addChild(this.manager.display);

    this.pauseOverlay = new PauseOverlay(new PIXI.Rectangle(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT));
    this.addChild(this.pauseOverlay);

    let UILayer = new PIXI.Graphics();
    UILayer.beginFill(0x002233);
    // UILayer.drawRect(0, CONFIG.INIT.SCREEN_HEIGHT - 120, CONFIG.INIT.SCREEN_WIDTH, 120);
    // UILayer.moveTo(0, CONFIG.INIT.SCREEN_HEIGHT - 120).lineTo()
    UILayer.drawPolygon([0, CONFIG.INIT.SCREEN_HEIGHT - 120,
                        CONFIG.INIT.SCREEN_WIDTH / 4, CONFIG.INIT.SCREEN_HEIGHT - 120,
                        CONFIG.INIT.SCREEN_WIDTH / 3, CONFIG.INIT.SCREEN_HEIGHT - 80,
                        CONFIG.INIT.SCREEN_WIDTH * 2 / 3, CONFIG.INIT.SCREEN_HEIGHT - 80,
                        CONFIG.INIT.SCREEN_WIDTH * 3 / 4, CONFIG.INIT.SCREEN_HEIGHT - 120,
                        CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT - 120,
                        CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT,
                        0, CONFIG.INIT.SCREEN_HEIGHT,
                      ]);
    this.addChild(UILayer);

    this.wordDisplay = new PIXI.Text('', { fontSize: 16, fontFamily: 'Arial', fill: 0xffaaaa, stroke: 0, strokeThickness: 2 });
    this.wordDisplay.y = CONFIG.INIT.SCREEN_HEIGHT - 50;
    this.addChild(this.wordDisplay);

    this.progress = new PIXI.Text('', { fontSize: 16, fontFamily: 'Arial', fill: 0xaaffaa, stroke: 0, strokeThickness: 2 });
    this.progress.y = CONFIG.INIT.SCREEN_HEIGHT - 100;
    this.progress.x = CONFIG.INIT.SCREEN_WIDTH - 100;
    this.addChild(this.progress);

    this.score = new PIXI.Text('0', { fontSize: 16, fontFamily: 'Arial', fill: 0xaaffaa, stroke: 0, strokeThickness: 2 });
    this.score.y = CONFIG.INIT.SCREEN_HEIGHT - 100;
    this.addChild(this.score);

    this.healthBar = new Gauge(0xff0000);
    this.healthBar.x = (CONFIG.INIT.SCREEN_WIDTH - this.healthBar.getWidth()) / 2;
    this.healthBar.y = CONFIG.INIT.SCREEN_HEIGHT - 50;
    this.addChild(this.healthBar);

    this.muter = new MuterOverlay(true);
    this.addChild(this.muter);

    this.addChild(this.overlay);

    GameEvents.NOTIFY_UPDATE_INPUT_WORD.addListener(this.updateText);
    GameEvents.NOTIFY_LETTER_DELETED.addListener(this.showMinusText);
    GameEvents.NOTIFY_SET_SCORE.addListener(this.setScore);
    GameEvents.NOTIFY_SET_PROGRESS.addListener(this.updateProgress);
    GameEvents.NOTIFY_SET_HEALTH.addListener(this.setPlayerHealth);
    GameEvents.REQUEST_PAUSE_GAME.addListener(this.pauseGame);

    SoundData.playMusicForLevel(level);
  }

  public navOut = () => {
    this.manager.running = false;
  }

  public dispose = () => {
    GameEvents.NOTIFY_UPDATE_INPUT_WORD.removeListener(this.updateText);
    GameEvents.NOTIFY_LETTER_DELETED.removeListener(this.showMinusText);
    GameEvents.NOTIFY_SET_SCORE.removeListener(this.setScore);
    GameEvents.NOTIFY_SET_PROGRESS.removeListener(this.updateProgress);
    GameEvents.NOTIFY_SET_HEALTH.removeListener(this.setPlayerHealth);
    GameEvents.REQUEST_PAUSE_GAME.removeListener(this.pauseGame);
    this.manager.dispose();
    this.muter.dispose();
    super.dispose();
  }

  public navWin = (instance: ILevelInstance) => {
    this.navForward(new WinUI(instance), this.previousUI, this.fadeTiming);
  }

  public navLoss = (instance: ILevelInstance) => {
    this.navForward(new LossUI(instance), this.previousUI, this.fadeTiming);
  }

  protected positionElements = (e: IResizeEvent) => {
    this.muter.x = e.innerBounds.right - this.muter.getWidth();
    this.muter.y = e.innerBounds.bottom - this.muter.getHeight();
    this.overlay.clear();
    this.overlay.beginFill(0x333333);
    this.overlay.drawRect(e.outerBounds.x, e.outerBounds.y, e.innerBounds.x - e.outerBounds.x, e.outerBounds.height);
    this.overlay.drawRect(e.innerBounds.right, e.outerBounds.y, e.outerBounds.right - e.innerBounds.right, e.outerBounds.height);
    this.overlay.drawRect(e.outerBounds.x, e.outerBounds.y, e.outerBounds.width, e.innerBounds.y - e.outerBounds.y);
    this.overlay.drawRect(e.outerBounds.x, e.innerBounds.bottom, e.outerBounds.width, e.outerBounds.bottom - e.innerBounds.bottom);
  }

  private updateProgress = (e: IProgressEvent) => {
    let progress = Math.min(100, Math.round(e.current / e.total * 100));
    this.progress.text = String(progress) + '%';
  }

  private updateText = (e: IWordEvent) => {
    this.wordDisplay.text = e.word;
  }

  private showMinusText = () => {
    new FlyingText('-1', { fontFamily: 'Arial', fontSize: 14, fill: 0xff0000 }, this.wordDisplay.x + this.wordDisplay.width, this.wordDisplay.y, this);
  }

  private setScore = (e: IScoreEvent) => {
    this.score.text = String(e.newScore);
  }

  private setPlayerHealth = (e: IHealthEvent) => {
    this.healthBar.setValue(e.newHealth, CONFIG.GAME.playerHealth);
  }

  private addHealWord = (healWord: TextObject) => {
    this.addChild(healWord);
    healWord.x = this.healthBar.x + this.healthBar.getWidth();
    healWord.y = this.healthBar.y + this.healthBar.getHeight();
  }

  private pauseGame = (e: IPauseEvent) => {
    this.pauseOverlay.changeState(e.paused);
  }
}
