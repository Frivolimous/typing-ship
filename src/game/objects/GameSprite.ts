import * as PIXI from 'pixi.js';
import { BaseObject } from './BaseObject';
import { Shield } from './Shield';
import { Turret } from './Turret';
import { ICommand } from '../../data/LevelData';

export enum Animation {
  IDLE,
  FIRE,
  CHARGE,
  MIDLE,
  LIDLE,
  EIDLE,
  MFIRE,
  LFIRE,
  EFIRE,
  MCHANGE,
  LCHANGE,
  ECHANGE,
  LCHARGE,
  ECHARGE,
  MIN,
  MOUT,
  LIN,
  LOUT,
  EIN,
  EOUT,
}

export class GameSprite extends BaseObject {
  public vX: number = 0;
  public vY: number = 0;
  public vT: number = 0;
  public n: number;
  public a: number;
  public value: number;
  public killBy: number;
  public turnRate: number;
  public turnRateAccel: number = 0;
  public shieldOn: boolean;
  public turret: Turret;
  public fires: number;
  public health: number = 1;
  public shieldView: Shield = new Shield();
  public firePoint: PIXI.Point = new PIXI.Point(0, 0);

  constructor() {
    super();
    this.addChild(this.shieldView);
  }

  public getFirePoint(): PIXI.Point {
    let cos = Math.cos(this.rotation);
    let sin = Math.sin(this.rotation);
    let x = this.x + this.firePoint.x * cos - this.firePoint.y * sin;
    let y = this.y + this.firePoint.x * sin + this.firePoint.y * cos;
    return new PIXI.Point(x, y);
  }

  public update = (speed: number) => {
    return;
  }

  public rotateTo = (target: {x?: number, y?: number}, speed: number) => {
    let rMult = 0.1 * speed;
    let rate = rMult * this.turnRate;
    // console.log(rate);

    if (isNaN(this.n)) {
      this.n = Math.atan2(target.y - this.y, target.x - this.x);
    } else {
      let dx = target.x - this.x;
      let dy = target.y - this.y;
      let angle = Math.atan2(dy, dx);
      while (angle < (this.n - Math.PI)) angle += Math.PI * 2;
      while (angle > (this.n + Math.PI)) angle -= Math.PI * 2;

      if (angle < this.n) {
        this.n -= rate;
        if (this.n < angle) this.n = angle;
      } else if (angle > this.n) {
        this.n += rate;
        if (this.n > angle) this.n = angle;
      }

      this.rotation = this.n + Math.PI / 2;

      this.turnRate += this.turnRateAccel * speed;
    }
  }

  public moveTo = (target: {x?: number, y?: number}, speed: number) => {
    this.rotateTo(target, speed);
    let accel = this.a * speed;

    if (this.vT < accel) {
      this.vT += accel;
    } else {
      this.vT = accel;
    }

    this.vX = Math.cos(this.n) * this.vT;
    this.vY = Math.sin(this.n) * this.vT;

    this.x += this.vX;
    this.y += this.vY;
  }

  public homeTarget(_target: BaseObject) {
    let tDiff: number = Math.atan2(_target.y - this.y, _target.x - this.x) - this.n;
    while (tDiff < (0 - Math.PI)) {
      tDiff += 2 * Math.PI;
    }
    while (tDiff > Math.PI) {
      tDiff -= 2 * Math.PI;
    }

    if (tDiff > 0) {
      this.n += (tDiff > this.turnRate) ? this.turnRate : tDiff;
    } else if (tDiff < 0) {
      this.n += (tDiff < -this.turnRate) ? (0 - this.turnRate) : tDiff;
    } else {
      return;
    }
  }

  public addShield(alpha: number = 1) {
    this.shieldOn = true;
    this.shieldView.fadeIn(alpha);
  }

  public shieldTo(alpha: number) {
    this.shieldOn = true;
    this.shieldView.fadeTo(alpha);
  }

  public removeShield() {
    if (this.shieldOn) {
      this.shieldOn = false;
      this.shieldView.fadeOut();
    }
  }
}
