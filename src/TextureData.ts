import { JMTextureCache } from './JMGE/others/JMTextureCache';

export const ImageRepo = {
  sm: './Bitmaps/Separate/sm.png',
  mm: './Bitmaps/Separate/mm.png',
  lm: './Bitmaps/Separate/lm.png',
  sl: './Bitmaps/Separate/sl.png',
  ml: './Bitmaps/Separate/ml.png',
  ll: './Bitmaps/Separate/ll.png',
  ss: './Bitmaps/Separate/ss.png',
  ms: './Bitmaps/Separate/ms.png',
  ls: './Bitmaps/Separate/ls.png',
  turret: './Bitmaps/Separate/turret.png',
  superman: './Bitmaps/Separate/superman.png',
  player: './Bitmaps/Separate/player/red 1.png',
  playerMissile: './Bitmaps/Separate/missiles/p mi.png',
  enemyMissile: './Bitmaps/Separate/missiles/me ship 1.png',
  boss0: './Bitmaps/Separate/boss/boss0.png',
  boss1: './Bitmaps/Separate/boss/boss1.png',
  boss2: './Bitmaps/Separate/boss/boss2.png',
  boss0Over0: './Bitmaps/doors2.png',
  boss0Over1: './Bitmaps/doors3.png',
  boss0Over2: './Bitmaps/doors4.png',
};

export class TextureData {
  public static cache: JMTextureCache;

  public static medal: PIXI.Texture;

  public static init = (renderer: any) => {
    TextureData.cache = new JMTextureCache(renderer);

    let _graphic = new PIXI.Graphics();
    _graphic.beginFill(0xffffff);
    _graphic.moveTo(-5, 0);
    _graphic.lineTo(-10, 20);
    _graphic.lineTo(10, 20);
    _graphic.lineTo(5, 0);
    _graphic.lineTo(-5, 0);
    _graphic.drawCircle(0, 0, 10);
    TextureData.medal = TextureData.cache.addTextureFromGraphic('medal', _graphic);
  }
}
