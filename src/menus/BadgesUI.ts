import * as JMBUI from '../JMGE/JMBUI';
import * as JMBL from '../JMGE/JMBL';
import { CONFIG } from '../Config';
import { IInventoryUI, InventoryWindow } from '../JMGE/UI/InventoryUI';
import { SaveData } from '../utils/SaveData';
import { MenuUI } from './MenuUI';
import { TextureData } from '../TextureData';
import { BadgeState } from '../game/data/PlayerData';
import { BadgeLine } from './BadgeLine';
import { BaseUI } from '../JMGE/UI/BaseUI';

export class BadgesUI extends BaseUI {
  public deckWindow: InventoryWindow;
  public storageWindow: InventoryWindow;

  public spellDeckWindow: InventoryWindow;
  public spellStorageWindow: InventoryWindow;

  constructor() {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666 });

    let _button: JMBUI.Button = new JMBUI.Button({ width: 100, height: 30, x: CONFIG.INIT.SCREEN_WIDTH - 120, y: CONFIG.INIT.SCREEN_HEIGHT - 50, label: 'Menu', output: this.leave });
    this.addChild(_button);
    let scrollCanvas = new PIXI.Container();
    let scroll = new JMBUI.MaskedWindow(scrollCanvas, { x: 20, y: 20, width: 300, height: 300, autoSort: true });
    let scrollbar = new JMBUI.Scrollbar({ height: 300, x: 320, y: 20 });
    scroll.addScrollbar(scrollbar);
    this.addChild(scroll);
    this.addChild(scrollbar);
    let badge = new BadgeLine('EMPTY', BadgeState.NONE);
    scroll.addObject(badge);
    badge = new BadgeLine('EMPTY', BadgeState.BRONZE);
    scroll.addObject(badge);
    badge = new BadgeLine('EMPTY', BadgeState.SILVER);
    scroll.addObject(badge);
    badge = new BadgeLine('EMPTY', BadgeState.GOLD);
    scroll.addObject(badge);
    badge = new BadgeLine('EMPTY', BadgeState.PLATINUM);
    scroll.addObject(badge);
    badge = new BadgeLine('EMPTY', BadgeState.PLATINUM);
    scroll.addObject(badge);
    badge = new BadgeLine('EMPTY', BadgeState.PLATINUM);
    scroll.addObject(badge);
  }

  public leave = () => {
    this.navBack();
  }
}
