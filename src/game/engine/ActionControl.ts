import { PlayerShip } from '../objects/PlayerShip';
import { GameSprite } from '../objects/GameSprite';
import { DisplayLayer } from './ObjectManager';
import { Missile } from '../objects/Missile';
import { EnemyShip } from '../objects/EnemyShip';
import { ActionType } from '../../data/Types';
import { GameManager } from '../GameManager';
import { Turret } from '../objects/Turret';
import { JMTween } from '../../JMGE/JMTween';
import { Colors } from '../../data/Colors';

export class ActionControl {
  public missileCount: number = 0;
  public missileRate: number = 1;

  constructor(private manager: GameManager) {

  }

  public playerFires = (player: PlayerShip, enemy: GameSprite) => {
    if (enemy.shieldOn) {
      this.shootEMP(player, enemy);
    } else {
      switch (enemy.killBy) {
        case ActionType.MISSILE: this.shootPlayerMissile(player, enemy); break;
        case ActionType.LASER: this.shootPlayerLaser(player, enemy); break;
        case ActionType.INSTANT: default: enemy.dispose(); break;
        case ActionType.TURRET_LASER: this.shootPlayerTurretLaser(player, enemy as Turret); break;
      }
    }
  }

  public shootPlayerMissile(origin: PlayerShip, target: GameSprite) {
    switch (target.health) {
      case 1: this.createPlayerMissile(origin, target);
              break;
      case 2: this.createPlayerMissile(origin, target, {x: 15, y: 0}, 0);
              this.createPlayerMissile(origin, target, {x: -15, y: 0}, 100);
              break;
      case 3: this.createPlayerMissile(origin, target, {x: 0, y: 0}, 0);
              this.createPlayerMissile(origin, target, {x: 15, y: 0}, 100);
              this.createPlayerMissile(origin, target, {x: -15, y: 0}, 200);
              break;
      case 4: this.createPlayerMissile(origin, target, {x: 15, y: -15}, 0);
              this.createPlayerMissile(origin, target, {x: -15, y: -15}, 100);
              this.createPlayerMissile(origin, target, {x: 15, y: 15}, 200);
              this.createPlayerMissile(origin, target, {x: -15, y: 15}, 300);
              break;
    }
  }

  public createPlayerMissile = (origin: PlayerShip, target: GameSprite, offset: {x: number, y: number} = {x: 0, y: 0}, delay?: number) => {
    if (delay) {
      new JMTween({}, 0).wait(delay).onWaitComplete(() => this.createPlayerMissile(origin, target, offset)).start();
    } else {
      let missile = new Missile(origin, target, { onComplete: this.enemyHit, onTurretFire: this.fireTurret });
      missile.x += offset.x;
      missile.y += offset.y;
      this.manager.container.addObject(missile, DisplayLayer.DEFAULT, false);
    }
  }

  public shootPlayerLaser(origin: PlayerShip, target: GameSprite) {
    origin.laserCharge.startCharge(() => {
      if (target && target.parent) {
        this.manager.container.makeLaser(origin.getFirePoint(), target, Colors.GAME.PLAYER_LASER);
        this.enemyDestroyed(target);
        // soundC.sound(SoundControl.LASER);
      }
    });
  }

  public shootPlayerTurretLaser(origin: PlayerShip, target: Turret) {
    origin.laserCharge.startCharge(() => {
      if (target && target.parent) {
        let position = {x: target.x + target.ship.x, y: target.y + target.ship.y};
        this.manager.container.makeLaser(origin.getFirePoint(), position, Colors.GAME.PLAYER_LASER);
        this.manager.container.makeExplosionAt(position.x, position.y, 10);
        this.manager.container.makeScoreDisplay(position.x, position.y, target.value);
        target.ship.removeTurret();
        this.manager.enemyDestroyed(target);
      }
    })
  }

