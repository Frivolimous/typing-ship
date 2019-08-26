import { ObjectManager, DisplayLayer } from '../game/engine/ObjectManager';
import { Starfield } from '../JMGE/effects/Starfield';
import { CONFIG } from '../Config';
import { EnemyShip } from '../game/objects/EnemyShip';
import { BossShip } from '../game/objects/BossShip';
import { BossShip0 } from '../game/objects/BossShip0';
import { BossShip1 } from '../game/objects/BossShip1';
import { BossShip2 } from '../game/objects/BossShip2';
import { PlayerShip } from '../game/objects/PlayerShip';
import { EventInterpreter } from '../game/engine/EventInterpreter';
import { ActionControl } from '../game/engine/ActionControl';
import { ISpawnEvent } from '../data/LevelData';
import { WordInput } from '../game/engine/WordInput';
import { TextObject } from '../game/text/TextObject';
import { ScreenCover } from '../JMGE/effects/ScreenCover';
import { GameEvents, IPauseEvent, IDeleteEvent } from '../game/engine/GameEvents';
import { JMInteractionEvents, IKeyboardEvent } from '../JMGE/events/JMInteractionEvents';
import { ILevelInstance } from '../data/LevelInstance';
import { GameUI } from '../screens/GameUI';

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
    this.levelEvents.loadLevel(level, 60 * gameSpeed);

    this.levelInstance = {
      score: 0,
      gameSpeed,
      levelEnded: false,

      enemiesKilled: 0,
      lettersTyped: 0,
      lettersDeleted: 0,

      healthLost: false,
      totalEnemies: this.levelEvents.getTotalEnemies(),
    };

    this.player.x = (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 2;
    this.player.y = CONFIG.INIT.SCREEN_HEIGHT - 150;
    this.player.setHealth(5);
    this.setScore(0);

    this.display.addChild(this.starfield, this.container);
    this.container.addObject(this.player, DisplayLayer.DEFAULT);

    GameEvents.ticker.add(this.onTick);
    JMInteractionEvents.KEY_DOWN.addListener(this.keyDown);
    GameEvents.NOTIFY_LETTER_DELETED.addListener(this.onLetterDelete);

    GameEvents.REQUEST_HEAL_PLAYER.addListener(this.player.addHealth);
    GameEvents.REQUEST_PAUSE_GAME.addListener(this.togglePause);
  }

  public dispose = () => {
    GameEvents.ticker.remove(this.onTick);
    JMInteractionEvents.KEY_DOWN.removeListener(this.keyDown);
    GameEvents.NOTIFY_LETTER_DELETED.removeListener(this.onLetterDelete);

    GameEvents.REQUEST_HEAL_PLAYER.removeListener(this.player.addHealth);
    GameEvents.REQUEST_PAUSE_GAME.removeListener(this.togglePause);

    this.player.dispose();
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

  public onTick = () => {
    if (!this.running) return;

    this.starfield.update(this.levelInstance.gameSpeed);
    this.container.updateAll(this.levelInstance.gameSpeed);

    if (this.levelEvents.isComplete()) {
      this.endLevel();
    } else {
      this.levelEvents.addDistance(this.levelInstance.gameSpeed);
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
      let screen = new ScreenCover(new PIXI.Rectangle(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT)).onFadeComplete(() => {
        this.running = false;
        this.ui.navLoss();
      }).fadeIn(2000, 3000, 1000);
      this.display.addChild(screen);
    }
  }

  public endLevel = () => {
    if (!this.levelInstance.levelEnded) {
      if (this.container.numObjects() <= 1) {
        this.levelInstance.levelEnded = true;
        let screen = new ScreenCover(new PIXI.Rectangle(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT), 0xffffff).onFadeComplete(() => {
          this.running = false;
          this.ui.navWin();
        }).fadeIn(1000, 1000, 1000);
        this.display.addChild(screen);
      }
    }
  }

  public togglePause = (e: IPauseEvent) => {
    if (!this.interactive) return;
    this.running = !e.paused;
    TextObject.allTextObjects.forEach(object => object.visible = this.running);
  }

  public onLetterDelete = (e: IDeleteEvent) => {
    this.addScore(-e.numDeleted);
  }

  public setScore = (score: number) => {
    let oldScore = this.levelInstance.score;
    this.levelInstance.score = score;
    GameEvents.NOTIFY_SET_SCORE.publish({oldScore, newScore: this.levelInstance.score});
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
    let newShip = new EnemyShip(spawnEvent, { onFire: enemy => this.actionC.enemyFires(this.player, enemy), onWordComplete: enemy => this.actionC.playerFires(this.player, enemy) });

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
