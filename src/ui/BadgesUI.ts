import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { CONFIG } from '../Config';
import { SaveData } from '../utils/SaveData';
import { BadgeState } from '../data/PlayerData';
import { BadgeLine } from './windows/BadgeLine';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { MuterOverlay } from './windows/MuterOverlay';
import { genAchievements } from '../data/ATSData';
import { IResizeEvent } from '../JMGE/events/JMInteractionEvents';
import { Fonts } from '../data/Fonts';
import { Button } from '../JMGE/UI/Button';
import { ScrollWindow } from '../JMGE/UI/ScrollWindow';

export class BadgesUI extends BaseUI {
  private muter: MuterOverlay;

  private tooltipPosition = {x: 500, y: 20};
  private tooltipTitle: PIXI.Text;
  private tooltipCaption: PIXI.Text;

  private currentTooltip: {target: BadgeLine};

  constructor() {
    super({bgColor: 0x666666});

    let ttb = new PIXI.Graphics();
    this.addChild(ttb);
    ttb.beginFill(0xddddff);
    ttb.lineStyle(1);
    ttb.drawRect(395, 45, 355, 45);
    ttb.drawRect(395, 95, 355, 305);

    let _button = new Button({ width: 100, height: 30, label: 'Menu', onClick: this.leave });
    _button.position.set(CONFIG.INIT.SCREEN_WIDTH - 150, CONFIG.INIT.SCREEN_HEIGHT - 100);
    this.addChild(_button);

    let scroll = new ScrollWindow(300, CONFIG.INIT.SCREEN_HEIGHT - 40, {scrollColor: 0x111111, moverColor: 0xf1f1f1});
    this.addChild(scroll);
    scroll.position.set(20, 20);

    let extrinsic = SaveData.getExtrinsic();
    let badges = extrinsic.data.badges;
    let badgeInfo = genAchievements();
    let count = 0;
    for (let i = 0; i < badgeInfo.length; i++) {
      let info = badgeInfo[i];
      let prevIndex: number;
      if (info.prev) {
        prevIndex = _.findIndex(badgeInfo, {id: info.prev});
      }
      if (!info.prev || badges[prevIndex]) {
        let badge = new BadgeLine({title: info.title, description: info.caption}, badges[i] ? BadgeState.GOLD : BadgeState.NONE);
        badge.x = 5;
        badge.y = count * (badge.getHeight() + 5);
        badge.interactive = true;
        count++;
        scroll.addObject(badge);
      }
    }
    this.tooltipTitle = new PIXI.Text('', {fontSize: 30, fontFamily: Fonts.UI});
    this.tooltipCaption = new PIXI.Text('', {wordWrap: true, fontFamily: Fonts.UI, wordWrapWidth: 350});
    this.tooltipTitle.position.set(400, 50);
    this.tooltipCaption.position.set(400, 100);
    this.addChild(this.tooltipTitle, this.tooltipCaption);

    this.muter = new MuterOverlay();
    this.addChild(this.muter);
  }

  public navIn = () => {
    console.log('navin');
    this.interactive = true;
    this.addListener('pointermove', this.showTooltip);
  }

  public navOut = () => {

  }

  protected positionElements = (e: IResizeEvent) => {
    this.muter.x = e.outerBounds.right - this.muter.getWidth();
    this.muter.y = e.outerBounds.bottom - this.muter.getHeight();
  }

  private showTooltip = (e: PIXI.interaction.InteractionEvent) => {
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

  private leave = () => {
    this.navBack();
  }
}
