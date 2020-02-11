import { GameSprite } from './GameSprite';
import { ImageRepo } from '../../utils/TextureData';
import { ActionType } from '../../data/Types';
import { EnemyShip } from './EnemyShip';
import * as PIXI from 'pixi.js';

export class Turret extends GameSprite {

  constructor(public ship: EnemyShip) {
    super();
    this.wordSize = 3;
    this.addWord(3, 0);
    this.killBy = ActionType.TURRET_LASER;
    this.value = 2;

    this.wordOffset.set(-10, 5);

    this.makeDisplay(ImageRepo.turret, 0.2);
    this.display.anchor.set(0.46, 0.67);
  }

  public trackTarget(target: GameSprite) {
    let angle = Math.atan2(target.y - (this.y + this.ship.y), target.x - (this.x + this.ship.x));
    let parentRotation = this.ship.rotation;
    let finalAngle = angle - parentRotation + Math.PI * 0.5;

    let rate = 0.07;
    while (finalAngle < this.rotation - Math.PI) finalAngle += Math.PI * 2;
    while (finalAngle > this.rotation + Math.PI) finalAngle -= Math.PI * 2;

    if (finalAngle < this.rotation) {
      this.rotation -= rate;
      if (this.rotation < finalAngle) this.rotation = finalAngle;
    } else if (finalAngle > this.rotation) {
      this.rotation += rate;
      if (this.rotation > finalAngle) this.rotation = finalAngle;
    }
  }

  public targetInRange(target: GameSprite): boolean {
    if (Math.sqrt((target.y - this.ship.y) * (target.y - this.ship.y) + (target.x - this.ship.x) * (target.x - this.ship.x)) < 100) {
      return true;
    } else {
      return false;
    }
  }

  public onWordComplete = () => {
    this.ship.onTurretWordComplete();
  }
}
