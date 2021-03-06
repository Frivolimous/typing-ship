import { GameSprite } from './GameSprite';
import { Charge } from '../../JMGE/effects/Charge';
import { ImageRepo } from '../../utils/TextureData';
import { IHealEvent, GameEvents } from '../../utils/GameEvents';
import { CONFIG } from '../../Config';
import { Colors } from '../../data/Colors';

export class PlayerShip extends GameSprite {
  public injured: boolean;
  public shieldSize: number;
  public animA: string[] = [];
  public targetA: GameSprite[] = [];

  public empCharge = new Charge(20, 5, Colors.GAME.PLAYER_EMP);
  public laserCharge = new Charge(10, 5, Colors.GAME.PLAYER_LASER);

  constructor() {
    super();

    this.makeDisplay(ImageRepo.player, 1);
    this.addChild(this.laserCharge, this.empCharge, this.shieldView);

    this.shieldView.scale.set(0.35, 0.35);
    this.firePoint.set(0, -20);
    this.laserCharge.y = this.firePoint.y;
    this.empCharge.y = this.firePoint.y;
    this.n = -Math.PI / 2;
  }

  public setHealth = (i: number) => {
    let oldHealth = this.health;
    this.health = Math.max(Math.min(i, CONFIG.GAME.playerHealth), 0);
    GameEvents.NOTIFY_SET_HEALTH.publish({oldHealth, newHealth: this.health});
  }

  public addHealth = (e: IHealEvent) => {
    this.setHealth(this.health + e.amount);
  }

  public update = (speed: number) => {
    if (this.laserCharge.running) {
      this.laserCharge.update(speed);
    }
    if (this.empCharge.running) {
      this.empCharge.update(speed);
    }
  }
}
