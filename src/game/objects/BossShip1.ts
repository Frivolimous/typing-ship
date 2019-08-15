import { BossShip } from './BossShip';
import { GameManager } from '../GameManager';
import { ImageRepo } from '../../TextureData';
import { ISpawnEvent } from '../data/LevelData';
import { CONFIG } from '../../Config';

export class BossShip1 extends BossShip {
  public firePoints = [{ x: 2.3, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3.5 }, { x: 6, y: 3.5 }, { x: 7, y: 4 }, { x: 9.7, y: 3 }];

  constructor(bossType: number, manager: GameManager) {
    super(bossType, manager);

    this.makeDisplay(ImageRepo.boss1, 0.5);
    this.hitBounds = new PIXI.Rectangle(-150, -30, 300, 60);
  }

  public bossUpdate(speed: number) {
    if (this.delay <= 0) {
      this.delay = 36;
    } else {
      this.delay -= speed;
      if (this.delay === 35) {
        // this.over.visible=true;
      } else if (this.delay === 20) {
        // this.over.visible=false;
      }
    }
  }

  public bossFire() {
    let point = this.firePoints[Math.floor(Math.random() * 6)];
    let spawn: ISpawnEvent = { type: this.health > 1 ? 'nln' : 'nls', x: point.x, y: point.y, commands: [{ timer: this.health > 1 ? 21 : 23 }, { timer: 20, fire: true }] };
    let e = this.manager.addEnemy(spawn);
  }
  public newCommands() {
    this.bossFire();
    this.commands.push({ x: (CONFIG.INIT.SCREEN_WIDTH + CONFIG.INIT.STAGE_BUFFER) / 2, y: 500, timer: 138 + this.health * 18, move: false, fire: true });
  }
}
