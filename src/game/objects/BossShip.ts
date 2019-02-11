import { GameSprite } from "./GameSprite";
import { ICommand, boss0Suicides, ISpawnEvent } from "../data/LevelData";
import { CONFIG } from "../../Config";
import { Scanner } from "./Scanner";
import * as JMBL from "../../JMGE/JMBL";
import { GameEvents } from "../data/Misc";
import { GameManager } from "../GameManager";
import { EnemyShip } from "./EnemyShip";
import { ClearObject } from "./ClearObject";
import { ImageRepo } from "../../GraphicData";
import { DisplayLayer } from "../engine/ObjectManager";

export class BossShip extends GameSprite{
  commands:ICommand[]=[{x:CONFIG.INIT.STAGE_WIDTH/2,y:200,move:true},{x:CONFIG.INIT.STAGE_WIDTH/2,y:500,timer:6,move:false,fire:true}];
  scanner:Scanner;
  over:PIXI.Sprite;
  overOffset:PIXI.Point=new PIXI.Point(0,0);
  delay:number=-1;
  moveWith:GameSprite[]=[];
  hitBounds:PIXI.Rectangle;

  constructor(public bossType:number,protected manager:GameManager){
    super();
    this.health=3;
    this.wordSize=-1;
    //viewSource=SpriteSheets.boss[bossType];

    // let graphics=new PIXI.Graphics;
    // graphics.beginFill(0x00cc77);
    // graphics.drawEllipse(0,0,150,100);
    // this.addChild(graphics);

    this.x=CONFIG.INIT.STAGE_WIDTH/2;
    this.y=-50;
    // this.onWordComplete=this.scan;
  }

  dispose(){
    if (this.over){
      this.over.destroy();
      this.over=null;
    }
    this.toDestroy=true;
  }

  getRandomCollisionPoint():{x:number,y:number}{
    let point=new PIXI.Point(this.hitBounds.x+Math.random()*this.hitBounds.width,this.hitBounds.y+Math.random()*this.hitBounds.height);
    return point;
    // return {x:-75+Math.random()*75,y:-50+Math.random()*50};
  }

  update=(speed:number)=>{
    if (!this.scanner){
      if (this.commands.length<=1){``
        this.scanner=new Scanner(this);
        let loc = this.getRandomCollisionPoint();
        this.scanner.x=loc.x;
        this.scanner.y=loc.y;
        this.addChild(this.scanner);
      }
    }else{
      this.scanner.update();
    }

    this.bossUpdate(speed);
    
    this.checkNextCommand(speed);
    let diffX=0;
    let diffY=0;
    if (this.commands.length>0 && this.commands[0].move){
      let command=this.commands[0];
      let dx=command.x-this.x;
      let dy=command.y-this.y;
      let angle=Math.atan2(dy,dx);
      diffX=speed*Math.cos(angle);
      diffY=speed*Math.sin(angle);
      this.x+=diffX;
      this.y+=diffY;
    }
    this.moveWith.forEach(object=>(object.x+=diffX,object.y+=diffY));
    if (this.over){
      this.over.x=this.x+this.overOffset.x;
      this.over.y=this.y+this.overOffset.y;
    }
  }

  replaceCommands(commands:any[]){
    this.commands=commands;
  }

  checkNextCommand(speed:number){
    if (this.commands.length===0){
      this.newCommands();
    }

    let command=this.commands[0];
    if (command.move){
      if (Math.abs(this.x-command.x)>20 || Math.abs(this.y-command.y)>20){
        return;
      }
    }else{
      if (command.timer>0){
        command.timer-=speed*.4;
        return;
      }
    }

    this.commands.shift();
    // console.log(this.commands.length);
    // if (this.commands.length>0 && this.commands[0].fire){
      // this.bossFire();
    // }
  }

  scan=(lastWord?:boolean)=>{
    if (lastWord){
      this.scanner.dispose();
      this.scanner.destroy();
      this.scanner=null;
      this.injure();
    }
    // }else{
    //   this.scanner.scan();
    // }
  }


  injure=()=>{
    this.health--;
    JMBL.events.publish(GameEvents.NOTIFY_BOSS_DAMAGED,this.health);
    if (this.health===0){
      this.toDestroy=true;
      // killBoss
      // new PopScore(this,100);
// 				Facade.gameC.killBoss();
// 				if (index==0){
// 					Facade.gameUI.bossV.addChild(over);
// 				}
    }
  }

  bossUpdate(speed:number){

  }

  bossFire(){

  }

  newCommands(){

  }
}

export class BossShip0 extends BossShip{
  objects:EnemyShip[]=[];

  constructor(bossType:number,manager:GameManager){
    super(bossType,manager);

    this.makeDisplay(ImageRepo.boss0,0.5);
    this.hitBounds=new PIXI.Rectangle(-150,-30,300,60);

    this.over=PIXI.Sprite.fromImage(ImageRepo.boss0Over0);
    this.over.anchor.set(0.5);
    this.over.scale.set(0.5);
    this.overOffset.set(-3,14);
    manager.container.layers[DisplayLayer.EXPLOSIONS].addChild(this.over);
  }

  bossUpdate(speed:number){
    if (this.delay>0){
      if (this.delay===10){
        if (this.objects.length===0){
          // this.over.animateTo(1);
        }
      }else if (this.delay===1){
        if (this.objects.length>0){
          // this.over.animateTo(2);
        }else{
          // this.over.animateTo(0);
        }
      }
      this.delay-=speed;
    }else{
      if (this.objects.length>0){
        while(true){
          if (this.objects[0].config.commands.length<=1||this.objects[0].toDestroy){
            console.log("GONE");
            this.objects.shift();
            if (this.objects.length===0){
              this.manager.container.layers[DisplayLayer.EXPLOSIONS].addChild(this.over);
            }
            break;
          }else{
            break;
          }
        }
      }
      if (this.objects.length===0){
        this.delay=20;
      }
    }
  }

