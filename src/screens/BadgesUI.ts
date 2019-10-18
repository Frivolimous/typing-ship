import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMGE/JMBUI';
import * as JMBL from '../JMGE/JMBL';
import { CONFIG } from '../Config';
import { SaveData } from '../utils/SaveData';
import { BadgeState } from '../data/PlayerData';
import { BadgeLine } from '../ui/BadgeLine';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { MuterOverlay } from '../ui/MuterOverlay';
import { genAchievements } from '../data/ATSData';

export class BadgesUI extends BaseUI {
  public muter: MuterOverlay;

  private tooltipPosition = {x: 500, y: 20};
  private tooltipTitle: PIXI.Text;
  private tooltipCaption: PIXI.Text;

  constructor() {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666 });

    let _button: JMBUI.Button = new JMBUI.Button({ width: 100, height: 30, x: CONFIG.INIT.SCREEN_WIDTH - 150, y: CONFIG.INIT.SCREEN_HEIGHT - 100, label: 'Menu', output: this.leave });
    this.addChild(_button);
    let scrollCanvas = new PIXI.Container();
    let scroll = new JMBUI.MaskedWindow(scrollCanvas, { x: 20, y: 20, width: 300, height: CONFIG.INIT.SCREEN_HEIGHT - 40, autoSort: true });
    let scrollbar = new JMBUI.Scrollbar({ height: CONFIG.INIT.SCREEN_HEIGHT - 40, x: 320, y: 20 });
    scroll.addScrollbar(scrollbar);
    this.addChild<PIXI.DisplayObject>(scroll, scrollbar);
    
    let extrinsic = SaveData.getExtrinsic();
    let badges = extrinsic.data.badges;
    let badgeInfo = genAchievements();
    for (let i = 0; i < badgeInfo.length; i++) {
      let info = badgeInfo[i];
      let badge = new BadgeLine({title: info.title, description: info.caption, fixedPosition: this.tooltipPosition}, badges[i] ? BadgeState.GOLD : BadgeState.NONE);
      badge.interactive = true;
      scroll.addObject(badge);
    }
    this.tooltipTitle = new PIXI.Text('', {fontSize: 30});
    this.tooltipCaption = new PIXI.Text('', {wordWrap: true, wordWrapWidth: 350});
    this.tooltipTitle.position.set(400, 50);
    this.tooltipCaption.position.set(400,100);
    this.addChild(this.tooltipTitle, this.tooltipCaption);
    this.graphics.beginFill(0xddddff);
    this.graphics.lineStyle(1);
    this.graphics.drawRect(395, 45, 355, 45);
    this.graphics.drawRect(395, 95, 355, 305);

    this.muter = new MuterOverlay();
    this.muter.x = this.getWidth() - this.muter.getWidth();
    this.muter.y = this.getHeight() - this.muter.getHeight();
    this.addChild(this.muter);
  }

  public navIn = () => {
    console.log('navin');
    this.interactive = true;
    this.addListener('pointermove', this.showTooltip);
  }

  public navOut = () => {

  }

  currentTooltip: {target: BadgeLine, };
  public showTooltip = (e: PIXI.interaction.InteractionEvent) => {
    // console.log("yay!'", e.target);
    let target = e.target;
    if (target instanceof BadgeLine) {
      if (!this.currentTooltip || this.currentTooltip.target !== target) {
        this.currentTooltip = {target};
        let tooltipConfig = target.tooltipConfig;
        this.tooltipTitle.text = tooltipConfig.title;
        this.tooltipCaption.text = tooltipConfig.description;
        // console.log("SWITCH!", this.currentTooltip);
      }
    } else {
      if (this.currentTooltip) {
        this.currentTooltip = null;
        this.tooltipTitle.text = '';
        this.tooltipCaption.text = '';
      }
    }
  }

  public leave = () => {
    this.navBack();
  }
}
