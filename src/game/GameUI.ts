import { CONFIG } from "../Config";
import * as JMBL from "../JMGE/JMBL";
import { FlyingText } from "../JMGE/effects/FlyingText";
import { Gauge } from "../JMGE/JMBUI";
import { TextObject } from "./text/TextObject";
import { GameEvents, ISetProgress } from "./data/Misc";

export class GameUI extends PIXI.Container{
  private wordDisplay:PIXI.Text;
  private progress:PIXI.Text;
  private score:PIXI.Text;
   healthBar:Gauge;

  constructor(){
    super();
    this.wordDisplay=new PIXI.Text("",{fontSize:16,fontFamily:"Arial",fill:0xffaaaa,stroke:0,strokeThickness:2});
		this.addChild(this.wordDisplay);
    this.wordDisplay.y=CONFIG.INIT.SCREEN_HEIGHT-50;
    
    this.progress=new PIXI.Text("",{fontSize:16,fontFamily:"Arial",fill:0xaaffaa,stroke:0,strokeThickness:2});
    this.addChild(this.progress);
    this.progress.y=CONFIG.INIT.SCREEN_HEIGHT-50;
    this.progress.x=CONFIG.INIT.SCREEN_WIDTH-100;

    this.score=new PIXI.Text("0",{fontSize:16,fontFamily:"Arial",fill:0xaaffaa,stroke:0,strokeThickness:2});
    this.score.y=CONFIG.INIT.SCREEN_HEIGHT-100;
    this.addChild(this.score);

    this.healthBar=new Gauge(0xff0000);
    this.healthBar.x=(CONFIG.INIT.SCREEN_WIDTH-this.healthBar.getWidth())/2;
    this.healthBar.y=CONFIG.INIT.SCREEN_HEIGHT-50;
    this.addChild(this.healthBar);

    JMBL.events.ticker.add(this.update);
    JMBL.events.add(GameEvents.NOTIFY_UPDATE_INPUT_WORD,this.updateText);
    JMBL.events.add(GameEvents.NOTIFY_LETTER_DELETED,this.showMinusText);
    JMBL.events.add(GameEvents.NOTIFY_SET_SCORE,this.setScore);
    JMBL.events.add(GameEvents.NOTIFY_SET_PROGRESS,this.updateProgress);
    JMBL.events.add(GameEvents.NOTIFY_SET_HEALTH,this.setPlayerHealth);
  }

  dispose(){
    JMBL.events.ticker.remove(this.update);
    JMBL.events.remove(GameEvents.NOTIFY_UPDATE_INPUT_WORD,this.updateText);
    JMBL.events.remove(GameEvents.NOTIFY_LETTER_DELETED,this.showMinusText);
    JMBL.events.remove(GameEvents.NOTIFY_SET_SCORE,this.setScore);
    JMBL.events.remove(GameEvents.NOTIFY_SET_PROGRESS,this.updateProgress);
    JMBL.events.remove(GameEvents.NOTIFY_SET_HEALTH,this.setPlayerHealth);
    this.destroy();
  }

  update=()=>{
    
  }

  updateProgress=(e:ISetProgress)=>{
    let progress=Math.min(100,Math.round(e.current/e.total*100));
    this.progress.text=String(progress)+"%";
  }

  updateText=(s:string)=>{
    this.wordDisplay.text=s;
  }

  showMinusText=()=>{
    new FlyingText("-1",{fontFamily:"Arial",fontSize:14,fill:0xff0000},this.wordDisplay.x+this.wordDisplay.width,this.wordDisplay.y,this);
  }

  setScore=(score:number)=>{
    this.score.text=String(score);
  }

  setPlayerHealth=(i:number)=>{
    this.healthBar.setValue(i,5);
  }

  addHealWord=(healWord:TextObject)=>{
    this.addChild(healWord);
    healWord.x=this.healthBar.x+this.healthBar.getWidth();
    healWord.y=this.healthBar.y+this.healthBar.getHeight();
  }
}