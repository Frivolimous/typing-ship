import { GameSprite } from "./GameSprite";
import { ImageRepo } from "../../GraphicData";
import { Laser } from "../../JMGE/effects/Laser";
import { ActionType } from "../data/Misc";

export class Turret extends GameSprite{

  constructor(){
		super();
		this.wordSize=3;
    this.addWord(3,0);
    this.killBy=ActionType.LASER;

    this.makeDisplay(ImageRepo.turret,0.1);
  }

  targetInRange(target:GameSprite):boolean{
    this.rotation=Math.atan2(target.y-(this.y+this.parent.y),target.x-(this.x+this.parent.x));
  
    if (Math.sqrt((target.y-this.parent.y)*(target.y-this.parent.y)+(target.x-this.parent.x)*(target.x-this.parent.x))<100){
      // Facade.actionC.shootLaser(parent,target,true);
      // (this.parent as GameSprite).addWord();
      return true;
    }else{
      return false;
    }
  }

  // makeLaserTo(object:GameSprite){
  //   let laser=new Laser(this.parent,object,0x00ff00,1);
  // }
}