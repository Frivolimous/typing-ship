import * as PIXI from 'pixi.js';

let initialized: boolean = false;
export let sharedTextureCache: JMTextureCache;

export function initSharedCache(app: PIXI.Application) {
  if (!initialized) {
    sharedTextureCache = new JMTextureCache(app.renderer);
    initialized = true;
  }
}

export class JMTextureCache {
  private cache: { [key: string]: PIXI.Texture } = {};

  constructor(private renderer: PIXI.Renderer) { }

  public addTextureFromGraphic = (id: string, graphic: PIXI.Graphics): PIXI.Texture => {
    // let m: PIXI.Texture = this.renderer.generateTexture(graphic);
    let m: PIXI.Texture = this.renderer.generateTexture(graphic, PIXI.SCALE_MODES.LINEAR, 1);
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
