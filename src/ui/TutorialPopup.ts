import * as PIXI from 'pixi.js';
export class TutorialPopup extends PIXI.Container {

  constructor(text: string) {
    super();
    let background = new PIXI.Graphics();
    background.beginFill(0xffffff);
    background.drawRect(0, 0, 300, 100);

    let field = new PIXI.Text(text);

    this.addChild<PIXI.DisplayObject>(background, field);
  }
}

// sept 6;