  bossFire(){
    console.log("FIRE!");
    let a=boss0Suicides();
    while (a.length>0){
      let newShip=this.manager.addEnemy(a.shift().spawnEvent);
      
      this.objects.push(newShip);
    }
    this.manager.container.layers[DisplayLayer.PROJECTILES].addChild(this.over);
    this.delay=20;
    
    // over.bitmapData=SpriteSheets.bRes[0][1];
  }

  newCommands(){
    this.bossFire();
    this.commands.push({x:CONFIG.INIT.STAGE_WIDTH/2,y:500,timer:480,move:false,fire:true});
  }
}

export class BossShip1 extends BossShip{
  firePoints=[{x:2.3,y:3},{x:4,y:4},{x:5,y:3.5},{x:6,y:3.5},{x:7,y:4},{x:9.7,y:3}];

  constructor(bossType:number,manager:GameManager){
    super(bossType,manager);

    this.makeDisplay(ImageRepo.boss1,0.5);
    this.hitBounds=new PIXI.Rectangle(-150,-30,300,60);
  }

  bossUpdate(speed:number){
    if (this.delay<=0){
      this.delay=36;
    }else{
      this.delay-=speed;
      if (this.delay===35){
        // this.over.visible=true;
      }else if (this.delay===20){
        // this.over.visible=false;
      }
    }
  }

  bossFire(){
    let point=this.firePoints[Math.floor(Math.random()*6)];
    let spawn:ISpawnEvent={type:this.health>1?"nln":"nls",x:point.x,y:point.y,commands:[{timer:this.health>1?21:23},{timer:20,fire:true}]};
    let e=this.manager.addEnemy(spawn);
  }
  newCommands(){
    this.bossFire();
    this.commands.push({x:CONFIG.INIT.STAGE_WIDTH/2,y:500,timer:138+this.health*18,move:false,fire:true});
  }
}

export class BossShip2 extends BossShip{
  objects:GameSprite[]=[];
  shieldCount=0;

  constructor(bossType:number,manager:GameManager){
    super(bossType,manager);

    this.makeDisplay(ImageRepo.boss2,0.5);
    this.hitBounds=new PIXI.Rectangle(-150,-30,300,60);
  }

  addPlayerShield=()=>{
    this.shieldCount++;
    if (this.shieldCount===1){
      this.manager.player.addShield(0.2);
    }else{
      this.manager.player.shieldTo(0.2*this.shieldCount);
    }
  }

  makeCounter(x:number,y:number){
    let object=new ClearObject(11-this.health,this.addPlayerShield);
    object.x=this.manager.player.x+x-5;
    object.y=this.manager.player.y+y;

    this.objects.unshift(object);
    this.manager.container.addObject(object);
  }
    
  bossUpdate(speed:number){
    if (this.delay>=0){
      switch(this.delay){
        case 215: this.makeCounter(30,20); break;
        case 210: this.makeCounter(-75,20); break;
        case 205: this.makeCounter(30,-20); break;
        case 200: this.makeCounter(-75,-20); break;
        case 180:
          // view.bitmapData=SpriteSheets.bRes[2][0][1];
          // Facade.soundC.sound(SoundControl.BOSS_CHARGE);
          break;
        case 140: 
          // view.bitmapData=SpriteSheets.bRes[2][0][2];
          // Facade.soundC.sound(SoundControl.BOSS_CHARGE);
          break;
        case 100:
          // Facade.gameUI.bossV.addChildAt(over,0);
          // if (count>0){
          //   over.bitmapData=SpriteSheets.bRes[index][1][1];
          // }
          // Facade.soundC.sound(SoundControl.BOSS_FIRE);
          break;
        default:
          if (this.delay<75){
            if (this.delay%5===0){
              if (this.shieldCount===0){
                //explode
              }else{
                // over.bitmapData=SpriteSheets.bRes[index][1][(Math.floor(delay/5)%3)+1];
              }
            }
            if (this.delay%20===0){
              if (this.delay>0){
                // Facade.soundC.sound(SoundControl.BOSS_FIRE);
              }
              if (this.shieldCount>0){
                this.shieldCount--;
                if (this.shieldCount===0){
                  this.manager.player.removeShield();
                  // over.bitmapData=SpriteSheets.bRes[index][1][0];
                }else{
                  this.manager.player.shieldTo(this.shieldCount*0.2);
                }
              }else{
                this.manager.player.addHealth(-1);
              }
            }
            if (this.delay===0){
              this.manager.player.removeShield();
              // this.over.parent.removeChild(over);
              // view.bitmapData=SpriteSheets.boss[2];
              while(this.objects.length>0){
                this.objects.shift().dispose();
              }
            }
          }
      }
      // console.log(this.delay,speed);
      this.delay-=0.5;
    }
  }

  bossFire(){
    this.shieldCount=0;
    this.delay=220;
    // view.bitmapData=SpriteSheets.bRes[2][0][0];
    // Facade.soundC.sound(SoundControl.BOSS_CHARGE);
  }

  newCommands(){
    this.bossFire();
    this.commands.push({x:CONFIG.INIT.STAGE_WIDTH/2,y:500,timer:820,move:false,fire:true});
  }
}