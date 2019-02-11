import { ILevelEvent, ISpawnEvent, getLevel, EventType, getBossLoop } from "../data/LevelData";
import { BossShip } from "../objects/BossShip";

export class EventInterpreter{
  DISTANCE_MULT:number=0.0002;

  level:number;
  data:ILevelEvent[];
  wpm:number;
  finalDistance:number;
  distance:number;
  boss:BossShip;

  constructor(private addShipCallback:(spawn:ISpawnEvent)=>void,private addBossCallback:(bossType:number)=>BossShip){

  }

  loadLevel(level:number,wpm:number){
    this.level=level;
    this.wpm=wpm;
    this.data=getLevel(level,wpm);
    // console.log(JSON.stringify(this.data));
    this.finalDistance=this.data[this.data.length-1].distance;
    this.distance=0;
  }

  loadBossLoop(bossType:number){
    this.data=getBossLoop(bossType,this.wpm);
    this.data.forEach(event=>event.distance+=this.distance);
  }

  addDistance(inc:number):number{
    this.distance+=inc*this.DISTANCE_MULT;
    while(this.data.length>0 && this.distance>this.data[0].distance){
      let nextEvent=this.data.shift();

      switch(nextEvent.type){
        case EventType.JUMP: this.distance+=nextEvent.jumpIndex; break;
        case EventType.LOOP: 
          let tArray:ILevelEvent[]=getLevel(this.level,this.wpm).splice(nextEvent.jumpIndex);
          this.data=this.data.concat(tArray);
          break;
        case EventType.SPAWN:
          // Facade.gameM.totalShips+=1;
          this.addShipCallback(nextEvent.spawnEvent);
          break;
        case EventType.BOSS: this.boss=this.addBossCallback(nextEvent.bossType); break;
        case EventType.WAIT: break;
      }
    }
    if (this.boss){
      if (this.boss.toDestroy){
        this.boss=null;
        this.data=[];
      }else{
        if (this.data.length===0 && this.boss.commands.length===0){
          this.loadBossLoop(this.boss.bossType);
        }
      }
    }
    return this.distance;
  }

  isComplete():boolean{
    if (this.boss){
      return false;
    }
    return (this.data.length===0);
  }
}