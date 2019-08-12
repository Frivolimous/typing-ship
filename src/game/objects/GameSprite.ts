import { BaseObject } from './BaseObject';
import { Shield } from './Shield';
import { Turret } from './Turret';
import { ICommand } from '../data/LevelData';

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
  public shieldOn: boolean;
  public turret: Turret;
  public halt: boolean;
  public viewSource: any;
  public fires: number;
  public walkMult: number = 1;
  public legFrame: number = 0;
  public torsoFrame: number = 0;
  public frame: number = 0;
  public cAnim: Animation = Animation.IDLE;
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

  // public init(){
  //   this.config=config;

  //   if (config.boss){
  //     this.vT=0.01;
  //     // view.bitmapData=viewSource.clone();
  //     // view.scaleX=view.scaleY=scale;
  //     // addChild(view);
  //     // view.x=-view.width/2;
  //     // view.y=-view.height/2;
  //     this.n=Math.PI/2;
  //     this.rotation=0;
  //   }else{
  //     //Facade.spriteC.update(this,0);

  //     //view.y=-0.5*view.height;
  //     //view.x=0.5*view.width;
  //     this.n=config.n;
  //     this.rotation=config.n*180/Math.PI;
  //   }

  //   // if (display!=null) display.gotoAndStop(1);

  //   this.turnRate=config.a/7;
  //   this.addWord();
  //   this.priority=config.p;
  // }

  public update = (speed: number) => {
    return;
    // if (this.moreUpdate()){
    //   this.vT+=((this.halt)?0:this.a)-this.vT*0.1;
    //   this.vX=this.vT*Math.cos(this.n);
    //   this.vY=this.vT*Math.sin(this.n);

    //   if (Math.abs(this.vT)<Math.abs(this.a)){
    //     this.vX=this.vY=this.vT=0;
    //   }else{
    //     this.x+=this.vX;
    //     this.y+=this.vY;
    //   }
    //   return;
    // }
    // return;
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

      // let n = Math.atan2(this.vY, this.vX);
      this.rotation = this.n + Math.PI / 2;
    }
  }

  public moveTo = (target: {x?: number, y?: number}, speed: number) => {
    this.rotateTo(target, speed);
    let aMult = speed;
    let accel = aMult * this.a;

    if (this.vT < accel) {
      this.vT += accel;
    } else {
      this.vT = accel;
    }

    this.vX = Math.cos(this.n) * this.vT;
    this.vY = Math.sin(this.n) * this.vT;

    // if (Math.abs(this.vX) < this.a * aMult && Math.abs(this.vY) < this.a * aMult) {
    //   this.vX = 0;
    //   this.vY = 0;
    // } else {
    this.x += this.vX;
    this.y += this.vY;
    // }
    // this.x += speed * Math.cos(angle);
    // this.y += speed * Math.sin(angle);
    
    // this.vT += this.a - this.vT * 0.1;
    // this.vX = this.vT * Math.cos(this.n);
    // this.vY = this.vT * Math.sin(this.n);
    
    // if (Math.abs(this.vT) < Math.abs(this.a)) {
      //   this.vX = 0;
      //   this.vY = 0;
      //   this.vT = 0;
      // } else {
        //   this.x += this.vX;
        //   this.y += this.vY;
        // }
    // this.rotation = angle + Math.PI / 2;
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

  // public getFirePoint(_local:boolean=false):PIXI.Point{
  //   //var m:Point=new Point(display.torso.x+display.torso.anim.x+display.torso.anim.firePoint.x,display.torso.y+display.torso.anim.y+display.torso.anim.firePoint.y);
  //   var m=new PIXI.Point(0,0);
  //   m.x*=display.scaleX;
  //   m.y*=display.scaleY;
  //   if (!_local){
  //     m.x+=x;
  //     m.y+=y;
  //   }
  //   return m;
  // }
}
