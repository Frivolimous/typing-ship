import { GameSprite } from './GameSprite';
import * as JMBL from '../../JMGE/JMBL';
import { GameEvents } from '../data/Misc';
import { Charge } from '../../JMGE/effects/Charge';
import { ImageRepo } from '../../GraphicData';

export class PlayerShip extends GameSprite{
  static MAX_HEALTH=5;
  injured:boolean;
  shieldSize:number;
  animA:string[]=[];
  targetA:GameSprite[]=[];

  empCharge=new Charge(20,5,0xcccccc);
  laserCharge=new Charge(10,5,0x00ffff);

  constructor(){
    super();
    
    // scale=1;
    // charge=new Charge(0,-20,5,0xffffff,ActionControl.EMP);
    
    // frame=0;
    // cAnim="KERBLA!";
    
    // let graphics=new PIXI.Graphics;
    // graphics.beginFill(0x00aaaa);
    // graphics.drawCircle(0,0,30);
    // this.addChild(graphics,this.charge);

    this.makeDisplay(ImageRepo.player,0.1);
    this.addChild(this.laserCharge,this.empCharge,this.shieldView);

    this.shieldView.scale.set(0.35,0.35);
    this.firePoint.set(0,-20);
    this.laserCharge.y=this.firePoint.y;
    this.empCharge.y=this.firePoint.y;
  }

  setHealth=(i:number)=>{
		this.health=Math.max(Math.min(i,5),0);
		JMBL.events.publish(GameEvents.NOTIFY_SET_HEALTH,i);
	}

	addHealth=(i:number)=>{
		this.setHealth(this.health+i);
	}

  update=(speed:number)=>{
    if (this.laserCharge.running){
      this.laserCharge.update(speed);
    }
    if (this.empCharge.running){
      this.empCharge.update(speed);
    }
  }
}