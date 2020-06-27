import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { TextureData } from './utils/TextureData';
import { MenuUI } from './ui/MenuUI';
import { CONFIG } from './Config';
import { SaveData } from './utils/SaveData';
import { TooltipReader } from './JMGE/TooltipReader';
import { JMRect } from './JMGE/others/JMRect';
import { JMInteractionEvents } from './JMGE/events/JMInteractionEvents';
import { ATSManager } from './utils/ATSManager';
import { genAchievements, genTutorials, genScores } from './data/ATSData';
import { AchievementPopup } from './ui/windows/AchievementPopup';
import { TutorialPopup } from './ui/windows/TutorialPopup';
import { initSharedCache } from './JMGE/others/JMTextureCache';
import { Fonts } from './data/Fonts';
import { loadFonts } from './utils/loadFonts';

export let interactionMode: 'desktop'|'mobile' = 'desktop';

new class Facade {
  private static exists = false;
  public app: PIXI.Application;
  public stageBorders: JMRect;
  public innerBorders: JMRect;
  public screen: PIXI.Container;
  public border: PIXI.Graphics;

  private element: HTMLCanvasElement;

  constructor() {
    if (Facade.exists) throw new Error('Cannot instatiate more than one Facade Singleton.');
    Facade.exists = true;
    try {
      document.createEvent('TouchEvent');
      interactionMode = 'mobile';
    } catch (e) {

    }

    this.element = document.getElementById('game-canvas') as HTMLCanvasElement;

    this.app = new PIXI.Application({
      backgroundColor: 0x770000,
      antialias: true,
      resolution: CONFIG.INIT.RESOLUTION,
      width: this.element.offsetWidth,
      height: this.element.offsetHeight,
    });
    this.element.append(this.app.view);

    this.app.stage.scale.x = 1 / CONFIG.INIT.RESOLUTION;
    this.app.stage.scale.y = 1 / CONFIG.INIT.RESOLUTION;

    this.app.stage.interactive = true;
    this.screen = new PIXI.Container();
    this.app.stage.addChild(this.screen);
    if (CONFIG.INIT.BORDER) {
      this.border = new PIXI.Graphics();
      this.border.lineStyle(3, 0xff00ff).drawRect(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT);
      this.app.stage.addChild(this.border);
    }

    this.stageBorders = new JMRect();
    this.innerBorders = new JMRect(0, 0, CONFIG.STAGE.SCREEN_WIDTH, CONFIG.STAGE.SCREEN_HEIGHT);

    new TooltipReader(this.screen, this.stageBorders, {backgroundColor: 0xff0000});
    initSharedCache(this.app);
    TextureData.init();
    // new ScoreTracker();

    let finishResize = _.debounce(this.finishResize, 500);
    window.addEventListener('resize', finishResize);

    let fonts: string[] = _.map(Fonts);
    window.requestAnimationFrame(() => loadFonts(fonts).then(this.init));
  }

  public init = () => {
    // this will happen after 'preloader'
    SaveData.init().then(() => {
      new ATSManager({
        Achievements: genAchievements(),
        Tutorials: genTutorials(),
        Scores: genScores(),
        achievementPopup: AchievementPopup,
        tutorialPopup: TutorialPopup,
        canvas: this.screen,
      });

      let menu = new MenuUI();
      this.screen.addChild(menu);
      menu.navIn();
      this.finishResize();
    });
  }

  private finishResize = () => {
    let viewWidth = this.element.offsetWidth;
    let viewHeight = this.element.offsetHeight;
    this.app.view.width = viewWidth;
    this.app.view.height = viewHeight;

    let innerWidth = CONFIG.STAGE.SCREEN_WIDTH;
    let innerHeight = CONFIG.STAGE.SCREEN_HEIGHT;
    let scale = Math.min(viewWidth / innerWidth, viewHeight / innerHeight);
    this.screen.scale.set(scale);
    this.screen.x = (viewWidth - innerWidth * scale) / 2;
    this.screen.y = (viewHeight - innerHeight * scale) / 2;
    this.stageBorders.set(0 - this.screen.x / scale, 0 - this.screen.y / scale, viewWidth / scale, viewHeight / scale);

    if (this.border) {
      this.border.clear();
      this.border.lineStyle(10, 0xff00ff);
      this.border.drawShape(this.stageBorders);
      this.border.lineStyle(3, 0x00ffff);
      this.border.drawShape(this.innerBorders);
      this.border.scale.set(scale);
      this.border.position.set(this.screen.x, this.screen.y);
    }

    JMInteractionEvents.WINDOW_RESIZE.publish({outerBounds: this.stageBorders, innerBounds: this.innerBorders});
  }
}();
