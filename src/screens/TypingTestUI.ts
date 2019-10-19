import * as PIXI from 'pixi.js';

import { BaseUI } from '../JMGE/UI/BaseUI';
import { CONFIG } from '../Config';
import { MuterOverlay } from '../ui/MuterOverlay';
import { TextureData } from '../utils/TextureData';
import { JMTween } from '../JMGE/JMTween';
import { GameEvents } from '../utils/GameEvents';
import { SaveData } from '../utils/SaveData';
import { TypingTestResultUI } from '../ui/TypingTestResultUI';
import { IResizeEvent } from '../JMGE/events/JMInteractionEvents';
import { Button } from '../ui/buttons/Button';

const LABEL = 'TypingTest';
// const CONTENT = 'An evil galactic emperor.';
const CONTENT = "An evil galactic emperor from a far away star system is sending his fleet to destroy Earth. Earth's people are frightened, fearing that they will be wiped out entirely. Fortunately, they have just constructed a super advanced spacecraft that is ready to take on the evil emperor's fleet.";

export class TypingTestUI extends BaseUI {
  private topText: PIXI.Text;
  private topTextOver: PIXI.Text;
  private bottomText: PIXI.Text;
  private startedAt: number;

  private muter: MuterOverlay;

  constructor() {
    super({bgColor: 0x666666});

    let _button = new Button({ width: 100, height: 30, label: 'Menu', onClick: this.navMenu });
    _button.position.set(CONFIG.INIT.SCREEN_WIDTH - 150, CONFIG.INIT.SCREEN_HEIGHT - 100);
    this.addChild(_button);

    let bbx = new PIXI.Graphics();
    this.addChild(bbx);

    this.topText = new PIXI.Text(CONTENT, {fontSize: 24, fill: 0xeedd11, wordWrap: true, wordWrapWidth: CONFIG.INIT.SCREEN_WIDTH - 100});
    this.topText.position.set(50, 50);
    this.topTextOver = new PIXI.Text('', {fontSize: 24, fill: 0xff5511, wordWrap: true, wordWrapWidth: CONFIG.INIT.SCREEN_WIDTH - 100});
    this.topTextOver.position.set(50, 50);

    this.bottomText = new PIXI.Text('', {fontSize: 24, fill: 0xff5511, wordWrap: true, wordWrapWidth: CONFIG.INIT.SCREEN_WIDTH - 100});
    this.bottomText.position.set(50, this.topText.y + this.topText.height + 50);

    bbx.beginFill(0x001166);
    bbx.lineStyle(3, 0x001155);
    bbx.drawRect(45, 45, this.topText.width + 10, this.topText.height + 10);
    bbx.drawRect(45, this.bottomText.y - 5, this.topText.width + 10, this.topText.height + 10);

    this.addChild(this.topText, this.topTextOver, this.bottomText);

    this.muter = new MuterOverlay();
    this.addChild(this.muter);
  }

  public navIn = () => {
    window.addEventListener('keydown', this.keyDown);
  }

  public navOut = () => {
    window.removeEventListener('keydown', this.keyDown);
  }

  protected positionElements = (e: IResizeEvent) => {
    this.muter.x = e.outerBounds.right - this.muter.getWidth();
    this.muter.y = e.outerBounds.bottom - this.muter.getHeight();
  }

  private keyDown = (e: KeyboardEvent) => {
    let letter = e.key;
    if (letter.length === 1) {
      this.update(letter);
    }
  }

  private update = (letter: string) => {
    let match = CONTENT.charAt(this.bottomText.text.length);
    if (letter.toLowerCase() === match.toLowerCase()) {
      this.bottomText.text += match;
      this.topTextOver.text += match;
      if (!this.startedAt) {
        this.startedAt = new Date().getTime();
        console.log('start', this.startedAt);
      }
      if (this.bottomText.text.length === CONTENT.length) {
        this.finishTest();
      }
    } else {
      if (letter !== ' ') {
        this.makeErrorSplash();
      }
    }
  }

  private makeErrorSplash() {
    let splash = new PIXI.Sprite(TextureData.bigX);
    splash.scale.set((CONFIG.INIT.SCREEN_WIDTH - 100) / 100, (CONFIG.INIT.SCREEN_HEIGHT - 100) / 100);
    splash.position.set(50, 50);
    this.addChild(splash);
    new JMTween(splash, 1000).wait(500).to({alpha: 0}).start().onComplete(() => splash.destroy());
  }

  private finishTest() {
    let finalTime = (new Date().getTime() - this.startedAt) / 60000;
    let wordCount = CONTENT.split(' ').length;
    let wpm = Math.floor(wordCount / finalTime);
    let difficulty = Math.max(Math.min(Math.floor(wpm / 15), 5), 0);
    console.log(finalTime, wordCount, wpm);
    let dialogue = new TypingTestResultUI('Your typing speed is:\n   ' + Math.round(wpm) + ' WPM.\nRecommended difficulty: ', difficulty);
    this.addChild(dialogue);
    dialogue.position.set((this.previousResize.innerBounds.width - dialogue.getWidth()) / 2, (this.previousResize.innerBounds.height - dialogue.getHeight()) / 2);

    GameEvents.NOTIFY_TEST_COMPLETE.publish({wpm});
    let extrinsic = SaveData.getExtrinsic();
    extrinsic.data.wpm = wpm;
    extrinsic.data.recommended = difficulty;
    console.log(difficulty);
    SaveData.saveExtrinsic();
  }

  private navMenu = () => {
    this.navBack();
  }
}
