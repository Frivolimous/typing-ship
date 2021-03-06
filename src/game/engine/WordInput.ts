import { TextObject } from '../text/TextObject';
import { GameEvents, IHealthEvent, IWordEvent } from '../../utils/GameEvents';
import { CONFIG } from '../../Config';
import { SoundData, SoundIndex } from '../../utils/SoundData';

export class WordInput {
  public static OVERFLOW_DURATION: number = 100;

  public text: string = '';
  public healWord: TextObject = new TextObject(0, 0, null, () => {
    this.healWord.dispose();
    SoundData.playSound(SoundIndex.HEAL);
    GameEvents.REQUEST_HEAL_PLAYER.publish({amount: 1});
  });

  public specialWords: [string, () => void][] = [];

  public overflow: [string, number][] = [];

  private overflowTimer: number = 0;

  constructor() {
    GameEvents.NOTIFY_SET_HEALTH.addListener(this.checkHealth);
    GameEvents.REQUEST_OVERFLOW_WORD.addListener(this.addOverflow);
    GameEvents.ticker.add(this.update);
  }

  public dispose() {
    if (this.healWord) {
      this.healWord.dispose();
    }
    GameEvents.NOTIFY_SET_HEALTH.removeListener(this.checkHealth);
    GameEvents.REQUEST_OVERFLOW_WORD.removeListener(this.addOverflow);
    GameEvents.ticker.remove(this.update);
  }

  public addSpecialWord(word: string, callback: () => void) {
    this.specialWords.push([word, callback]);
  }

  public addLetter(letter: string) {
    letter = letter.toLowerCase();
    if (this.checkLetter(letter)) {
      this.text += letter;
      GameEvents.NOTIFY_LETTER_ADDED.publish({letter});
      for (let object of TextObject.allTextObjects) {
        let text = object.matchAndReturnWord(this.text);
        if (text) {
          this.removeWord(text);
          object.triggerWordComplete();
          this.finishAddLetter();
          return;
        }
      }

      for (let i = 0; i < this.overflow.length; i++) {
        if (this.testWord(this.overflow[i][0])) {
          this.removeWord(this.overflow[i][0]);
          this.overflow.splice(i, 1);
          this.finishAddLetter();
          return;
        }
      }
      for (let i = 0; i < this.specialWords.length; i++) {
        let word = this.specialWords[i][0];
        if (this.testWord(word)) {
          this.removeWord(word);
          this.specialWords[i][1]();
          this.finishAddLetter();
          return;
        }
      }
    }
    this.finishAddLetter();
  }

  public deleteLetters(i: number) {
    if (this.text.length > 0) {
      this.text = this.text.substr(0, this.text.length - i);

      GameEvents.NOTIFY_LETTER_DELETED.publish({numDeleted: i});
      GameEvents.NOTIFY_UPDATE_INPUT_WORD.publish({word: this.text});
    }
  }

  public update = () => {
    if (this.overflow.length > 0) {
      this.overflowTimer = (this.overflowTimer + 1) % WordInput.OVERFLOW_DURATION;
      while (this.overflow.length > 0 && this.overflow[0][1] === this.overflowTimer) {
        this.overflow.shift();
      }
    }
  }

  private checkLetter(letter: string): boolean {
    if (letter.length > 1) {
      return false;
    }
    if (letter >= 'a' && letter <= 'z') {
      return true;
    } else {
      return false;
    }
  }

  private finishAddLetter() {
    if (this.text.length > 20) {
      let i = this.text.length - 20;
      this.text = this.text.substring(i);
      GameEvents.NOTIFY_LETTER_DELETED.publish({numDeleted: i});
    }
    GameEvents.NOTIFY_UPDATE_INPUT_WORD.publish({word: this.text});
  }

  private testWord(word: string): boolean {
    return word === this.text.substring(this.text.length - word.length);
  }

  private removeWord(word: string) {
    GameEvents.NOTIFY_WORD_COMPLETED.publish({word});
    console.log('word completed', {word});
    this.text = this.text.substr(0, this.text.length - word.length);
  }

  private checkHealth = (e: IHealthEvent) => {
    if (e.newHealth < CONFIG.GAME.playerHealth) {
      if (!this.healWord.hasWord()) {
        this.healWord.newWord(8);
      }
      this.healWord.setPriority(Math.min(3, 4 - e.newHealth));
    } else if (e.newHealth >= CONFIG.GAME.playerHealth) {
      if (this.healWord) {
        this.healWord.dispose();
      }
    }
  }

  private addOverflow = (e: IWordEvent) => {
    this.overflow.push([e.word, (this.overflowTimer + WordInput.OVERFLOW_DURATION - 1) % WordInput.OVERFLOW_DURATION]);
  }
}
