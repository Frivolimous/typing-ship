import * as JMBL from '../../JMGE/JMBL';

export class Shield extends PIXI.Graphics{
  constructor(){
    super();
    this.beginFill(0x00aaff,0.5);
    this.drawCircle(0,0,100);
    this.alpha=0;
  }

  fadeIn(alpha:number=1){
    this.alpha=0;
    JMBL.tween.to(this,13,{alpha});
  }

  fadeTo(alpha:number){
    JMBL.tween.to(this,13,{alpha});
  }

  fadeOut(){
    JMBL.tween.to(this,13,{alpha:0},{onComplete:()=>this.parent.removeChild(this)});
  }
}