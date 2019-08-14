export class ScreenCover extends PIXI.Graphics {
  constructor(rect: PIXI.Rectangle, color: number = 0) {
    super();
    this.beginFill(color);
    this.drawRect(rect.x, rect.y, rect.width, rect.height);
  }
}
