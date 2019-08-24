import { GameSprite } from './GameSprite';
import { PlayerShip } from './PlayerShip';
import { MissileData, IMissileConfig } from '../../data/EnemyData';

export interface IMissile {
  onComplete?: (target: GameSprite) => void;
  onWordComplete?: (missile: Missile) => void;
  angle?: number;
  delay?: number;
}

export class Missile extends GameSprite {
  public speed: number;

  constructor(origin: GameSprite, private target: GameSprite, private config: IMissile) {
    super();

    let missileConfig: IMissileConfig;
    if (origin instanceof PlayerShip) {
      missileConfig = MissileData.player;
    } else {
      missileConfig = MissileData.enemy;
    }

    if (missileConfig.textureUrl) {
      this.makeDisplay(missileConfig.textureUrl, missileConfig.textureScale);
    }

    this.wordSize = missileConfig.wordSize;
    this.value = missileConfig.value;
    this.speed = missileConfig.moveSpeed;
    this.killBy = missileConfig.killBy;
    this.health = missileConfig.health;
    this.a = missileConfig.moveSpeed;

    if (missileConfig.turnRate || missileConfig.turnRate === 0) {
      this.turnRate = missileConfig.turnRate;
    } else {
      this.turnRate = this.a / 7;
    }

    this.turnRateAccel = missileConfig.turnRateAccel || 0;

    if (this.wordSize > 0) {
      this.addWord();
    }

    this.x = origin.x;
    this.y = origin.y;
    this.n = origin.n;
  }

  public update = (speed: number) => {
    if (this.config.delay > 0) {
      this.config.delay -= speed;
    } else {
      if (this.target.toDestroy) {
        this.toDestroy = true;
      }
      this.moveTo(this.target, speed);

      let dx = this.target.x - this.x;
      let dy = this.target.y - this.y;
      // let angle = Math.atan2(dy, dx);
      // this.rotation = angle + Math.PI / 2;
      let distance = Math.sqrt(dy * dy + dx * dx);
      if (distance < Math.max(30, speed * this.speed * 2)) {
        this.config.onComplete(this.target);
        this.toDestroy = true;
      } else {
        // this.x += speed * this.speed * Math.cos(angle);
        // this.y += speed * this.speed * Math.sin(angle);
        if (this.target.turret) {
          if (this.target.turret.targetInRange(this)) {
            this.toDestroy = true;
            this.target.addWord();
          }
        }
      }
    }
  }

  public onWordComplete = () => {
    if (this.config.onWordComplete) {
      this.config.onWordComplete(this);
    }
  }
}
