import { GameSprite } from './GameSprite';
import { ActionType } from '../../data/Types';

export class ClearObject extends GameSprite {

  constructor(wordSize: number, onWordComplete: () => void) {
    super();

    this.addWord(wordSize);
    this.onWordComplete = onWordComplete;
    this.killBy = ActionType.INSTANT;
  }
}
