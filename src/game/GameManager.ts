import { ObjectManager, DisplayLayer } from './engine/ObjectManager';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { Starfield } from '../JMGE/effects/Starfield';
import * as JMBL from '../JMGE/JMBL';
import { CONFIG } from '../Config';
import { EnemyShip } from './objects/EnemyShip';
import { BossShip } from './objects/BossShip';
import { BossShip0 } from './objects/BossShip0';
import { BossShip1 } from './objects/BossShip1';
import { BossShip2 } from './objects/BossShip2';
import { PlayerShip } from './objects/PlayerShip';
import { EventInterpreter } from './engine/EventInterpreter';
import { ActionControl } from './engine/ActionControl';
import { ISpawnEvent } from './data/LevelData';
import { WordInput } from './engine/WordInput';
import { TextObject } from './text/TextObject';
import { JMTween } from '../JMGE/JMTween';
import { ScreenCover } from '../JMGE/effects/ScreenCover';
import { LossUI } from '../menus/LossUI';
import { WinUI } from '../menus/WinUI';
import { TutorialManager } from './engine/TutorialManager';
import { AchievementManager } from './engine/AchievementManager';
import { GameEvents, IPauseEvent, IDeleteEvent } from './engine/GameEvents';
import { JMEvents } from '../JMGE/events/JMEvents';
import { JMInteractionEvents } from '../JMGE/events/JMESelfRegister';

export class GameManager extends BaseUI {
  public running = true;
  public interactive = true;

  public container: ObjectManager = new ObjectManager();
  public tutorials: TutorialManager = new TutorialManager(this);
  public achievements: AchievementManager = new AchievementManager(this);
  public actionC: ActionControl = new ActionControl(this);
  public starfield: Starfield;
  public player: PlayerShip = new PlayerShip();
  public wordInput = new WordInput();
  public levelEvents: EventInterpreter;

  public score: number = 0;
  public gameSpeed: number = 1;
  public levelEnded: boolean = false;
  // distanceRate:number=.0002;

  constructor(level: number = 0, difficulty: number = 1) {
    super();
    this.gameSpeed = difficulty * 0.5;

    this.container.gameUI.addHealWord(this.wordInput.healWord);

    this.starfield = new Starfield(CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT);

    // this.actionC.missileRate=Math.max(1,Math.min(WPM/150,0.3));
    this.actionC.missileRate = 0.4;

    this.levelEvents = new EventInterpreter(this.addEnemy, this.addBoss);
    this.levelEvents.loadLevel(level, 60 * this.gameSpeed);

    this.player.x = CONFIG.INIT.SCREEN_WIDTH / 2;
    this.player.y = CONFIG.INIT.SCREEN_HEIGHT - 150;
    this.player.setHealth(5);
    this.setScore(0);

    this.addChild(this.starfield, this.container);
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
    this.destroy();
  }

  public keyDown = (e: JMBL.IKeyboardEvent) => {
    if (!this.running || !this.interactive) {
      if (e.key === ' ') {
        GameEvents.REQUEST_PAUSE_GAME.publish({paused: false});
        // this.togglePause();
      }
      return;
    }
    switch (e.key) {
      case 'Escape': this.navBack(); break;
      case ' ': GameEvents.REQUEST_PAUSE_GAME.publish({paused: true}); break;
      // case '=': this.gameSpeed += 1; break;
      // case '-': this.gameSpeed -= 1; break;
      case 'Backspace': this.wordInput.deleteLetters(1); break;
      default: this.wordInput.addLetter(e.key); break;
    }
  }

  public onTick = () => {
    if (!this.running) return;

    // if (delay>0){
    // 	delay-=1;
    // 	if (delay==1){
    // 		toRun();
    // 	}else if (toRun==finalBoss){
    // 		gameM.boss.alpha=delay/100;
    // 		if (gameM.boss.over!=null){
    // 			gameM.boss.over.alpha=delay/100;
    // 		}
    // 		if (Math.random()>0.6){
    // 			var _point:Point=new Point();
    // 			do{
    // 				_point.x=Math.random()*gameM.boss.view.bitmapData.width;
    // 				_point.y=Math.random()*gameM.boss.view.bitmapData.height;
    // 			}while (gameM.boss.view.bitmapData.getPixel32(_point.x,_point.y)<0x01000000);
    // 			gameM.starfield.explosion((_point.x*gameM.boss.scale)+gameM.boss.x-gameM.boss.view.width/2,(_point.y*gameM.boss.scale)+gameM.boss.y-gameM.boss.view.height/2);
    // 		}
    // 	}
    // }else if (gameM.pShip.health<=0){
    // 	playerDeath();
    // 	return;
    // }
    // this.distance+=this.gameSpeed*this.DISTANCE_MULT;

    this.starfield.update(this.gameSpeed);
    this.container.updateAll(this.gameSpeed);

    if (this.levelEvents.isComplete()) {
      if (!this.levelEnded) {
        if (this.container.numObjects() <= 1) {
          this.levelEnded = true;
          let screen = new ScreenCover(new PIXI.Rectangle(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT), 0xffffff).onFadeComplete(() => {
            this.running = false;
            this.navForward(new WinUI(), this.previousUI);
          }).fadeIn(1000, 1000, 1000);
          this.addChild(screen);
        }
        // this.endLevel();
      }
    } else {
      this.levelEvents.addDistance(this.gameSpeed);
    }

    // 		if ((gameM.boss==null)&&(gameM.gObjects.length==0)){
    // 			if ((delay==0)&&(finalDelay)){
    // 				endLevel();
    // 			}else{
    // 				gameM.levelData.push(new LevelEvent(gameM.distance+0.05,LevelEvent.WAIT,0.05));
    // 				finalDelay=true;
    // 			}
    // 		}
    // 	}
    // }

    GameEvents.NOTIFY_SET_PROGRESS.publish({ current: this.levelEvents.distance, total: this.levelEvents.finalDistance });

    if (!this.interactive) return;
    if (this.player.health <= 0 && !CONFIG.GAME.godmode) {
      console.log('dead');
      this.interactive = false;
      this.container.makeExplosionAt(this.player.x, this.player.y, 50);
      this.player.visible = false;
      let screen = new ScreenCover(new PIXI.Rectangle(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT)).onFadeComplete(() => {
        this.running = false;
        this.navForward(new LossUI(), this.previousUI);
      }).fadeIn(2000, 3000, 1000);
      this.addChild(screen);
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
    let oldScore = this.score;
    this.score = score;
    GameEvents.NOTIFY_SET_SCORE.publish({oldScore, newScore: this.score});
  }

  public addScore = (add: number) => {
    let oldScore = this.score;
    this.score += add;
    GameEvents.NOTIFY_SET_SCORE.publish({oldScore, newScore: this.score});
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
