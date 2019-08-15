import * as JMBUI from '../JMBUI';
import { ItemObject } from './ItemObject';
import { InventoryWindow } from './InventoryUI';

export class ItemSlot extends JMBUI.InteractiveElement {
  public stored: ItemObject;
  public type: string;

  constructor(index: number, location: InventoryWindow, type?: string, options?: JMBUI.GraphicOptions) {
    super(options || {});
    this.type = type;
    this.interactive = false;
  }

  public check(item: ItemObject): boolean {
    if (this.disabled) {
      return false;
    }

    if (this.type && item.type && this.type !== item.type) {
      return false;
    }

    // check type?

    return true;
  }

  public toggleDisabled(b: boolean) {
    if (b) {
      this.setDisplayState(JMBUI.DisplayState.DARKENED);
      this.disabled = true;
    } else if (b === false) {
      this.setDisplayState(JMBUI.DisplayState.NORMAL);
      this.disabled = false;
    } else {
      this.toggleDisabled(!this.disabled);
    }
  }
}
