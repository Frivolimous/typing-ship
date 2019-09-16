import { ObjectManager, DisplayLayer } from './engine/ObjectManager';
import { Starfield } from '../JMGE/effects/Starfield';
import { CONFIG } from '../Config';
import { EnemyShip } from './objects/EnemyShip';
import { BossShip } from './objects/BossShip';
import { BossShip0 } from './objects/BossShip0';
import { BossShip1 } from './objects/BossShip1';
import * as PIXI from 'pixi.js';
import { BossShip2 } from './objects/BossShip2';
import { PlayerShip } from './objects/PlayerShip';
import { EventInterpreter } from './engine/EventInterpreter';
import { ActionControl } from './engine/ActionControl';
import { ISpawnEvent } from '../data/LevelData';
import { WordInput } from './engine/WordInput';
import { TextObject } from './text/TextObject';
import { GameEvents, IPauseEvent, IDeleteEvent, ILetterEvent, IHealthEvent } from './engine/GameEvents';
import { JMInteractionEvents, IKeyboardEvent } from '../JMGE/events/JMInteractionEvents';
import { ILevelInstance } from '../data/LevelInstance';
import { GameUI } from '../screens/GameUI';
import { GameSprite } from './objects/GameSprite';
import { SoundData } from '../utils/SoundData';

export class GameManager {
  public running = true;
  public interactive = true;

  public display = new  PIXI.Container();
  public container: ObjectManager = new ObjectManager();

  public actionC: ActionControl = new ActionControl(this);
  public starfield: Starfield;
  public player: PlayerShip = new PlayerShip();
  public wordInput = new WordInput();
  public levelEvents: EventInterpreter;

  public levelInstance: ILevelInstance;
  // distanceRate:number=.0002;

