import * as JMBUI from '../JMGE/JMBUI'
import * as JMBL from '../JMGE/JMBL'
import { MenuUI } from './MenuUI'
import { CONFIG } from '../Config';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { GameManager } from '../game/GameManager';
import { DifficultyPopup } from './DifficultyPopup';

export class LevelSelectUI extends BaseUI{
  currentLevel:number=0;
  currentDifficulty:number=1;
  NUMSHOWN:number=3;
  C_SHOWN:number=0;
  nextB:JMBUI.Button;
  prevB:JMBUI.Button;
  difficultyPopup:DifficultyPopup;

  constructor(){
    super({width:CONFIG.INIT.STAGE_WIDTH,height:CONFIG.INIT.STAGE_HEIGHT,bgColor:0x666666});

    let _button:JMBUI.Button=new JMBUI.Button({width:100,height:30,x:20,y:CONFIG.INIT.STAGE_HEIGHT-50,label:"Menu",output:this.leave});
    this.addChild(_button);
    _button=new JMBUI.Button({width:100,height:30,x:CONFIG.INIT.STAGE_WIDTH-120,y:CONFIG.INIT.STAGE_HEIGHT-50,label:"Start",output:this.startGame});
    this.addChild(_button);
    for (let i=0;i<12;i++){
      this.makeLevelButton(i,5+Math.floor(i/6)*60,20+(i%6)*40);
    }
  }

  makeLevelButton(i:number,x:number,y:number){
    let _button:JMBUI.Button=new JMBUI.Button({width:50,height:30,x,y,label:"Level "+i,output:()=>this.changeLevelAndStartGame(i,_button)});
    this.addChild(_button);
  }

  changeLevelAndStartGame=(level:number,button:PIXI.Container)=>{
    this.currentLevel=level;
    if (this.difficultyPopup){
      this.difficultyPopup.destroy();
    }
    this.difficultyPopup=new DifficultyPopup(100,this.changeDifficultyAndStartGame);
    this.difficultyPopup.x=button.x+50;
    this.difficultyPopup.y=button.y+30;
    this.addChild(this.difficultyPopup);
    // this.startGame();
  }

  changeDifficultyAndStartGame=(difficulty:number)=>{
    this.currentDifficulty=difficulty;
    this.startGame();
  }

  startGame=()=>{
    this.navForward(new GameManager(this.currentLevel,this.currentDifficulty));
    if (this.difficultyPopup){
      this.difficultyPopup.destroy();
      this.difficultyPopup=null;
    }
  }

  leave=()=>{
    this.navBack();
  }
}