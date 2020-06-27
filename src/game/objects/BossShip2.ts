import * as PIXI from 'pixi.js';
import { BossShip } from './BossShip';
import { CONFIG } from '../../Config';
import { ClearObject } from './ClearObject';
import { GameSprite } from './GameSprite';
import { ImageRepo } from '../../utils/TextureData';
import { GameManager } from '../GameManager';
import { SoundData, SoundIndex } from '../../utils/SoundData';

export class BossShip2 extends BossShip {
  public objects: GameSprite[] = [];
  public shieldCount = 0;

  constructor(bossType: number, manager: GameManager) {
    super(bossType, manager);

    this.makeDisplay(ImageRepo.boss2, 0.5);
    this.hitBounds = new PIXI.Rectangle(-150, -30, 300, 60);
    this.overOffset.set(-275, 95);
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
          this.display.texture = PIXI.Texture.from(ImageRepo.boss2a);
          // view.bitmapData=SpriteSheets.bRes[2][0][1];
          SoundData.playSound(SoundIndex.BOSS_CHARGE);
          break;
        case 140:
          this.display.texture = PIXI.Texture.from(ImageRepo.boss2b);
          // view.bitmapData=SpriteSheets.bRes[2][0][2];
          SoundData.playSound(SoundIndex.BOSS_CHARGE);
          break;
        case 100:
          this.display.texture = PIXI.Texture.from(ImageRepo.boss2c);
          if (!this.over) {
            this.over = new PIXI.Sprite(this.getShieldTexture(-1));
            this.over.scale.set(1, 1.2);
            this.parent.addChild(this.over);
            console.log('ADD OVER', this.over);
          }
          if (this.shieldCount > 0) {
            this.over.texture = this.getShieldTexture(0);
          }
          SoundData.playSound(SoundIndex.BOSS_LASER);
          break;
        default:
          if (this.delay < 75) {
            if (this.delay % 5 === 0) {
              if (this.shieldCount === 0) {
                this.over.texture = this.getShieldTexture(-1);
                // explode
              } else {
                this.over.texture = this.getShieldTexture(Math.floor(this.delay / 5) % 3);
              }
            }
            if (this.delay % 20 === 0) {
              if (this.delay > 0) {
                SoundData.playSound(SoundIndex.BOSS_LASER);
              }
              if (this.shieldCount > 0) {
                this.shieldCount--;
                if (this.shieldCount === 0) {
                  this.manager.player.removeShield();
                  this.over.texture = this.getShieldTexture(-1);
                } else {
                  this.manager.player.shieldTo(this.shieldCount * 0.2);
                }
              } else {
                this.manager.player.addHealth({amount: -1});
              }
            }
            if (this.delay === 0) {
              this.manager.player.removeShield();
              this.display.texture = PIXI.Texture.from(ImageRepo.boss2);
              this.over.destroy();
              this.over = null;
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

  public getShieldTexture(i: number) {
    switch (i) {
      case -1: return PIXI.Texture.from(ImageRepo.boss2Over0);
      case 0: return PIXI.Texture.from(ImageRepo.boss2Over1a);
      case 1: return PIXI.Texture.from(ImageRepo.boss2Over1b);
      case 2: return PIXI.Texture.from(ImageRepo.boss2Over1c);
    }
  }

  public bossFire() {
    this.shieldCount = 0;
    this.delay = 220;
    // view.bitmapData=SpriteSheets.bRes[2][0][0];
    SoundData.playSound(SoundIndex.BOSS_CHARGE);
  }

  public newCommands() {
    this.bossFire();
    this.commands.push({ x: (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 2, y: 500, timer: 820, move: false, fire: true });
  }
}