  public enemyFires = (player: PlayerShip, enemy: EnemyShip) => {
    switch (enemy.fires) {
      case ActionType.MISSILE: this.shootEnemyMissile(enemy, player); break;
      case ActionType.AUTO_MISSILE: this.shootEnemyMissile(enemy, player, true); break;
      case ActionType.LASER: this.shootEnemyLaser(enemy, player); break;
      case ActionType.SUICIDE: this.shootSuicide(enemy, player); break;
    }
  }

  public fireTurret = (missile: Missile, turret: Turret) => {
    let origin = {x: turret.x + turret.ship.x, y: turret.y + turret.ship.y};
    this.manager.container.makeLaser(origin, missile, Colors.GAME.ENEMY_LASER);
    this.manager.container.makeExplosionAt(missile.x, missile.y, 20);
  }

  public shootEnemyMissile(origin: GameSprite, target: PlayerShip, auto?: boolean) {
    if (auto) {
      this.missileCount += 1;
    } else {
      this.missileCount += this.missileRate;
      switch (origin.health) {
        case 2: this.missileCount += this.missileRate * 1.5; break;
        case 3: this.missileCount += this.missileRate * 2; break;
        case 4: this.missileCount += this.missileRate * 2.5; break;
        default: this.missileCount += this.missileRate; break;
      }
    }

    if (this.missileCount >= 1) {
      origin.priority = 0;
      origin.value -= 1;
      this.missileCount -= 1;
      this.manager.container.addObject(new Missile(origin, target, { onComplete: () => this.damagePlayer(), onWordComplete: missile => this.playerFires(this.manager.player, missile) }), DisplayLayer.PROJECTILES, false);
    }
  }

  public shootEnemyLaser(origin: EnemyShip, target: PlayerShip, instant?: boolean) {
    if (instant) {
      this.manager.container.makeLaser(origin.getFirePoint(), target, Colors.GAME.ENEMY_LASER);
      this.damagePlayer();
      // soundC.sound(SoundControl.LASER);
      origin.priority = 0;
    } else {
      origin.priority = 2;
      // soundC.sound(SoundControl.CHARGE);
      origin.startCharge(() => {
        this.manager.container.makeLaser(origin.getFirePoint(), target, Colors.GAME.ENEMY_LASER);
        this.damagePlayer();
        // soundC.sound(SoundControl.LASER);
        origin.priority = 0;
      });
    }
  }

  public shootEMP(origin: PlayerShip, target: GameSprite) {
    origin.empCharge.startCharge(() => {
      this.manager.container.makeEMP(origin, target);
      // soundC.sound(SoundControl.EMP);
      target.removeShield();
    });
  }

  public shootSuicide(origin: EnemyShip, target: GameSprite) {
    origin.replaceCommands([{ x: target.x, y: target.y, move: true }]);
    origin.callbacks.onFinishCommands = () => this.damagePlayer();
    origin.a *= 2;
    origin.turnRateAccel = 0.0001;
    origin.priority = 3;
  }

  public damagePlayer(amount: number = -1) {
    this.manager.container.makeExplosionAt(this.manager.player.x, this.manager.player.y, amount * -3);
    this.manager.player.addHealth({amount: -1});
  }

  public enemyHit = (enemy: GameSprite) => {
    if (enemy.toDestroy) return;

    enemy.health--;
    if (enemy.health <= 0) {
      this.enemyDestroyed(enemy);
    } else {
      this.manager.container.makeExplosionAt(enemy.x, enemy.y, 10);
    }
  }

  public enemyDestroyed = (enemy: GameSprite) => {
    enemy.toDestroy = true;
    let size = enemy.wordSize === 3 ? 20 : 40;
    this.manager.container.makeExplosionAt(enemy.x, enemy.y, size);
    this.manager.container.makeScoreDisplay(enemy.x, enemy.y, enemy.value);
    this.manager.enemyDestroyed(enemy);
  }
}
