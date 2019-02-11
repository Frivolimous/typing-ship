import * as JMBUI from '../JMGE/JMBUI'
import * as JMBL from '../JMGE/JMBL'
import { BuildingData, SpellData } from '../TDDR/data/ObjectData';
import { CONFIG } from '../Config';
import { IInventoryUI, InventoryWindow, ItemObject } from '../JMGE/UI/InventoryUI'
import { SaveData } from '../utils/SaveData';
import { MenuUI } from './MenuUI';
import { ExtrinsicModel } from '../TDDR/data/PlayerData';
import { BaseUI } from '../JMGE/UI/BaseUI';

const dCardConfig:JMBUI.GraphicOptions={
    width:45, height:95, bgColor:0xff0000
}

const dSpellCardConfig:JMBUI.GraphicOptions={
    width:45, height:95, bgColor:0x0000ff
}

export class TowerSelectUI extends BaseUI{
    deckWindow:InventoryWindow;
    storageWindow:InventoryWindow;

    spellDeckWindow:InventoryWindow;
    spellStorageWindow:InventoryWindow;

    constructor(){
        super({width:CONFIG.INIT.STAGE_WIDTH,height:CONFIG.INIT.STAGE_HEIGHT,bgColor:0x666666});
        let extrinsic:ExtrinsicModel=SaveData.getExtrinsic();
        
        this.deckWindow=new InventoryWindow({dragLayer:this,numSlots:6,numAcross:6,padding:5,startX:5,startY:5,slotOptions:{width:50,height:100,bgColor:0xf1f1f1,alpha:0.3}});
        this.deckWindow.equipFunction=extrinsic.addTowerToDeck;
        this.deckWindow.unequipFunction=extrinsic.removeTowerFromDeck;
        this.deckWindow.x=50;
        this.deckWindow.y=20;
        
        this.addChild(this.deckWindow);

        this.storageWindow=new InventoryWindow({dragLayer:this,numSlots:48,numAcross:24,padding:5,startX:5,startY:5,slotOptions:{width:50,height:100,bgColor:0xf1f1f1,alpha:0.3}});
        let storageScroll=new JMBUI.MaskedWindow(this.storageWindow,{width:350,height:220,horizontal:true});
        storageScroll.x=20;
        storageScroll.y=200;
        this.addChild(storageScroll);
        this.deckWindow.linkWindows(this.storageWindow);
        
        let scrollbar=new JMBUI.Scrollbar({width:350,height:20,horizontal:true});
        scrollbar.x=20;
        scrollbar.y=220+200;
        this.addChild(scrollbar);
        storageScroll.updateScrollHeight();
        storageScroll.addScrollbar(scrollbar);
        
        for (let i=0;i<extrinsic.data.towerDeck.length;i++){
            if (!extrinsic.data.towerDeck[i]) continue;
            let item=new ItemObject(extrinsic.data.towerDeck[i],JMBL.utils.default({label:BuildingData.buildings[extrinsic.data.towerDeck[i]].name},dCardConfig));
            this.addChild(item);
            this.deckWindow.addItemAt(item,i);
        }
        for (let i=0;i<extrinsic.data.towers.length;i++){
            if (extrinsic.data.towerDeck.indexOf(extrinsic.data.towers[i])===-1){
                let item=new ItemObject(extrinsic.data.towers[i],JMBL.utils.default({label:BuildingData.buildings[extrinsic.data.towers[i]].name},dCardConfig));
                this.addChild(item);
                this.storageWindow.addItem(item);
            }
        }

        this.spellDeckWindow=new InventoryWindow({dragLayer:this,numSlots:2,numAcross:2,padding:5,startX:5,startY:5,slotOptions:{width:50,height:100,bgColor:0xf1f1f1,alpha:0.3}});
        this.spellDeckWindow.equipFunction=extrinsic.addSpellToDeck;
        this.spellDeckWindow.unequipFunction=extrinsic.removeSpellFromDeck;
        this.spellDeckWindow.x=450;
        this.spellDeckWindow.y=20;
        
        this.addChild(this.spellDeckWindow);
        
        this.spellStorageWindow=new InventoryWindow({dragLayer:this,numSlots:8,numAcross:4,padding:5,startX:5,startY:5,slotOptions:{width:50,height:100,bgColor:0xf1f1f1,alpha:0.3}});
        this.spellStorageWindow.x=450;
        this.spellStorageWindow.y=200;

        this.addChild(this.spellStorageWindow);
        this.spellDeckWindow.linkWindows(this.spellStorageWindow);

        for (let i=0;i<extrinsic.data.spellDeck.length;i++){
            if (!extrinsic.data.spellDeck[i]) continue;
            let item=new ItemObject(extrinsic.data.spellDeck[i],JMBL.utils.default({label:SpellData.spells[extrinsic.data.spellDeck[i]].name},dSpellCardConfig));
            this.addChild(item);
            this.spellDeckWindow.addItemAt(item,i);
        }
        for (let i=0;i<extrinsic.data.spells.length;i++){
            if (extrinsic.data.spellDeck.indexOf(extrinsic.data.spells[i])===-1){
                let item=new ItemObject(extrinsic.data.spells[i],JMBL.utils.default({label:SpellData.spells[extrinsic.data.spells[i]].name},dSpellCardConfig));
                this.addChild(item);
                this.spellStorageWindow.addItem(item);
            }
        }

        let _button:JMBUI.Button=new JMBUI.Button({width:100,height:30,x:CONFIG.INIT.STAGE_WIDTH-120,y:CONFIG.INIT.STAGE_HEIGHT-50,label:"Menu",output:this.leave});
		this.addChild(_button);
    }

    leave=()=>{
        this.navBack();
    }
}

class largeView extends JMBUI.InteractiveElement{
    
}