import * as JMBL from '../../JMGE/JMBL';
import { GameEvents } from '../data/Misc';
import { TutorialPopup } from '../ui/TutorialPopup';

export class TutorialManager {
  private testFlag: boolean;
  private currentPopup: TutorialPopup;

  constructor(private canvas: PIXI.Container) {
    JMBL.events.add(GameEvents.NOTIFY_SET_HEALTH, this.tutorialDamage);
    JMBL.events.add(GameEvents.REQUEST_PAUSE_GAME, this.onPause);
  }

  private tutorialDamage = (n: number) => {
    if (!this.testFlag && n < 5) {
      this.currentPopup = new TutorialPopup('your health changed');
      JMBL.events.publish(GameEvents.REQUEST_PAUSE_GAME, true);
      this.canvas.addChild(this.currentPopup);
      this.testFlag = false;
      JMBL.events.remove(GameEvents.NOTIFY_SET_HEALTH, this.tutorialDamage);
    }
  }

  private onPause = (b: boolean) => {
    if (!b) {
      this.currentPopup.destroy();
      this.currentPopup = null;
    }
  }
}
