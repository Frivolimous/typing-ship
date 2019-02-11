import { GameSprite } from "./GameSprite";
import { BossShip } from "./BossShip";

export class Scanner extends GameSprite{
	STARTING_COUNT:number=300;
	COUNT_CHANGE:number=30;
	COUNT_RATE:number=3;
	count:number;
	toCount:number;
	graphic:PIXI.Graphics=new PIXI.Graphics;

	constructor(private boss:BossShip){
		super();
		this.wordSize=3;
		this.addWord(3,0);
		this.count=this.STARTING_COUNT;
		this.addChild(this.graphic);
		this.redrawCircle();
		this.onWordComplete=this.scan;
	}

	scan(){
		this.toCount=this.count-this.COUNT_CHANGE;
		if (this.toCount<0){
			this.boss.scan(true);
			this.dispose();
		}
		if (this.toCount<=5){
			this.toCount=0;
			this.addWord(10,1);
		}else{
			this.addWord(3,1);
		}
	}

	update=()=>{
		if (this.count>this.toCount && this.count>5){
			this.count=Math.max(this.count-3,this.toCount,5);
			this.redrawCircle();
		}
	}

	redrawCircle(){
		this.graphic.clear();
		this.graphic.lineStyle(3,0xff5500);
		this.graphic.drawCircle(0,0,this.count);
		this.graphic.drawCircle(0,0,1);
	}
}