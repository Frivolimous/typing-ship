import * as PIXI from 'pixi.js';
import * as JMBL from './JMGE/JMBL';
import { TextureData } from './utils/TextureData';
import { MenuUI } from './screens/MenuUI';
import { CONFIG } from './Config';
import { SaveData } from './utils/SaveData';
import { TooltipReader } from './JMGE/TooltipReader';
// import { ScoreTracker } from './utils/ScoreTracker';

new class Facade {
  private static exists = false;

  public app: any;
  public stageBorders: JMBL.Rect;
  public currentModule: any;

  private tooltipReader: TooltipReader;
  private _Resolution = CONFIG.INIT.RESOLUTION;

  // windowToLocal=(e:any):PIXI.Point=>{
  // 	return new PIXI.Point((e.x+this.stageBorders.x)*this._Resolution,(e.y+this.stageBorders.y)*this._Resolution);
  // }

  // disableGameInput(b:Boolean=true){
  // 	if (b){
  // 		this.inputM.mouseEnabled=false;
  // 	}else{
  // 		this.inputM.mouseEnabled=true;
  // 	}
  // }

  constructor() {
    if (Facade.exists) throw new Error('Cannot instatiate more than one Facade Singleton.');
    Facade.exists = true;
    try {
      document.createEvent('TouchEvent');
      JMBL.setInteractionMode('mobile');
    } catch (e) {

    }

    this.stageBorders = new JMBL.Rect(0, 0, CONFIG.INIT.SCREEN_WIDTH / this._Resolution, CONFIG.INIT.SCREEN_HEIGHT / this._Resolution);
    this.app = new PIXI.Application({
      backgroundColor: 0xff0000,
      antialias: true,
      resolution: this._Resolution,
      width: this.stageBorders.width,
      height: this.stageBorders.height,
    });
    (document.getElementById('game-canvas') as any).append(this.app.view);

    // if (this.app){
    // 	let test=PIXI.Sprite.from('./Bitmaps/a ship sprite sheet.png')
    // 	this.app.stage.addChild(test);
    // 	return;
    // }
    this.stageBorders.width *= this._Resolution;
    this.stageBorders.height *= this._Resolution;

    this.app.stage.scale.x = 1 / this._Resolution;
    this.app.stage.scale.y = 1 / this._Resolution;
    this.stageBorders.x = this.app.view.offsetLeft;
    this.stageBorders.y = this.app.view.offsetTop;
    this.app.stage.interactive = true;

    let _background = new PIXI.Graphics();
    _background.beginFill(CONFIG.INIT.BACKGROUND_COLOR);
    _background.drawRect(0, 0, this.stageBorders.width, this.stageBorders.height);
    this.app.stage.addChild(_background);

    // window.addEventListener('resize',()=>{
    // 	this.stageBorders.left=this.app.view.offsetLeft;
    // 	this.stageBorders.top=this.app.view.offsetTop;
    // });

    this.tooltipReader = new TooltipReader(this.app.stage, this.stageBorders);
    JMBL.init(this.app);
    TextureData.init(this.app.renderer);
    // new ScoreTracker();
    window.setTimeout(this.init, 10);
  }

  public init = () => {
    // this will happen after 'preloader'

    initializeDatas();
    SaveData.init();

    this.currentModule = new MenuUI();
    this.currentModule.navOut = this.updateCurrentModule;
    this.app.stage.addChild(this.currentModule);
    this.currentModule.navIn();
  }

  public updateCurrentModule = (o: any) => {
    SaveData.saveExtrinsic(() => {
      if (this.currentModule.dispose) {
        this.currentModule.dispose();
      } else if (this.currentModule.destroy) {
        this.currentModule.destroy();
      }
      this.currentModule = o;
      o.navOut = this.updateCurrentModule;
      this.app.stage.addChild(o);
    });
  }

  public saveCallback = (finish: () => void) => {
    SaveData.saveExtrinsic(finish);
  }
}();

function initializeDatas() {
}
