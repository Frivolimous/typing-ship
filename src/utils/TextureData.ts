import * as PIXI from 'pixi.js';
import { JMTextureCache } from '../JMGE/others/JMTextureCache';
import { Colors } from '../data/Colors';

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
  public static health: PIXI.Texture;
  public static kills: PIXI.Texture;
  public static pause: PIXI.Texture;
  public static play: PIXI.Texture;
  public static sound: PIXI.Texture;
  public static noSound: PIXI.Texture;

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

    _graphic.clear();
    _graphic.beginFill(0xffffff);
    _graphic.moveTo(40, 0);
    _graphic.lineTo(60, 0);
    _graphic.lineTo(60, 40);
    _graphic.lineTo(100, 40);
    _graphic.lineTo(100, 60);
    _graphic.lineTo(60, 60);
    _graphic.lineTo(60, 100);
    _graphic.lineTo(40, 100);
    _graphic.lineTo(40, 60);
    _graphic.lineTo(0, 60);
    _graphic.lineTo(0, 40);
    _graphic.lineTo(40, 40);
    _graphic.lineTo(40, 0);
    TextureData.health = TextureData.cache.addTextureFromGraphic('health', _graphic);

    _graphic.clear();
    _graphic.beginFill(0xffffff);
    _graphic.drawCircle(50, 50, 50);
    TextureData.kills = TextureData.cache.addTextureFromGraphic('kills', _graphic);

    _graphic.clear();
    _graphic.beginFill(0xffffff, 0.2);
    _graphic.drawCircle(50, 50, 50);
    _graphic.beginFill(0xffff00);
    _graphic.drawRect(20, 0, 20, 100);
    _graphic.drawRect(60, 0, 20, 100);
    TextureData.pause = TextureData.cache.addTextureFromGraphic('pause', _graphic);

    _graphic.clear();
    _graphic.beginFill(0xffffff, 0.2);
    _graphic.drawCircle(50, 50, 50);
    _graphic.beginFill(0xffff00);
    _graphic.moveTo(20, 10);
    _graphic.lineTo(80, 50);
    _graphic.lineTo(20, 90);
    _graphic.lineTo(20, 10);
    TextureData.play = TextureData.cache.addTextureFromGraphic('play', _graphic);

    _graphic.clear();
    _graphic.beginFill(0xffffff, 0.2);
    _graphic.drawCircle(50, 50, 50);
    _graphic.beginFill(0xffff00);
    _graphic.drawCircle(10, 80, 10);
    _graphic.drawCircle(60, 80, 10);
    _graphic.drawRect(13, 0, 6, 80);
    _graphic.drawRect(63, 0, 6, 80);
    _graphic.drawRect(13, 0, 56, 20);
    TextureData.sound = TextureData.cache.addTextureFromGraphic('sound', _graphic);

    _graphic.endFill();
    _graphic.lineStyle(3, 0xff0000);
    _graphic.drawCircle(50, 50, 50);
    _graphic.moveTo(0, 100);
    _graphic.lineTo(100, 0);
    TextureData.noSound = TextureData.cache.addTextureFromGraphic('noSound', _graphic);
  }

  public static getHealthSprite(tier: number): PIXI.Sprite {
    let sprite = new PIXI.Sprite(TextureData.health);
    switch (tier) {
      case 3: sprite.tint = Colors.GOLD; break;
      case 2: sprite.tint = Colors.SILVER; break;
      case 1: sprite.tint = Colors.BRONZE; break;
      default: sprite.tint = 0; break;
    }

    return sprite;
  }

  public static getKillSprite(tier: number): PIXI.Sprite {
    let sprite = new PIXI.Sprite(TextureData.kills);
    switch (tier) {
      case 3: sprite.tint = Colors.GOLD; break;
      case 2: sprite.tint = Colors.SILVER; break;
      case 1: sprite.tint = Colors.BRONZE; break;
      default: sprite.tint = 0; break;
    }

    return sprite;
  }
}
