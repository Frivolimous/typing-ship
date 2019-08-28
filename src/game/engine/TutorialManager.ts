import * as JMBL from '../../JMGE/JMBL';
import { TutorialPopup } from '../../ui/TutorialPopup';
import { GameEvents, IHealthEvent, IPauseEvent } from './GameEvents';

export class TutorialManager {
  private testFlag: boolean;
  private currentPopup: TutorialPopup;

  constructor(private canvas: PIXI.Container) {
    // GameEvents.NOTIFY_SET_HEALTH.addListener(this.tutorialDamage);
    // GameEvents.REQUEST_PAUSE_GAME.addListener(this.onPause);
  }

  private tutorialDamage = (e: IHealthEvent) => {
    if (!this.testFlag && e.newHealth < 5) {
      this.currentPopup = new TutorialPopup('your health changed');
      GameEvents.REQUEST_PAUSE_GAME.publish({paused: true});
      this.canvas.addChild(this.currentPopup);
      this.testFlag = false;
      GameEvents.NOTIFY_SET_HEALTH.removeListener(this.tutorialDamage);
    }
  }

  private onPause = (e: IPauseEvent) => {
    if (!e.paused) {
      if (this.currentPopup) {
        this.currentPopup.destroy();
        this.currentPopup = null;
      }
    }
  }
}
