import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMBUI';
import { InventoryWindow } from './InventoryUI';

export class ItemObject extends JMBUI.InteractiveElement {
  public index: number = -1;
  public location: InventoryWindow;
  public type: string;

  public data: any;
  public mouseData: any;
  public offset: PIXI.Point;

  constructor(data?: any, config?: JMBUI.GraphicOptions) {
    super(config);
    this.data = data;
    this.buttonMode = true;
    this.draggable = true;
  }

  public update(data: any) {
    this.data = data;
  }

  get tooltipName(): string {
    return '';
  }

  get tooltipDesc(): string {
    return '';
  }
}
