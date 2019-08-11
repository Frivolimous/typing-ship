export class MuterOverlay extends PIXI.Graphics {
  constructor() {
    super();
    this.beginFill(0x666666);
    this.lineStyle(2);
    this.drawRect(0, 0, 100, 50);
  }

  public getWidth() {
    return 100;
  }

  public getHeight() {
    return 50;
  }
}
