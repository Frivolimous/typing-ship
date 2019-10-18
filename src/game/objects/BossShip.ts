import * as PIXI from 'pixi.js';
import { GameSprite } from './GameSprite';
import { ICommand } from '../../data/LevelData';
import { CONFIG } from '../../Config';
import { Scanner } from './Scanner';
import { GameEvents } from '../../utils/GameEvents';
import { GameManager } from '../GameManager';

export class BossShip extends GameSprite {
  public commands: ICommand[] = [{ x: (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 2, y: 200, move: true }, { x: (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 2, y: 500, timer: 6, move: false, fire: true }];
  public scanner: Scanner;
  public over: PIXI.Sprite;
  public overOffset: PIXI.Point = new PIXI.Point(0, 0);
  public delay: number = -1;
  public moveWith: GameSprite[] = [];
  public hitBounds: PIXI.Rectangle;

  constructor(public bossType: number, protected manager: GameManager) {
    super();
    this.health = 3;
    this.wordSize = -1;
    // viewSource=SpriteSheets.boss[bossType];

    // let graphics=new PIXI.Graphics;
    // graphics.beginFill(0x00cc77);
    // graphics.drawEllipse(0,0,150,100);
    // this.addChild(graphics);

    this.x = (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 2;
    this.y = -50;
    // this.onWordComplete=this.scan;
  }

  public dispose() {
    if (this.over) {
      this.over.destroy();
      this.over = null;
    }
    this.toDestroy = true;
  }

  public getRandomCollisionPoint(): { x: number, y: number } {
    let point = new PIXI.Point(this.hitBounds.x + Math.random() * this.hitBounds.width, this.hitBounds.y + Math.random() * this.hitBounds.height);
    return point;
    // return {x:-75+Math.random()*75,y:-50+Math.random()*50};
  }

  public update = (speed: number) => {
    if (!this.scanner) {
      if (this.commands.length <= 1) {
        this.scanner = new Scanner(this);
        let loc = this.getRandomCollisionPoint();
        this.scanner.x = loc.x;
        this.scanner.y = loc.y;
        this.addChild(this.scanner);
      }
    } else {
      this.scanner.update();
    }

    this.bossUpdate(speed);

    this.checkNextCommand(speed);
    let diffX = 0;
    let diffY = 0;
    if (this.commands.length > 0 && this.commands[0].move) {
      let command = this.commands[0];
      let dx = command.x - this.x;
      let dy = command.y - this.y;
      let angle = Math.atan2(dy, dx);
      diffX = speed * Math.cos(angle);
      diffY = speed * Math.sin(angle);
      this.x += diffX;
      this.y += diffY;
    }
    this.moveWith.forEach(object => (object.x += diffX, object.y += diffY));
    if (this.over) {
      this.over.x = this.x + this.overOffset.x;
      this.over.y = this.y + this.overOffset.y;
    }
  }

  public replaceCommands(commands: any[]) {
    this.commands = commands;
  }

  public checkNextCommand(speed: number) {
    if (this.commands.length === 0) {
      this.newCommands();
    }

    let command = this.commands[0];
    if (command.move) {
      if (Math.abs(this.x - command.x) > 20 || Math.abs(this.y - command.y) > 20) {
        return;
      }
    } else {
      if (command.timer > 0) {
        command.timer -= speed * .4;
        return;
      }
    }

    this.commands.shift();
    // console.log(this.commands.length);
    // if (this.commands.length>0 && this.commands[0].fire){
    // this.bossFire();
    // }
  }

  public scan = (lastWord?: boolean) => {
    if (lastWord) {
      this.scanner.dispose();
      this.scanner.destroy();
      this.scanner = null;
      this.injure();
    }
    // }else{
    //   this.scanner.scan();
    // }
  }

  public injure = () => {
    let oldHealth = this.health;
    this.health--;
    GameEvents.NOTIFY_BOSS_DAMAGED.publish({oldHealth, newHealth: this.health});
    if (this.health === 0) {
      this.toDestroy = true;
      // killBoss
      // new PopScore(this,100);
      // 				Facade.gameC.killBoss();
      // 				if (index==0){
      // 					Facade.gameUI.bossV.addChild(over);
      // 				}
    }
  }

  public bossUpdate(speed: number) {

  }

  public bossFire() {

  }

  public newCommands() {

  }
}
