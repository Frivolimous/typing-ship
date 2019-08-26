import * as JMBUI from '../JMBUI';
import * as JMBL from '../JMBL';
import { ItemObject } from './ItemObject';
import { ItemSlot } from './ItemSlot';
import { JMInteractionEvents } from '../events/JMInteractionEvents';

export interface IInventoryUI extends JMBUI.GraphicOptions {
  dragLayer: PIXI.Container;
  slotOptions: JMBUI.GraphicOptions;
  numSlots: number;
  numAcross: number;
  padding: number;
  startX: number;
  startY: number;
  equipFunction?: (data: any, index: number) => void;
  unequipFunction?: (data: any, index: number) => void;
  alsoUpdate?: () => void;
  locked?: boolean;
}

function baseEquipFunction(data: any, index: number) {
  this.applyData(data);
  this.inventory[index] = data;
}

function baseUnequipFunction(data: any, index: number) {
  this.removeData(data);
  this.inventory[index] = null;
}

export class InventoryWindow extends JMBUI.BasicElement {
  public slots: ItemSlot[] = [];
  public equipFunction: (data: any, index: number) => void;
  public unequipFunction: (data: any, index: number) => void;
  public alsoUpdate: () => void;
  public locked: boolean;

  public slotStart: PIXI.Point;
  public slotWidth: number;
  public slotHeight: number;

  public otherInventory: InventoryWindow;
  public dragLayer: PIXI.Container;

  constructor(public options: IInventoryUI) {
    super(options);

    this.dragLayer = options.dragLayer;
    this.equipFunction = options.equipFunction;
    this.unequipFunction = options.unequipFunction;
    this.alsoUpdate = options.alsoUpdate;
    this.locked = options.locked;
    this.slotStart = new PIXI.Point(options.startX - options.padding / 2, options.startY - options.padding / 2);
    this.slotWidth = options.slotOptions.width + options.padding;
    this.slotHeight = options.slotOptions.height + options.padding;

    for (let i: number = 0; i < options.numSlots; i++) {
      this.slots[i] = new ItemSlot(i, this, null, options.slotOptions);
      this.slots[i].x = options.startX + (i % options.numAcross) * this.slotWidth;
      this.slots[i].y = options.startY + Math.floor(i / options.numAcross) * this.slotHeight;
      this.addChild(this.slots[i]);
    }

    JMInteractionEvents.MOUSE_DOWN.addListener(this.mouseDown);
  }

  public getHeight = (): number => {
    return this.slotStart.y + this.slotHeight * Math.floor(this.options.numSlots / this.options.numAcross);
  }

  public getWidth = (): number => {
    return this.slotStart.x + this.slotWidth * (this.options.numAcross);
  }

  public linkWindows(window: InventoryWindow) {
    this.otherInventory = window;
    window.otherInventory = this;
  }

  public mouseDown = (e: JMBL.MouseObject) => {
    // let local:PIXI.Point=new PIXI.Point(e.x-this.x,e.y-this.y);
    let index: number = this.getIndexAtLoc(e.x, e.y);
    if (this.slots[index]) {
      let item: ItemObject = this.slots[index].stored;
      if (item) {
        // this.addChild(item);
        // item.x+=this.slots[index].x;
        // item.y+=this.slots[index].y;
        // item.parent.addChild(item);
        this.dragLayer.addChild(item);
        e.startDrag(item, this.moveDrag, this.endDrag, null, new PIXI.Point(-item.getWidth() / 2, -item.getHeight() / 2));
        this.moveDrag(item, e);

      }
    }
  }

  public moveDrag = (object: ItemObject, e: JMBL.MouseObject) => {
    // let global:PIXI.Point=this.toGlobal(new PIXI.Point(e.x-this.x+e.drag.offset.x,e.y-this.y+e.drag.offset.y));
    // object.x=global.x;
    // object.y=global.y;
    // object.x=e.x-this.x+e.drag.offset.x;
    // object.y=e.y-this.y+e.drag.offset.y;
    object.x = e.x + e.drag.offset.x;
    object.y = e.y + e.drag.offset.y;
    return true;
  }

