import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { ScreenCover } from '../effects/ScreenCover';
import { JMInteractionEvents, IResizeEvent } from '../events/JMInteractionEvents';

export interface IBaseUI {
  bgColor: number;
}

export class BaseUI extends PIXI.Container {
  protected previousUI: BaseUI;
  protected previousResize: IResizeEvent;
  private saveCallback?: (finishNav: () => void) => void;

  private background: PIXI.Graphics;

  constructor(private config?: IBaseUI) {
    super();
    this.background = new PIXI.Graphics();
    this.addChild(this.background);
    JMInteractionEvents.WINDOW_RESIZE.addListener(this.onResize);
    // this.positionElements(resize);
  }

  public navIn = () => { };

  public navOut = () => { };

  public dispose = () => {
    JMInteractionEvents.WINDOW_RESIZE.removeListener(this.onResize);
    this.destroy();
  }

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

  protected positionElements = (e: IResizeEvent) => { };

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

  private onResize = (e: IResizeEvent) => {
    this.previousResize = e;
    if (this.parent) {
      this.redrawBase(e);
      this.positionElements(e);
    }
  }

  private redrawBase = (e: IResizeEvent) => {
    this.background.clear().beginFill(this.config.bgColor).drawShape(e.outerBounds);
  }

  private finishNav = (nextUI: BaseUI, fadeTiming: IFadeTiming, andDispose?: boolean) => {
    fadeTiming = _.defaults(fadeTiming || {}, dFadeTiming);

    let screen = new ScreenCover(this.previousResize.outerBounds, fadeTiming.color).onFadeComplete(() => {
      this.navOut();
      this.parent.addChild(nextUI);
      this.parent.removeChild(this);
      nextUI.navIn();
      if (this.previousResize) {
        nextUI.onResize(this.previousResize);
      }
      let screen2 = new ScreenCover(this.previousResize.outerBounds, fadeTiming.color).fadeOut(fadeTiming.fadeOut);
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
