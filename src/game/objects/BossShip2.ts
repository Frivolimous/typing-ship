import { BossShip } from './BossShip';
import { CONFIG } from '../../Config';
import { ClearObject } from './ClearObject';
import { GameManager } from '../GameManager';
import { GameSprite } from './GameSprite';
import { ImageRepo } from '../../TextureData';

export class BossShip2 extends BossShip {
  public objects: GameSprite[] = [];
  public shieldCount = 0;

  constructor(bossType: number, manager: GameManager) {
    super(bossType, manager);

    this.makeDisplay(ImageRepo.boss2, 0.5);
    this.hitBounds = new PIXI.Rectangle(-150, -30, 300, 60);
  }

  public addPlayerShield = () => {
    this.shieldCount++;
    if (this.shieldCount === 1) {
      this.manager.player.addShield(0.2);
    } else {
      this.manager.player.shieldTo(0.2 * this.shieldCount);
    }
  }

  public makeCounter(x: number, y: number) {
    let object = new ClearObject(11 - this.health, this.addPlayerShield);
    object.x = this.manager.player.x + x - 5;
    object.y = this.manager.player.y + y;

    this.objects.unshift(object);
    this.manager.container.addObject(object);
  }

  public bossUpdate(speed: number) {
    if (this.delay >= 0) {
      switch (this.delay) {
        case 215: this.makeCounter(30, 20); break;
        case 210: this.makeCounter(-75, 20); break;
        case 205: this.makeCounter(30, -20); break;
        case 200: this.makeCounter(-75, -20); break;
        case 180:
          // view.bitmapData=SpriteSheets.bRes[2][0][1];
          // Facade.soundC.sound(SoundControl.BOSS_CHARGE);
          break;
        case 140:
          // view.bitmapData=SpriteSheets.bRes[2][0][2];
          // Facade.soundC.sound(SoundControl.BOSS_CHARGE);
          break;
        case 100:
          // Facade.gameUI.bossV.addChildAt(over,0);
          // if (count>0){
          //   over.bitmapData=SpriteSheets.bRes[index][1][1];
          // }
          // Facade.soundC.sound(SoundControl.BOSS_FIRE);
          break;
        default:
          if (this.delay < 75) {
            if (this.delay % 5 === 0) {
              if (this.shieldCount === 0) {
                // explode
              } else {
                // over.bitmapData=SpriteSheets.bRes[index][1][(Math.floor(delay/5)%3)+1];
              }
            }
            if (this.delay % 20 === 0) {
              if (this.delay > 0) {
                // Facade.soundC.sound(SoundControl.BOSS_FIRE);
              }
              if (this.shieldCount > 0) {
                this.shieldCount--;
                if (this.shieldCount === 0) {
                  this.manager.player.removeShield();
                  // over.bitmapData=SpriteSheets.bRes[index][1][0];
                } else {
                  this.manager.player.shieldTo(this.shieldCount * 0.2);
                }
              } else {
                this.manager.player.addHealth(-1);
              }
            }
            if (this.delay === 0) {
              this.manager.player.removeShield();
              // this.over.parent.removeChild(over);
              // view.bitmapData=SpriteSheets.boss[2];
              while (this.objects.length > 0) {
                this.objects.shift().dispose();
              }
            }
          }
      }
      // console.log(this.delay,speed);
      this.delay -= 0.5;
    }
  }

  public bossFire() {
    this.shieldCount = 0;
    this.delay = 220;
    // view.bitmapData=SpriteSheets.bRes[2][0][0];
    // Facade.soundC.sound(SoundControl.BOSS_CHARGE);
  }

  public newCommands() {
    this.bossFire();
    this.commands.push({ x: (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 2, y: 500, timer: 820, move: false, fire: true });
  }
}
