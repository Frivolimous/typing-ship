import * as JMBUI from '../JMGE/JMBUI'
import * as JMBL from '../JMGE/JMBL'
import { CONFIG } from '../Config';
import { IInventoryUI, InventoryWindow, ItemObject } from '../JMGE/UI/InventoryUI'
import { SaveData } from '../utils/SaveData';
import { MenuUI } from './MenuUI';
import { TextureData } from '../GraphicData'
import { BadgeState } from '../game/data/PlayerData';
import { BaseUI } from '../JMGE/UI/BaseUI';

export class BadgesUI extends BaseUI{
  deckWindow:InventoryWindow;
  storageWindow:InventoryWindow;

  spellDeckWindow:InventoryWindow;
  spellStorageWindow:InventoryWindow;

  constructor(){
    super({width:CONFIG.INIT.STAGE_WIDTH,height:CONFIG.INIT.STAGE_HEIGHT,bgColor:0x666666});
    
    let _button:JMBUI.Button=new JMBUI.Button({width:100,height:30,x:CONFIG.INIT.STAGE_WIDTH-120,y:CONFIG.INIT.STAGE_HEIGHT-50,label:"Menu",output:this.leave});
    this.addChild(_button);
    let scrollCanvas=new PIXI.Container;
    let scroll=new JMBUI.MaskedWindow(scrollCanvas,{x:20,y:20,width:300,height:300,autoSort:true});
    let scrollbar=new JMBUI.Scrollbar({height:300,x:320,y:20});
    scroll.addScrollbar(scrollbar);
    this.addChild(scroll);
    this.addChild(scrollbar);
    let badge=new BadgeLine("EMPTY",BadgeState.NONE);
    scroll.addObject(badge);
    badge=new BadgeLine("EMPTY",BadgeState.BRONZE);
    scroll.addObject(badge);
    badge=new BadgeLine("EMPTY",BadgeState.SILVER);
    scroll.addObject(badge);
    badge=new BadgeLine("EMPTY",BadgeState.GOLD);
    scroll.addObject(badge);
    badge=new BadgeLine("EMPTY",BadgeState.PLATINUM);
    scroll.addObject(badge);
    badge=new BadgeLine("EMPTY",BadgeState.PLATINUM);
    scroll.addObject(badge);
    badge=new BadgeLine("EMPTY",BadgeState.PLATINUM);
    scroll.addObject(badge);
  }

  leave=()=>{
    this.navBack();
  }
}

class BadgeLine extends JMBUI.BasicElement{
  symbol:PIXI.Sprite;
  constructor(label:string="Hello World!",state:BadgeState=BadgeState.NONE){
    super({width:100,height:50,label:label});
    this.symbol=new PIXI.Sprite(TextureData.medal);
    // this.symbol.anchor.set(0.5,0.5);
    // this.symbol.x=-15;
    // this.symbol.y=this.getHeight()/2;
    this.label.x=30;
    this.addChild(this.symbol);
    this.setState(state);
  }

  setState(state:BadgeState){
    this.symbol.tint=state;
  }
}