import * as PIXI from 'pixi.js';
import { BossShip } from './BossShip';
import { EnemyShip } from './EnemyShip';
import { ImageRepo } from '../../utils/TextureData';
import { DisplayLayer } from '../engine/ObjectManager';
import { boss0Suicides } from '../../data/LevelData';
import { CONFIG } from '../../Config';
import { GameManager } from '../GameManager';

export class BossShip0 extends BossShip {
  public objects: EnemyShip[] = [];

  constructor(bossType: number, manager: GameManager) {
    super(bossType, manager);

    this.makeDisplay(ImageRepo.boss0, 0.5);
    this.hitBounds = new PIXI.Rectangle(-150, -30, 300, 60);

    this.over = PIXI.Sprite.from(ImageRepo.boss0Over0);
    this.over.anchor.set(0.5);
    this.over.scale.set(0.5);
    this.overOffset.set(-3, 14);
    manager.container.layers[DisplayLayer.EXPLOSIONS].addChild(this.over);
  }

  public bossUpdate(speed: number) {
    if (this.delay > 0) {
      if (this.delay === 10) {
        if (this.objects.length === 0) {
          // this.over.animateTo(1);
        }
      } else if (this.delay === 1) {
        if (this.objects.length > 0) {
          // this.over.animateTo(2);
        } else {
          // this.over.animateTo(0);
        }
      }
      this.delay -= speed;
    } else {
      if (this.objects.length > 0) {
        while (true) {
          if (this.objects[0].config.commands.length <= 1 || this.objects[0].toDestroy) {
            console.log('GONE');
            this.objects.shift();
            if (this.objects.length === 0) {
              this.manager.container.layers[DisplayLayer.EXPLOSIONS].addChild(this.over);
            }
            break;
          } else {
            break;
          }
        }
      }
      if (this.objects.length === 0) {
        this.delay = 20;
      }
    }
  }

  public bossFire() {
    console.log('FIRE!');
    let a = boss0Suicides();
    while (a.length > 0) {
      let newShip = this.manager.addEnemy(a.shift().spawnEvent);

      this.objects.push(newShip);
    }
    this.manager.container.layers[DisplayLayer.PROJECTILES].addChild(this.over);
    this.delay = 20;

    // over.bitmapData=SpriteSheets.bRes[0][1];
  }

  public newCommands() {
    this.bossFire();
    this.commands.push({ x: (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 2, y: 500, timer: 480, move: false, fire: true });
  }
}
