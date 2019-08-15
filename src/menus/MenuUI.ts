import * as JMBUI from '../JMGE/JMBUI';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { LevelSelectUI } from './LevelSelectUI';
import { CONFIG } from '../Config';
import { BadgesUI } from './BadgesUI';
import { CreditsUI } from './CreditsUI';
import { HighScoreUI } from './HighScoreUI';
import { MuterOverlay } from './MuterOverlay';
import { JMTween, JMEasing } from '../JMGE/JMTween';
// import { GameManager } from '../TDDR/GameManager';
// import { facade };

export class MenuUI extends BaseUI {
  constructor() {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666, label: 'Millenium\nTyper', labelStyle: { fontSize: 30, fill: 0x3333ff } });
    this.label.x += 50;
    let _button: JMBUI.Button = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 200, label: 'Start', output: this.startGame });
    this.addChild(_button);
    _button = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 240, label: 'High Score', output: this.navHighScore });
    this.addChild(_button);
    _button = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 280, label: 'View Badges', output: this.navBadges });
    this.addChild(_button);
    // _button = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 320, label: 'More Games', output: this.nullFunc });
    // this.addChild(_button);
    _button = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 360, label: 'Credits', output: this.navCredits });
    this.addChild(_button);

    let muter = new MuterOverlay();
    muter.x = this.getWidth() - muter.getWidth();
    muter.y = this.getHeight() - muter.getHeight();
    this.addChild(muter);

    // window.addEventListener('keydown', this.tweenTestPre);
  }

  public nullFunc = () => { };

  public startGame = () => {
    this.navForward(new LevelSelectUI());
    // this.navForward(new GameManager());
  }

  public navBadges = () => {
    this.navForward(new BadgesUI());
  }

  public navCredits = () => {
    this.navForward(new CreditsUI());
  }

  public navHighScore = () => {
    this.navForward(new HighScoreUI());
  }

  // public tweenTestPre = (e: any) => {
  //   switch (e.key) {
  //     case '1': this.tweenTest(JMEasings.linear); break;
  //     case '2': this.tweenTest(JMEasings.quadIn); break;
  //     case '3': this.tweenTest(JMEasings.quadOut); break;
  //     case '4': this.tweenTest(JMEasings.quad); break;

  //   }
  // }
  // public tweenTest = (func: any) => {
  //   let ball = new PIXI.Graphics();
  //   ball.beginFill(0xffffff);
  //   ball.lineStyle(1);
  //   ball.drawCircle(0, 0, 20);
  //   ball.x = 100;
  //   ball.y = 100;
  //   ball.tint = 0xff0000;
  //   // this.addChild(ball);

  //   let ball2 = new PIXI.Graphics();
  //   ball2.beginFill(0xffff00);
  //   ball2.lineStyle(1);
  //   ball2.drawCircle(0, 0, 10);
  //   ball2.x = 100;
  //   ball2.y = 100;
  //   this.addChild(ball2, ball);

  //   // new JMTween(ball).to({y: 300}, 1000).easing(func).start();
  //   // new JMTween(ball).to({x: 300}, 1000).start().onComplete(() => ball.destroy());
  //   new JMTween(ball).to({x: 300}, 1000, false).to({y: 300}, 1000, true).easing(func).start().onComplete(() => ball.destroy());
  //   new JMTween(ball2).to({x: 300, y: 300}, 1000).start().onComplete(() => ball2.destroy());
  // }
}
