import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMBUI';
import * as _ from 'lodash';
import { ScreenCover } from '../effects/ScreenCover';
import { CONFIG } from '../../Config';

export class BaseUI extends JMBUI.BasicElement {
  protected previousUI: BaseUI;
  private saveCallback?: (finishNav: () => void) => void;

  constructor(UIConfig?: JMBUI.GraphicOptions) {
    super(UIConfig);
  }

  public navIn = () => { };

  public navBack = (fadeTiming?: IFadeTiming) => {
    if (!this.previousUI) {
      return;
    }
    if (this.saveCallback) {
      this.saveCallback(() => {
        this.finishNav(this.previousUI, fadeTiming, true);
      });
    } else {
      this.finishNav(this.previousUI, fadeTiming, true);
    }
  }

  protected navForward = (nextUI: BaseUI, previousUI?: BaseUI, fadeTiming?: IFadeTiming) => {
    nextUI.previousUI = previousUI || this;

    if (this.saveCallback) {
      nextUI.saveCallback = this.saveCallback;
      this.saveCallback(() => {
        this.finishNav(nextUI, fadeTiming);
      });
    } else {
      this.finishNav(nextUI, fadeTiming);
    }
  }

  protected dispose = () => {
    this.destroy();
  }

  private finishNav = (nextUI: BaseUI, fadeTiming: IFadeTiming, andDispose?: boolean) => {
    fadeTiming = _.defaults(fadeTiming || {}, dFadeTiming);

    let screen = new ScreenCover(new PIXI.Rectangle(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT), fadeTiming.color).onFadeComplete(() => {
      this.parent.addChild(nextUI);
      this.parent.removeChild(this);
      nextUI.navIn();
      let screen2 = new ScreenCover(new PIXI.Rectangle(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT), fadeTiming.color).fadeOut(fadeTiming.fadeOut);
      nextUI.addChild(screen2);
      if (andDispose) {
        this.dispose();
      }
    }).fadeIn(fadeTiming.fadeIn, fadeTiming.delay, fadeTiming.delayBlank);
    this.addChild(screen);
  }
}

export interface IFadeTiming {
  color?: number;
  delay?: number;
  fadeIn?: number;
  delayBlank?: number;
  fadeOut?: number;
}

const dFadeTiming: IFadeTiming = {
  color: 0,
  delay: 0,
  fadeIn: 300,
  delayBlank: 100,
  fadeOut: 300,
};