  public endDrag = (object: ItemObject, e: JMBL.MouseObject) => {
    let index: number = this.getIndexAtLoc(e.x, e.y);
    if (this.slots[index]) {
      this.dropItem(object, index);
    } else {
      index = this.otherInventory.getIndexAtLoc(e.x, e.y);
      if (this.otherInventory.slots[index]) {
        this.otherInventory.dropItem(object, index);
      } else {
        this.returnItem(object);
      }
    }
    return true;
  }

  public getIndexAtLoc(x: number, y: number): number {
    let local: PIXI.Point = this.toLocal(new PIXI.Point(x, y));
    if (local.x < this.slotStart.x || (local.x - this.slotStart.x) / this.slotWidth > this.options.numAcross) {
      return -1;
    }
    return Math.floor((local.x - this.slotStart.x) / this.slotWidth) + Math.floor((local.y - this.slotStart.y) / this.slotHeight) * this.options.numAcross;
  }

  public getLocAtIndex(index: number): PIXI.Point {
    return new PIXI.Point(this.slotStart.x + (index % this.options.numAcross + 0.5) * this.slotWidth,
      this.slotStart.y + (Math.floor(index / this.options.numAcross) + 0.5) * this.slotHeight);
  }

  public clear() {
    for (let i: number = 0; i < this.slots.length; i++) {
      if (this.slots[i].stored) {
        this.removeItemAt(i).destroy();
      }
    }
  }

  public addItem(item: ItemObject): boolean {
    for (let i: number = 0; i < this.slots.length; i++) {
      if (!this.slots[i].stored) {
        this.addItemAt(item, i);
        return true;
      }
    }

    return false;
  }

  public addItemAt = (item: ItemObject, index: number): boolean => {
    if (!item || index === -1) {
      return true;
    }

    if (this.slots[index].stored) {
      // if (hasCharges) addCharges();
      this.removeItemAt(index); // .destroy();
    }

    this.slots[index].stored = item;
    item.index = index;
    item.location = this;
    let loc: PIXI.Point = this.getLocAtIndex(index);
    item.x = loc.x - item.getWidth() / 2;
    item.y = loc.y - item.getHeight() / 2;
    this.addChild(item);
    // let global:PIXI.Point=this.toGlobal(this.getLocAtIndex(index));
    // let global2:PIXI.Point=item.parent.toGlobal(new PIXI.Point(0,0));
    // console.log(global2);
    // item.x=global.x-item.getWidth()/2;
    // item.y=global.y-item.getHeight()/2;
    // this.addChild(item);
    if (this.equipFunction) {
      this.equipFunction(item.data, index);
    }

    return true;
  }

  public removeItem(item: ItemObject): ItemObject {
    if (item.location !== this) {
      return null;
    }
    return this.removeItemAt(item.index);
    // return this.slots[item.index].removeItem();
  }

  public removeItemAt(index: number): ItemObject {
    let m: ItemObject = this.slots[index].stored;
    this.slots[index].stored = null;
    if (this.unequipFunction) {
      this.unequipFunction(m.data, index);
    }
    return m;
    // return this.slots[index].removeItem();
  }

  public check(item: ItemObject, index: number): boolean {
    return this.slots[index].check(item);
  }

  public returnItem(item: ItemObject) {
    if (this.slots[item.index].stored === item) {
      // this.slots[item.index].addItem(item);
      item.location.addItemAt(item, item.index);
    } else {
      this.addItemAt(item, item.index);
    }
  }

  public dropItem(item: ItemObject, index: number) {
    let prevLocation: InventoryWindow = item.location;
    let prevIndex: number = item.index;

    if (!this.check(item, index)) {
      prevLocation.returnItem(item);
      return;
    }

    if (!prevLocation.removeItem(item)) {
      prevLocation.returnItem(item);
      return;
    }

    let item2: ItemObject = this.slots[index].stored;

    if (this.slots[index].stored) {
      // stack Charges?
      // return
      item2 = this.removeItemAt(index);
      this.addItemAt(item, index);
      if (prevLocation.check(item2, prevIndex) && !prevLocation.slots[prevIndex].stored) {
        prevLocation.addItemAt(item2, prevIndex);
      } else if (!prevLocation.addItem(item2)) {
        if (!this.addItem(item2)) {
          this.removeItemAt(index);
          item.index = prevIndex;
          prevLocation.returnItem(item);
          this.addItemAt(item2, index);
        }
      }
    } else {
      this.addItemAt(item, index);
    }
    if (this.alsoUpdate) {
      this.alsoUpdate();
    }
  }
}
