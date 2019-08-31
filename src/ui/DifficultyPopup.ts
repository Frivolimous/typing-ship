import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMGE/JMBUI';
import { StringData } from '../data/StringData';
import { Colors } from '../data/Colors';

export class DifficultyPopup extends PIXI.Container {
  constructor(highscore: number, private callback: (i: number) => void) {
    super();

    this.interactive = true;

    let background = new PIXI.Graphics();
    background.beginFill(0);
    background.lineStyle(2, 0xf1f1f1);
    background.drawRoundedRect(0, 0, 80, 210, 3);
    this.addChild(background);

    let hsText = new PIXI.Text(String(highscore), { fill: 0xffee33, fontSize: 13 });
    hsText.x = 80 - hsText.width - 5;
    hsText.y = 5;
    this.addChild(hsText);

    this.makeButton(StringData.DIFFICULTY[1], 1, 35, Colors.DIFFICULTY[1]);
    this.makeButton(StringData.DIFFICULTY[2], 2, 70, Colors.DIFFICULTY[2]);
    this.makeButton(StringData.DIFFICULTY[3], 3, 105, Colors.DIFFICULTY[3]);
    this.makeButton(StringData.DIFFICULTY[4], 4, 140, Colors.DIFFICULTY[4]);
    this.makeButton(StringData.DIFFICULTY[5], 5, 175, Colors.DIFFICULTY[5]);

  }

  public makeButton(text: string, index: number, y: number, bgColor: number) {
    let _button: JMBUI.Button = new JMBUI.Button({ width: 70, height: 30, x: 5, y, label: text, output: () => this.callback(index), bgColor });
    this.addChild(_button);
  }
}
