import * as JMBL from './JMGE/JMBL';
import { TextureData } from './GraphicData';
import { MenuUI } from './menus/MenuUI';
import { CONFIG } from './Config';
import { SaveData } from './utils/SaveData';
import { ScoreTracker } from './utils/ScoreTracker';

new class Facade{
	app:any;
	stageBorders:JMBL.Rect;
	private _Resolution=CONFIG.INIT.RESOLUTION;
	static exists:Boolean=false;

	currentModule:any;

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

	constructor(){
		if (Facade.exists) throw "Cannot instatiate more than one Facade Singleton.";
		Facade.exists=true;
		try{
			document.createEvent("TouchEvent");
			JMBL.setInteractionMode("mobile");
		}catch(e){

		}
		
		this.stageBorders=new JMBL.Rect(0,0,CONFIG.INIT.SCREEN_WIDTH/this._Resolution,CONFIG.INIT.SCREEN_HEIGHT/this._Resolution);
		this.app = new PIXI.Application(this.stageBorders.width,this.stageBorders.height,{
			backgroundColor:0xff0000,
			antialias:true,
			resolution:this._Resolution,
			roundPixels:true,
		});
		(document.getElementById("game-canvas") as any).append(this.app.view);

		// if (this.app){
		// 	let test=PIXI.Sprite.fromImage("./Bitmaps/a ship sprite sheet.png")
		// 	this.app.stage.addChild(test);
		// 	return;
		// }
		this.stageBorders.width*=this._Resolution;
		this.stageBorders.height*=this._Resolution;

		this.app.stage.scale.x=1/this._Resolution;
		this.app.stage.scale.y=1/this._Resolution;
		this.stageBorders.x=this.app.view.offsetLeft;
		this.stageBorders.y=this.app.view.offsetTop;
		this.app.stage.interactive=true;

		let _background=new PIXI.Graphics();
		_background.beginFill(CONFIG.INIT.BACKGROUND_COLOR);
		_background.drawRect(0,0,this.stageBorders.width,this.stageBorders.height);
		this.app.stage.addChild(_background);

		// window.addEventListener("resize",()=>{
		// 	this.stageBorders.left=this.app.view.offsetLeft;
		// 	this.stageBorders.top=this.app.view.offsetTop;
		// });
		
		JMBL.init(this.app);
		TextureData.init(this.app.renderer);
		new ScoreTracker();
		window.setTimeout(this.init,10);
	}

	init=()=>{
		//this will happen after "preloader"
		
		initializeDatas();
		SaveData.init();

		this.currentModule=new MenuUI ();
		this.currentModule.navOut=this.updateCurrentModule;
		this.app.stage.addChild(this.currentModule);
	}

	updateCurrentModule=(o:any)=>{
		SaveData.saveExtrinsic(()=>{
			if (this.currentModule.dispose){
				this.currentModule.dispose();
			}else if (this.currentModule.destroy){
				this.currentModule.destroy();
			}
			this.currentModule=o;
			o.navOut=this.updateCurrentModule;
			this.app.stage.addChild(o);
		});
	}

	saveCallback=(finish:()=>void)=>{
		SaveData.saveExtrinsic(finish);
	}
}

function initializeDatas(){
}
