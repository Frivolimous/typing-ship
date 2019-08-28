import * as JMBL from '../JMGE/JMBL';
// import { GameEvents } from '../game/data/Misc';
import { SaveData } from './SaveData';
import { ExtrinsicModel } from '../data/PlayerData';

export class ScoreTracker {
  private extrinsic: ExtrinsicModel;

  constructor() {
    this.extrinsic = SaveData.getExtrinsic();
    let scores = this.extrinsic.data.scores;
    // let achieves = this.extrinsic.data.badges;
    // if (!achieves[1]) {
    //   JMBL.events.add(GameEvents.NOTIFY_SET_SCORE, () => this.toggleAchieve(1));
    // }
  }

  public init() {

  }

  // public toggleAchieve(i: number) {
  //   if (!this.extrinsic.data.badges[i]) {
  //     this.extrinsic.data.badges[i] = true;
  //     JMBL.events.publish(GameEvents.NOTIFY_ACHIEVEMENT, i);
  //   }
  // }
}
