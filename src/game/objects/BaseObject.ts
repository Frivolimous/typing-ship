import { TextObject } from "../text/TextObject";
import { DisplayLayer } from "../engine/ObjectManager";
import { GameEvents } from "../data/Misc";
import * as JMBL from "../../JMGE/JMBL";

export class BaseObject extends PIXI.Container{
  public layer:DisplayLayer=DisplayLayer.DEFAULT;
  public display:PIXI.Sprite;
  public toDestroy:boolean=false;
  
  public textObject:TextObject;
  public wordSize:number=-1;
  // public wordOffset:{x:number,y:number}=new PIXI.Point(0,0);
  wordOffset=new PIXI.Point(0,0);
  public priority:number=0;
  public onWordComplete:(e:BaseObject)=>void;

  makeDisplay(image:string,scale:number){
    this.display=PIXI.Sprite.fromImage(image);
    this.display.anchor.set(0.5);
    this.display.scale.set(scale);
    this.addChild(this.display);
  }

  update=(speed:number)=>{
  }

  getDistance=(p:{x:number,y:number})=>{
    let dx=p.x-this.x;
    let dy=p.y-this.y;

    return Math.sqrt(dx*dx+dy*dy);
  }

  dispose(){
    this.toDestroy=true;
  }

  addWord(i:number=0,priority:number=1){
    this.priority=priority;
    
    if (i<=0) i=this.wordSize;
    if(i>=0){
      if (!this.textObject){
        this.textObject=new TextObject((i===0)?this.wordSize:i,this.priority,this,this.wordComplete);
      }else{
        this.textObject.newWord(i===0?this.wordSize:i)
      }
    }
  }

  wordComplete=()=>{
    JMBL.events.publish(GameEvents.NOTIFY_OBJECT_WORD_COMPLETED,this);
    if (this.onWordComplete){
      this.onWordComplete(this);
    }
  }
}