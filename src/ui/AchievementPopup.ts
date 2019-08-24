import { JMTween } from '../JMGE/JMTween';

export class AchievementPopup extends PIXI.Container {
  constructor(text: string, tier: number = 0) {
    super();

    let background = new PIXI.Graphics();
    background.beginFill(0xffff00);
    background.drawRect(0, 0, 300, 100);

    let field = new PIXI.Text(text);

    this.addChild(background, field);
    new JMTween<AchievementPopup>(this).to({alpha: 0}).over(1000).wait(5000).onComplete(() => {
      this.destroy();
    }).start();
  }
}