  constructor(level: number = 0, difficulty: number = 1, private ui: GameUI) {
    let gameSpeed = difficulty * 0.5;

    this.starfield = new Starfield(CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT);

    this.actionC.missileRate = 0.4;

    this.levelEvents = new EventInterpreter(this.addEnemy, this.addBoss);
    this.levelEvents.loadLevel(level, gameSpeed);

    this.levelInstance = {
      level,
      difficulty,
      score: 0,
      gameSpeed,
      levelEnded: false,

      enemiesKilled: 0,
      totalEnemies: this.levelEvents.getTotalEnemies(),

      lettersTyped: 0,
      lettersDeleted: 0,

      playerHealth: CONFIG.GAME.playerHealth,
      healthLost: false,
    };
    // console.log('total enemies', this.levelInstance.totalEnemies);
    // console.log('game speed', gameSpeed, difficulty);

    this.player.x = (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 2;
    this.player.y = CONFIG.INIT.SCREEN_HEIGHT - 120;
    this.player.setHealth(CONFIG.GAME.playerHealth);
    this.setScore(0);

    this.display.addChild(this.starfield, this.container);
    this.container.addObject(this.player, DisplayLayer.DEFAULT);

    GameEvents.ticker.add(this.onTick);
    JMInteractionEvents.KEY_DOWN.addListener(this.keyDown);
    GameEvents.NOTIFY_LETTER_DELETED.addListener(this.onLetterDelete);

    GameEvents.REQUEST_HEAL_PLAYER.addListener(this.player.addHealth);
    GameEvents.REQUEST_PAUSE_GAME.addListener(this.togglePause);
    GameEvents.NOTIFY_LETTER_ADDED.addListener(this.onLetterAdded);
    GameEvents.NOTIFY_SET_HEALTH.addListener(this.onHealthChange);
  }

  public dispose = () => {
    console.log('dispose');
    GameEvents.ticker.remove(this.onTick);
    JMInteractionEvents.KEY_DOWN.removeListener(this.keyDown);
    GameEvents.NOTIFY_LETTER_DELETED.removeListener(this.onLetterDelete);

    GameEvents.REQUEST_HEAL_PLAYER.removeListener(this.player.addHealth);
    GameEvents.REQUEST_PAUSE_GAME.removeListener(this.togglePause);
    GameEvents.NOTIFY_LETTER_ADDED.removeListener(this.onLetterAdded);
    GameEvents.NOTIFY_SET_HEALTH.removeListener(this.onHealthChange);

    this.container.dispose();
    this.wordInput.dispose();
    this.display.destroy();
  }

  public keyDown = (e: IKeyboardEvent) => {
    if (!this.running || !this.interactive) {
      if (e.key === ' ') {
        GameEvents.REQUEST_PAUSE_GAME.publish({paused: false});
      }
      return;
    }
    switch (e.key) {
      case 'Escape': this.ui.navBack(); break;
      case ' ': GameEvents.REQUEST_PAUSE_GAME.publish({paused: true}); break;
      case 'Backspace': this.wordInput.deleteLetters(1); break;
      default: this.wordInput.addLetter(e.key); break;
    }
  }

  public onTick = (ms: number) => {
    if (!this.running) return;

    this.starfield.update(this.levelInstance.gameSpeed);
    this.container.updateAll(this.levelInstance.gameSpeed);

    if (this.levelEvents.isComplete()) {
      this.endLevel();
    } else {
      this.levelEvents.addDistance(this.levelInstance.gameSpeed, ms);
    }

    GameEvents.NOTIFY_SET_PROGRESS.publish({ current: this.levelEvents.distance, total: this.levelEvents.finalDistance });

    if (!this.interactive) return;
    if (this.player.health <= 0 && !CONFIG.GAME.godmode) {
      this.killPlayer();
    }
  }

  public killPlayer = () => {
    if (this.interactive) {
      console.log('dead');
      this.interactive = false;
      this.container.makeExplosionAt(this.player.x, this.player.y, 50);
      this.player.visible = false;
      this.ui.navLoss(this.levelInstance);
    }
  }

  public endLevel = () => {
    if (!this.levelInstance.levelEnded) {
      if (this.container.numObjects() <= 1) {
        this.levelInstance.levelEnded = true;
        this.ui.navWin(this.levelInstance);
      }
    }
  }

  public togglePause = (e: IPauseEvent) => {
    if (!this.interactive) return;
    this.running = !e.paused;
    TextObject.allTextObjects.forEach(object => object.visible = this.running);
  }

  public onLetterDelete = (e: IDeleteEvent) => {
    this.levelInstance.lettersDeleted++;
    this.addScore(-e.numDeleted);
  }

  public onHealthChange = (e: IHealthEvent) => {
    this.levelInstance.playerHealth = e.newHealth;
    if (e.oldHealth > e.newHealth) {
      this.levelInstance.healthLost = true;
    }
  }

  public onLetterAdded = (e: ILetterEvent) => {
    this.levelInstance.lettersTyped++;
  }

  public setScore = (score: number) => {
    let oldScore = this.levelInstance.score;
    this.levelInstance.score = score;
    GameEvents.NOTIFY_SET_SCORE.publish({oldScore, newScore: this.levelInstance.score});
  }

  public enemyDestroyed = (enemy: GameSprite) => {
    if (enemy instanceof EnemyShip) {
      this.levelInstance.enemiesKilled++;
      console.log('enemy killed', this.levelInstance.enemiesKilled);
    } else {
      console.log('not enemy');
    }
    this.addScore(enemy.value);
  }

  public addScore = (add: number) => {
    let oldScore = this.levelInstance.score;
    this.levelInstance.score += add;
    GameEvents.NOTIFY_SET_SCORE.publish({oldScore, newScore: this.levelInstance.score});
  }

  public addEnemy = (spawnEvent: ISpawnEvent): EnemyShip => {
    spawnEvent.x *= (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 12;
    spawnEvent.y *= (CONFIG.INIT.SCREEN_HEIGHT + CONFIG.INIT.STAGE_BUFFER) / 12;
    spawnEvent.commands.forEach(command => {
      command.x *= (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 12;
      command.y *= (CONFIG.INIT.SCREEN_HEIGHT + CONFIG.INIT.STAGE_BUFFER) / 12;
      command.timer *= 6;
    });
    let newShip = new EnemyShip(spawnEvent, {
      onFire: enemy => this.actionC.enemyFires(this.player, enemy),
      onWordComplete: enemy => this.actionC.playerFires(this.player, enemy),
      onTurretWordComplete: turret => this.actionC.playerFires(this.player, turret),
    });

    this.container.addObject(newShip, DisplayLayer.ENEMIES);
    return newShip;
  }

  public addBoss = (bossType: number): BossShip => {
    let boss;
    switch (bossType) {
      case 0: boss = new BossShip0(bossType, this); break;
      case 1: boss = new BossShip1(bossType, this); break;
      case 2: boss = new BossShip2(bossType, this); break;
    }
    this.container.addObject(boss, DisplayLayer.DEFAULT);
    return boss;
  }
}
