import * as PIXI from 'pixi.js';

export class JMTextureCache {
  private cache: { [key: string]: PIXI.Texture } = {};

  constructor(private renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer) { }

  public addTextureFromGraphic = (id: string, graphic: PIXI.Graphics): PIXI.Texture => {
    let m: PIXI.Texture = this.renderer.generateTexture(graphic);
    if (this.cache[id]) {
      console.warn('overwriting texture', id);
    }
    this.cache[id] = m;
    return m;
  }

  public getTextureFromImage = (url: string): PIXI.Texture => {
    let m = PIXI.Texture.from(url);

    this.cache[url] = m;
    return m;
  }

  public getTexture = (id: string): PIXI.Texture => {
    if (this.cache[id]) {
      return this.cache[id];
    } else {
      return PIXI.Texture.WHITE;
    }
  }
}
