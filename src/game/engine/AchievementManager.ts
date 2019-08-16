import * as JMBL from '../../JMGE/JMBL';
import { GameEvents } from '../data/Misc';
import { AchievementPopup } from '../ui/AchievementPopup';
import { ExtrinsicModel, Badges } from '../data/PlayerData';
import { SaveData } from '../../utils/SaveData';

export class AchievementManager {
  private extrinsic: ExtrinsicModel;

  private currentPopup: AchievementPopup;

  constructor(private canvas: PIXI.Container) {
    this.extrinsic = SaveData.getExtrinsic();
    console.log(this.extrinsic);

    if (!this.extrinsic.data.badges[Badges.CONQUEROR_GOLD]) {
      JMBL.events.add(GameEvents.NOTIFY_OBJECT_WORD_COMPLETED, this.wordCompleted);
    }
    JMBL.events.add(GameEvents.REQUEST_PAUSE_GAME, this.onPause);
  }

  private wordCompleted = (n: number) => {
    this.currentPopup = new AchievementPopup('you finished 1 word!');
    // JMBL.events.publish(GameEvents.REQUEST_PAUSE_GAME, true);
    this.canvas.addChild(this.currentPopup);
    this.extrinsic.data.badges[0] = true;
    SaveData.saveExtrinsic();
    JMBL.events.remove(GameEvents.NOTIFY_OBJECT_WORD_COMPLETED, this.wordCompleted);
  }

  private onPause = (b: boolean) => {
    if (!b) {
      this.currentPopup.destroy();
      this.currentPopup = null;
    }
  }
}
