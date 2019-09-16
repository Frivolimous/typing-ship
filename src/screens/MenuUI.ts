import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMGE/JMBUI';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { LevelSelectUI } from './LevelSelectUI';
import { CONFIG } from '../Config';
import { BadgesUI } from './BadgesUI';
import { TypingTestUI } from './TypingTestUI';
import { CreditsUI } from './CreditsUI';
import { HighScoreUI } from './HighScoreUI';
import { MuterOverlay } from '../ui/MuterOverlay';
import { JMTween, JMEasing } from '../JMGE/JMTween';
import { SoundData } from '../utils/SoundData';
import { SaveData } from '../utils/SaveData';
import { StringData } from '../data/StringData';
import { TooltipReader } from '../JMGE/TooltipReader';
import { JMRect } from '../JMGE/others/JMRect';
import { IResizeEvent } from '../JMGE/events/JMInteractionEvents';
// import { GameManager } from '../TDDR/GameManager';
// import { facade };

export class MenuUI extends BaseUI {
  public muter: MuterOverlay;

  private startB: JMBUI.Button;
  private typingTestB: JMBUI.Button;
  private highScoreB: JMBUI.Button;
  private badgeB: JMBUI.Button;
  private creditsB: JMBUI.Button;

  constructor() {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666, label: 'Millenium\nTyper', labelStyle: { fontSize: 30, fill: 0x3333ff } });
    this.label.x += 50;
    this.startB = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 200, label: 'Start', output: this.startGame });
    this.typingTestB = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 240, label: 'Typing Test', output: this.navTypingTest });
    this.highScoreB = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 300, label: 'High Score', output: this.navHighScore });
    this.badgeB = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 340, label: 'View Badges', output: this.navBadges });
    this.creditsB = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 380, label: 'Credits', output: this.navCredits });
    this.addChild(this.startB, this.typingTestB, this.highScoreB, this.badgeB, this.creditsB);

    this.muter = new MuterOverlay();
    this.muter.x = this.getWidth() - this.muter.getWidth();
    this.muter.y = this.getHeight() - this.muter.getHeight();
    this.addChild(this.muter);

    window.addEventListener('keydown', this.tweenTestPre);
  }

  public positionElements = (e: IResizeEvent) => {

  }

  public navIn = () => {
    this.muter.reset();
    SoundData.playMusic(0);

    let extrinsic = SaveData.getExtrinsic();
    let wpm = extrinsic.data.wpm;

    if (wpm) {
      this.typingTestB.highlight(false);
      TooltipReader.addTooltip(this.typingTestB, null);
    } else {
      this.typingTestB.highlight(true);
      TooltipReader.addTooltip(this.typingTestB, {title: StringData.TYPING_TEST_TITLE, description: StringData.TYPING_TEST_DESC});
    }
  }

  public nullFunc = () => { };

  public startGame = () => {
    this.navForward(new LevelSelectUI());
  }

  public navTypingTest = () => {
    this.navForward(new TypingTestUI());
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

  public tweenTestPre = (e: any) => {
    switch (e.key) {
      case '9': this.typingTestB.highlight(true); break;
      case '0': this.typingTestB.highlight(false); break;
      case '1': this.tweenTest(JMEasing.Linear.None); break;
      case '2': this.tweenTest(JMEasing.Quadratic.In); break;
      case '3': this.tweenTest(JMEasing.Quadratic.Out); break;
      case '4': this.tweenTest(JMEasing.Quadratic.InOut); break;
      case '5': this.tweenTest2(); break;

    }
  }
  public tweenTest = (func: any) => {
    let ball = new PIXI.Graphics();
    ball.beginFill(0xffffff);
    ball.lineStyle(1);
    ball.drawCircle(0, 0, 20);
    ball.x = 100;
    ball.y = 100;
    ball.tint = 0xff0000;
    // this.addChild(ball);

    let ball2 = new PIXI.Graphics();
    ball2.beginFill(0xffff00);
    ball2.lineStyle(1);
    ball2.drawCircle(0, 0, 10);
    ball2.x = 100;
    ball2.y = 100;
    this.addChild(ball2, ball);

    // new JMTween(ball).to({y: 300}, 1000).easing(func).start();
    // new JMTween(ball).to({x: 300}, 1000).start().onComplete(() => ball.destroy());
    new JMTween(ball, 1000).to({x: 300}, false).to({y: 300}, true).easing(func).start().onComplete(() => ball.destroy());
    new JMTween(ball2, 1000).to({x: 300, y: 300}).start().onComplete(() => ball2.destroy());
  }

  public tweenTest2 = () => {
    let ball = new PIXI.Graphics();
    ball.beginFill(0xffffff);
    ball.lineStyle(1);
    ball.drawCircle(0, 0, 20);
    ball.x = 100;
    ball.y = 100;
    ball.tint = 0xff0000;
    this.addChild(ball);
    let t1 = new JMTween(ball, 1000).to({x: 300}).start();
    t1.chain(ball, 1000).to({x: 500}).chain(ball, 1000).to({y: 300}).chain(ball, 1000).to({x: 100}).chain(ball, 1000).to({y: 100}).chainTween(t1);
  }
}
