import { GameEvents, IPauseEvent } from './GameEvents';
import { AchievementPopup } from '../../ui/AchievementPopup';
import { ExtrinsicModel, Badges } from '../../data/PlayerData';
import { SaveData } from '../../utils/SaveData';

export class AchievementManager {
  private extrinsic: ExtrinsicModel;

  private currentPopup: AchievementPopup;

  constructor(private canvas: PIXI.Container) {
    this.extrinsic = SaveData.getExtrinsic();
    console.log(this.extrinsic);

    if (!this.extrinsic.data.badges[Badges.CONQUEROR_GOLD]) {
      GameEvents.NOTIFY_WORD_COMPLETED.addListener(this.wordCompleted);
    }

    // SOLDIER_BRONZE,
    // SOLDIER_SILVER,
    // SOLDIER_GOLD,
    // CONQUEROR_BRONZE,
    // CONQUEROR_SILVER,
    // CONQUEROR_GOLD,
    // RIDDLER_BRONZE,
    // RIDDLER_SILVER,
    // RIDDLER_GOLD,
    // DEFENDER_BRONZE, DEFENDER_SILVER, DEFENDER_GOLD,
    // PERFECTION_BRONZE,
    // PERFECTION_SILVER,
    // PERFECTION_GOLD,
    // EXPLORER_BRONZE,
    // EXPLORER_SILVER,
    // EXPLORER_GOLD,
    GameEvents.REQUEST_PAUSE_GAME.addListener(this.onPause);
  }

  private wordCompleted = (e: {word: string}) => {
    this.currentPopup = new AchievementPopup('you finished 1 word!');
    // JMBL.events.publish(GameEvents.REQUEST_PAUSE_GAME, true);
    this.canvas.addChild(this.currentPopup);
    this.extrinsic.data.badges[0] = true;
    SaveData.saveExtrinsic();
    GameEvents.NOTIFY_WORD_COMPLETED.removeListener(this.wordCompleted);
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
