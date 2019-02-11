import { BaseObject } from "./BaseObject";
import { Shield } from "./Shield";
import { Turret } from "./Turret";

export enum Animation{
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

export class GameSprite extends BaseObject{
  vX:number=0;
  vY:number=0;
  vT:number=0;
  n:number;
  a:number;
  value:number;
  killBy:number;
  turnRate:number;
  shieldOn:boolean;
  turret:Turret;
  halt:boolean;
  viewSource:any;
  fires:number;
  walkMult:number=1;
  legFrame:number=0;
  torsoFrame:number=0;
  frame:number=0;
  cAnim:Animation=Animation.IDLE;
  health:number=1;
  shieldView:Shield=new Shield();
  firePoint:PIXI.Point=new PIXI.Point(0,0);

  constructor(){
    super();
    this.addChild(this.shieldView);
  }

  getFirePoint():PIXI.Point{
    let cos=Math.cos(this.rotation);
		let sin=Math.sin(this.rotation);
		let x=this.x+this.firePoint.x*cos-this.firePoint.y*sin;
    let y=this.y+this.firePoint.x*sin+this.firePoint.y*cos;
    return new PIXI.Point(x,y);
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
  
  update=(speed:number)=>{
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
  
  public moreUpdate():boolean{
    return true;
  }
  
  public homeTarget(_target:BaseObject){
    var tDiff:number=Math.atan2(_target.y-this.y,_target.x-this.x)-this.n;
    while (tDiff<(0-Math.PI)){
      tDiff+=2*Math.PI;
    }
    while (tDiff>Math.PI){
      tDiff-=2*Math.PI;
    }
    
    if (tDiff>0){
      this.n+=(tDiff>this.turnRate)?this.turnRate:tDiff;
    }else if (tDiff<0){
      this.n+=(tDiff<-this.turnRate)?(0-this.turnRate):tDiff;
    }else{
      return;
    }
  }

  addShield(alpha:number=1){
    this.shieldOn=true;
    this.shieldView.fadeIn(alpha);
  }

  shieldTo(alpha:number){
    this.shieldOn=true;
    this.shieldView.fadeTo(alpha);
  }

  removeShield(){
    if (this.shieldOn){
      this.shieldOn=false;
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