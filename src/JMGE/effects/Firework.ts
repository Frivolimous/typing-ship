import * as PIXI from 'pixi.js';
import * as JMBL from '../JMBL';
import { JMTicker } from '../events/JMTicker';

interface IFirework {
  x?: number;
  y?: number;
  color?: number;
  gravity?: number;
  fade?: number;
  startVX?: number;
  startVY?: number;
  numParts?: number;
  size?: number;
}

export class Firework {
  public static TEXTURE: PIXI.Texture;
  private static particles: FireworkParticle[] = [];
  private static initialized: boolean = false;

  private static initialize() {
    if (!this.initialized) {
      let firework = new PIXI.Graphics();
      firework.beginFill(0xffffff);
      firework.drawCircle(0, 0, 5);
      Firework.TEXTURE = JMBL.sharedTextureCache.addTextureFromGraphic('firework', firework);
      JMTicker.add(this.onTick.bind(this));
      this.initialized = true;
    }
  }

  private static onTick() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      if (this.particles[i].alpha < 0.1) {
        this.particles[i].destroy();
        this.particles.splice(i, 1);
        i -= 1;
      }
    }
    // if (this.particles.length>0) console.log(this.particles[0].x+" "+this.particles[0].y);
  }

  constructor(stage: PIXI.Container, x: number, y: number, count: number) {
    if (!Firework.initialized) Firework.initialize();

    for (let i = 0; i < count; i += 1) {
      let particle: FireworkParticle = new FireworkParticle(x, y);
      Firework.particles.push(particle);
      stage.addChild(particle);
    }
  }
}

class FireworkParticle extends PIXI.Sprite {
  private fade: number = 0.01;
  private vX: number = 0.6;
  private vY: number = 0.6;

  constructor(x: number, y: number) {
    super(Firework.TEXTURE);
    this.x = x;
    this.y = y;
    this.vX = Math.random() * this.vX - this.vX / 2;
    this.vY = Math.random() * this.vY - this.vY / 2;
    this.alpha = 1 + Math.random() * 0.5;
    let size = 2 + Math.random() * 8;
    this.width = size;
    this.height = size;
    this.tint = 0xcccccc;
  }

  public update = () => {
    this.x += this.vX;
    this.y += this.vY;
    this.alpha -= this.fade;
  }
}
