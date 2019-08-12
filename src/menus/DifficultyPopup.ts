import * as JMBL from '../JMGE/JMBL';
import * as JMBUI from '../JMGE/JMBUI';
import { StringData } from '../game/data/StringData';

export class DifficultyPopup extends PIXI.Container {
  constructor(highscore: number, private callback: (i: number) => void) {
    super();

    let background = new PIXI.Graphics();
    background.beginFill(0);
    background.lineStyle(2, 0xf1f1f1);
    background.drawRoundedRect(0, 0, 80, 210, 3);
    this.addChild(background);

    let hsText = new PIXI.Text(String(highscore), { fill: 0xffee33, fontSize: 13 });
    hsText.x = 80 - hsText.width - 5;
    hsText.y = 5;
    this.addChild(hsText);

    this.makeButton(StringData.EASY, 1, 35, 0xf1f1f1);
    this.makeButton(StringData.NORMAL, 2, 70, 0xf1f1f1);
    this.makeButton(StringData.HARD, 3, 105, 0xf1f1f1);
    this.makeButton(StringData.EXTREME, 4, 140, 0xf1f1f1);
    this.makeButton(StringData.INSANE, 5, 175, 0xf1f1f1);

  }

  public makeButton(text: string, index, y: number, color: number) {
    let _button: JMBUI.Button = new JMBUI.Button({ width: 70, height: 30, x: 5, y, label: text, output: () => this.callback(index) });
    this.addChild(_button);
  }
}
