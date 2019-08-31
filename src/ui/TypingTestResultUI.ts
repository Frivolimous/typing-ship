import * as PIXI from 'pixi.js';
import { StringData } from '../data/StringData';
import { Colors } from '../data/Colors';

export class TypingTestResultUI extends PIXI.Container {
  constructor(text: string, difficulty: number) {
    super();

    let frame = new PIXI.Graphics();
    frame.beginFill(0xf1f1f1);
    frame.lineStyle(2);
    frame.drawRect(0, 0, 400, 400);
    let field = new PIXI.Text(text, {align: 'center'});
    field.position.set((this.getWidth() - field.width) / 2, 5);
    let diffText = new PIXI.Text(StringData.DIFFICULTY[difficulty]);
    let diffColor = Colors.DIFFICULTY[difficulty];
    diffText.position.set((this.getWidth() - diffText.width) / 2, field.y + field.height + 15);
    frame.beginFill(diffColor);
    frame.drawRect(diffText.x - 5, diffText.y - 5, diffText.width + 10, diffText.height + 10);

    this.addChild(frame, field, diffText);
  }

  public getWidth = () => 400;
  public getHeight = () => 400;
}
