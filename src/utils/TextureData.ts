import * as PIXI from 'pixi.js';
import { JMTextureCache, sharedTextureCache } from '../JMGE/others/JMTextureCache';
import { Colors } from '../data/Colors';

export const ImageRepo = {
  sm: '.assets/Bitmaps/Separate/sm.png',
  mm: '.assets/Bitmaps/Separate/mm.png',
  lm: '.assets/Bitmaps/Separate/lm.png',
  sl: '.assets/Bitmaps/Separate/sl.png',
  ml: '.assets/Bitmaps/Separate/ml.png',
  ll: '.assets/Bitmaps/Separate/ll.png',
  ss: '.assets/Bitmaps/Separate/ss.png',
  ms: '.assets/Bitmaps/Separate/ms.png',
  ls: '.assets/Bitmaps/Separate/ls.png',
  turret: '.assets/Bitmaps/Separate/turret.png',
  superman: '.assets/Bitmaps/Separate/superman.png',
  player: '.assets/Bitmaps/Rye/shpfinal.png',
  hud: '.assets/Bitmaps/Rye/hud1.png',
  playerMissile: '.assets/Bitmaps/Separate/missiles/p mi.png',
  enemyMissile: '.assets/Bitmaps/Separate/missiles/me ship 1.png',
  boss0: '.assets/Bitmaps/Separate/boss/boss0.png',
  boss1: '.assets/Bitmaps/Separate/boss/boss1.png',
  boss2: '.assets/Bitmaps/Separate/boss/boss2.png',
  boss2a: '.assets/Bitmaps/Separate/boss/boss2a.png',
  boss2b: '.assets/Bitmaps/Separate/boss/boss2b.png',
  boss2c: '.assets/Bitmaps/Separate/boss/boss2c.png',
  boss0Over0: '.assets/Bitmaps/doors2.png',
  boss0Over1: '.assets/Bitmaps/doors3.png',
  boss0Over2: '.assets/Bitmaps/doors4.png',
  boss2Over0: '.assets/Bitmaps/Separate/laser/laser 1.png',
  boss2Over1a: '.assets/Bitmaps/Separate/laser/laser shield 1.png',
  boss2Over1b: '.assets/Bitmaps/Separate/laser/laser shield 2.png',
  boss2Over1c: '.assets/Bitmaps/Separate/laser/laser shield 3.png',
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
  public static bigX: PIXI.Texture;

  public static init = () => {
    TextureData.cache = sharedTextureCache;

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

    _graphic.clear();
    _graphic.beginFill(0xff0000);
    // _graphic.drawRect(40, 0, 20, 100);
    _graphic.moveTo(5, 0);
    _graphic.lineTo(50, 45);
    _graphic.lineTo(95, 0);
    _graphic.lineTo(100, 5);
    _graphic.lineTo(55, 50);
    _graphic.lineTo(100, 95);
    _graphic.lineTo(95, 100);
    _graphic.lineTo(50, 55);
    _graphic.lineTo(5, 100);
    _graphic.lineTo(0, 95);
    _graphic.lineTo(45, 50);
    _graphic.lineTo(0, 5);
    _graphic.lineTo(5, 0);
    // _graphic.drawRect(0, 40, 100, 20);
    // _graphic.rotation = Math.PI / 4;
    TextureData.bigX = TextureData.cache.addTextureFromGraphic('bigX', _graphic);
    _graphic.rotation = 0;

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
