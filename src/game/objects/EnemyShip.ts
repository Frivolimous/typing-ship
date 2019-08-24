import { GameSprite } from './GameSprite';
import { ISpawnEvent } from '../../data/LevelData';
import { Charge } from '../../JMGE/effects/Charge';
import { IEnemyConfig, EnemyData } from '../../data/EnemyData';
import { ActionType } from '../../data/Types';
import { Turret } from './Turret';
import * as JMBL from '../../JMGE/JMBL';
import { CONFIG } from '../../Config';
import { GameEvents } from '../engine/GameEvents';

interface IEnemyCallbacks {
  onFire?: (enemy: EnemyShip, fires: ActionType) => void;
  onFinishCommands?: (enemy: EnemyShip) => void;
  onWordComplete?: (enemy: EnemyShip) => void;
}

export class EnemyShip extends GameSprite {
  public killBy: ActionType;
  public fires: ActionType;
  public charge: Charge = new Charge();

  constructor(public config: ISpawnEvent, public callbacks: IEnemyCallbacks) {
    super();
    let enemyConfig: IEnemyConfig;

    switch (config.type.substring(0, 2)) {
      case 'sm': enemyConfig = EnemyData.sm; break;
      case 'sl': enemyConfig = EnemyData.sl; break;
      case 'ss': enemyConfig = EnemyData.ss; break;
      case 'mm': enemyConfig = EnemyData.mm; break;
      case 'ml': enemyConfig = EnemyData.ml; break;
      case 'ms': enemyConfig = EnemyData.ms; break;
      case 'lm': enemyConfig = EnemyData.lm; break;
      case 'll': enemyConfig = EnemyData.ll; break;
      case 'xm': enemyConfig = EnemyData.xm; break;
      case 'nl': enemyConfig = EnemyData.nl; break;
      default: throw (new Error(config.type.substring(0, 2) + ' is not a recognized ship code.'));
    }

    if (enemyConfig.textureUrl) {
      this.makeDisplay(enemyConfig.textureUrl, enemyConfig.textureScale);
    }

    this.wordSize = enemyConfig.wordSize;
    this.value = enemyConfig.value;
    this.a = enemyConfig.moveSpeed;
    this.fires = enemyConfig.fires;
    this.killBy = enemyConfig.killBy;
    this.firePoint.set(enemyConfig.firePoint.x, enemyConfig.firePoint.y);
    this.health = enemyConfig.health;
    if (enemyConfig.turnRate || enemyConfig.turnRate === 0) {
      this.turnRate = enemyConfig.turnRate;
    } else {
      this.turnRate = this.a / 7;
    }

    this.turnRateAccel = enemyConfig.turnRateAccel || 0;

    this.n = Math.atan2(config.commands[0].y - config.y, config.commands[0].x - config.x);

    this.addChild(this.charge);

    this.shieldView.scale.set(enemyConfig.shield.width / 200, enemyConfig.shield.height / 200);
    this.shieldView.position.set(enemyConfig.shield.x, enemyConfig.shield.y);

    this.addWord();

    switch (config.type.charAt(2)) {
      case 's': this.addShield(); this.value += 2; break;
      case 't': this.addTurret(); this.value += 2; break;
      case 'b': this.addShield(); this.addTurret(); this.value += 5; break;
      default: break;
    }

    if (this.fires === ActionType.LASER) {
      this.charge.time = 200;
      this.charge.x = this.firePoint.x;
      this.charge.y = this.firePoint.y;
    }

    this.x = config.x;
    this.y = config.y;
  }

  public startCharge(callback: () => void) {
    this.charge.startCharge(callback);
  }

  public update = (speed: number) => {
    this.checkNextCommand(speed);

    if (!this.toDestroy) {
      if (this.charge.running) {
        this.charge.update(speed);
      }

      if (this.config.commands[0].move) {
        this.moveTo(this.config.commands[0], speed);
      } else if (this.config.commands[0].x !== undefined && this.config.commands[0].y !== undefined) {
        this.rotateTo(this.config.commands[0], speed);
        // this.rotateTo({x: CONFIG.INIT.STAGE_WIDTH / 2, y: CONFIG.INIT.STAGE_HEIGHT - 150}, speed);
        // console.log(this.n, this.rotation);
        // let angle = Math.atan2(this.config.commands[0].y - this.y, this.config.commands[0].x - this.x);
        // this.rotation = angle + Math.PI / 2;
      } else {
    //     this.player.x = CONFIG.INIT.STAGE_WIDTH / 2;
    // this.player.y = CONFIG.INIT.STAGE_HEIGHT - 150;
      }

      if (this.turret) {
        this.turret.update(speed);
      }
    }
  }

  public replaceCommands(commands: any[]) {
    this.config.commands = commands;
  }

  public checkNextCommand(speed: number) {
    if (this.config.commands.length === 0) {
      this.toDestroy = true;
      return;
    }
    let command = this.config.commands[0];
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

    this.config.commands.shift();
    if (this.config.commands.length === 0) {
      this.toDestroy = true;
      if (this.callbacks.onFinishCommands) {
        this.callbacks.onFinishCommands(this);
      }
      GameEvents.NOTIFY_COMMANDS_COMPLETE.publish({object: this});
      return;
    }
    command = this.config.commands[0];
    if (command.fire && this.callbacks.onFire) {
      this.callbacks.onFire(this, this.fires);
    }
  }

  public addShield() {
    this.shieldOn = true;
    this.addChild(this.shieldView);
    this.shieldView.fadeIn();
    this.addWord(3);
  }

  public removeShield() {
    if (this.shieldOn) {
      this.shieldOn = false;
      this.shieldView.fadeOut();
      this.addWord();
    }
  }

  public addTurret() {
    if (!this.turret) {
      this.turret = new Turret();
      this.addChild(this.turret);
    }
  }

  public removeTurret() {
    if (this.turret) {
      this.turret.dispose();
      this.turret.destroy();
    }
  }

  public onWordComplete = () => {
    if (this.callbacks.onWordComplete) {
      this.callbacks.onWordComplete(this);
    }
  }
}
