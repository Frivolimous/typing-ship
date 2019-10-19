import * as PIXI from 'pixi.js';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { LevelSelectUI } from './LevelSelectUI';
import { CONFIG } from '../Config';
import { BadgesUI } from './BadgesUI';
import { TypingTestUI } from './TypingTestUI';
import { CreditsUI } from './CreditsUI';
import { MuterOverlay } from '../ui/MuterOverlay';
import { JMTween, JMEasing } from '../JMGE/JMTween';
import { SoundData } from '../utils/SoundData';
import { SaveData } from '../utils/SaveData';
import { StringData } from '../data/StringData';
import { TooltipReader } from '../JMGE/TooltipReader';
import { JMRect } from '../JMGE/others/JMRect';
import { IResizeEvent } from '../JMGE/events/JMInteractionEvents';
import { Button } from '../ui/buttons/Button';
// import { GameManager } from '../TDDR/GameManager';
// import { facade };

export class MenuUI extends BaseUI {
  public muter: MuterOverlay;

  private title: PIXI.Text;

  private startB: Button;
  private typingTestB: Button;
  private badgeB: Button;
  private creditsB: Button;

  constructor() {
    super({bgColor: 0x666666});
    this.title = new PIXI.Text('Millenium Typer', { fontSize: 30, fill: 0x3333ff });
    this.addChild(this.title);

    this.startB = new Button({ width: 100, height: 30, label: 'Start', onClick: this.startGame });
    this.startB.position.set(150, 200);
    this.typingTestB = new Button({ width: 100, height: 30, label: 'Typing Test', onClick: this.navTypingTest });
    this.typingTestB.position.set(150, 240);
    this.badgeB = new Button({ width: 100, height: 30, label: 'View Badges', onClick: this.navBadges });
    this.badgeB.position.set(150, 340);
    this.creditsB = new Button({ width: 100, height: 30, label: 'Credits', onClick: this.navCredits });
    this.creditsB.position.set(150, 380);
    this.addChild(this.startB, this.typingTestB, this.badgeB, this.creditsB);

    this.muter = new MuterOverlay();
    this.addChild(this.muter);
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

  protected positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
    this.muter.x = e.outerBounds.right - this.muter.getWidth();
    this.muter.y = e.outerBounds.bottom - this.muter.getHeight();
  }

  private startGame = () => {
    this.navForward(new LevelSelectUI());
  }

  private navTypingTest = () => {
    this.navForward(new TypingTestUI());
  }

  private navBadges = () => {
    this.navForward(new BadgesUI());
  }

  private navCredits = () => {
    this.navForward(new CreditsUI());
  }
}
