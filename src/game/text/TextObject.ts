import * as WordList from '../../data/WordList';
import { Fonts } from '../../data/Fonts';
import { BaseObject } from '../objects/BaseObject';

export class TextObject extends PIXI.Container {
  public static allTextObjects: TextObject[] = [];
  private word: string;
  private frontText: PIXI.Text;
  private priority = -1;

  constructor(wordSize: number = 0, priority: number = 0, public following?: BaseObject, private onWordComplete?: (word: string) => void) {
    super();

    this.frontText = new PIXI.Text('', { fontSize: 14, fill: 0xffffff, fontFamily: Fonts.WORD_FONT, stroke: 0, strokeThickness: 2 });
    this.addChild(this.frontText);
    this.setPriority(priority);

    if (wordSize > 0) {
      this.newWord(wordSize);
    } else {
      this.frontText.visible = false;
    }
    TextObject.allTextObjects.push(this);
  }

  public newWord(wordSize: number) {
    if (this.getText()) {
      WordList.push(this.getText());
    }
    this.word = WordList.shift(wordSize);
    this.frontText.text = this.word;
    this.frontText.visible = true;
  }

  public hasWord(): boolean {
    return Boolean(this.getText());
  }

  public getText(): string {
    return this.word ? this.word.trim() : '';
  }

  public setPriority(i: number) {
    if (i === this.priority) return;
    this.priority = i;

    switch (i) {
      case 0: this.frontText.tint = 0xffffff; break;
      case 1: this.frontText.tint = 0xffff99; break;
      case 2: this.frontText.tint = 0xffbb99; break;
      case 3: this.frontText.tint = 0xff8877; break;
    }
  }

  public update() {
    if (this.following) {
      let point = this.parent.toLocal(this.following.wordOffset, this.following);
      this.x = point.x;
      this.y = point.y;
      this.setPriority(this.following.priority);
    }
  }

  public dispose() {
    if (this.hasWord) {
      WordList.push(this.getText());
      this.word = '';
      this.frontText.text = this.word;
      this.frontText.visible = false;
    }
    // this.destroy();
  }

  public remove() {
    this.dispose();
    this.destroy();
    TextObject.allTextObjects.splice(TextObject.allTextObjects.indexOf(this), 1);
  }

  public matchAndReturnWord(s: string): string {
    let text = this.getText();
    if (text === s.substring(s.length - text.length)) {
      this.dispose();
      return text;
    } else {
      return null;
    }
  }

  public triggerWordComplete() {
    if (this.onWordComplete) {
      this.onWordComplete(this.getText());
    }
  }
}
