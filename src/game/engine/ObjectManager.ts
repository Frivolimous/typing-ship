import * as JMBL from '../../JMGE/JMBL';
import * as _ from 'lodash';
import { BaseObject } from '../objects/BaseObject';
import { FlyingText } from '../../JMGE/effects/FlyingText';
import { Firework } from '../../JMGE/effects/Firework';
import { Laser } from '../../JMGE/effects/Laser';
import { GameUI } from '../GameUI';
import { CONFIG } from '../../Config';
import { GameSprite } from '../objects/GameSprite';
import { GameEvents } from '../data/Misc';
import { TextObject } from '../text/TextObject';

export enum DisplayLayer {
  DEFAULT,
  EXPLOSIONS,
  ENEMIES,
  PROJECTILES,
  TEXT,
}

export class ObjectManager extends PIXI.Container {
  public objects: BaseObject[] = [];

  public layers: PIXI.Container[] = [];

  public gameUI: GameUI = new GameUI();

  private objectsByLayer: BaseObject[][] = [];

  constructor() {
    super();
    this.newLayer();
    this.newLayer();
    this.newLayer();
    this.newLayer();
    this.addChild(this.gameUI);
    this.newLayer();
  }

  public dispose() {
    while (this.layers.length > 0) {
      this.layers.shift().destroy();
    }
    this.objectsByLayer = null;
    while (this.objects.length > 0) {
      this.objects[0].dispose();
      this.objects.shift().destroy();
    }
    this.gameUI.dispose();
    this.destroy();
  }

  public newLayer() {
    let layer = new PIXI.Container();
    layer.x = layer.y = - CONFIG.INIT.STAGE_BUFFER / 2;
    this.layers.push(layer);
    this.addChild(layer);
    this.objectsByLayer.push([]);
  }

  // ==OBJECT MANAGING== \\
  public addObject(object: BaseObject, layer: DisplayLayer = DisplayLayer.DEFAULT, top: boolean = true) {
    if (top) {
      this.layers[layer].addChild(object);
    } else {
      this.layers[layer].addChildAt(object, 0);
    }
    this.objects.push(object);
    this.objectsByLayer[object.layer].push(object);
    object.layer = layer;

    return object;
  }

  public removeObject(object: BaseObject, andDestroy?: boolean): BaseObject {
    return this.removeObjectAt(this.getObjectIndex(object), andDestroy);
  }

  public removeObjectAt(i: number, andDestroy?: boolean): BaseObject {
    let object: BaseObject = this.objects[i];
    if (andDestroy) {
      object.dispose();
      object.destroy();
    }
    this.objects.splice(i, 1);
    _.pull(this.objectsByLayer[object.layer], object);

    return object;
  }

  public numObjects(layer: DisplayLayer = null) {
    if (layer) {
      return this.objectsByLayer[layer].length;
    }
    return this.objects.length;
  }

  public getObjectAt(i: number) {
    return this.objects[i];
  }

  public getObjectIndex(object: BaseObject) {
    for (let i: number = 0; i < this.objects.length; i += 1) {
      if (this.objects[i] === object) {
        return i;
      }
    }
    return -1;
  }

  public getClosestObject(point: { x: number, y: number }, maxDist: number, filter: IClosestProperties = {}): BaseObject {
    let objects: BaseObject[];

    if (filter.layer) {
      if (this.objectsByLayer[filter.layer] == null) return;
      objects = this.objectsByLayer[filter.layer];
    } else objects = this.objects;

    let m: BaseObject = null;
    let distance: number = maxDist;
    let distance2: number = 0;

    main: for (let object of objects) {
      if (filter.notThis && filter.notThis === object) continue main;

      if (filter.has) {
        for (let v in filter.has) {
          if (object[v] !== filter.has[v]) continue main;
        }
      }

      if (filter.greater) {
        for (let v in filter.greater) {
          if (object[v] <= filter.greater[v]) continue main;
        }
      }

      if (filter.less) {
        for (let v in filter.less) {
          if (object[v] >= filter.less[v]) continue main;
        }
      }

      if (filter.not) {
        for (let v in filter.not) {
          if (object[v] === filter.not[v]) continue main;
        }
      }

      distance2 = object.getDistance(point);
      if (distance2 <= distance) {
        distance = distance2;
        m = object;
      }
    }
    return m;
  }

  public forEach(_function: (object: BaseObject, index?: number, array?: BaseObject[]) => void, layer = -1) {
    if (layer >= 0) {
      this.objectsByLayer[layer].forEach(_function);
    } else {
      this.objects.forEach(_function);
    }
  }

  public updateAll = (param: any) => {
    for (let i: number = 0; i < this.objects.length; i += 1) {
      if (this.objects[i].toDestroy) {
        this.removeObjectAt(i, true);
        i -= 1;
      } else {
        this.objects[i].update(param);
      }
    }

    for (let i = 0; i < TextObject.allTextObjects.length; i++) {
      let object = TextObject.allTextObjects[i];
      if (object.following) {
        if (object.following.toDestroy) {
          let text = object.getText();
          if (text) {
            JMBL.events.publish(GameEvents.REQUEST_OVERFLOW_WORD, text);
          }
          object.remove();
          i--;
        } else {
          if (!object.parent) {
            this.layers[DisplayLayer.TEXT].addChild(object);
          }
          object.update();
        }
      }
    }
  }

  // ==EFFECTS== \\

  public makeScoreDisplay(x: number, y: number, value: number) {
    if (value > 0) {
      new FlyingText('+' + String(value), { fontFamily: 'Arial', fontSize: 14 + value / 20, fill: 0x00ff00 }, x, y, this.layers[DisplayLayer.TEXT]);
    } else if (value < 0) {
      new FlyingText(String(value), { fontFamily: 'Arial', fontSize: 14 - value / 20, fill: 0xff0000 }, x, y, this.layers[DisplayLayer.TEXT]);
    }
  }

  public makeExplosionAt(x: number, y: number, size: number = 40) {
    new Firework(this.layers[DisplayLayer.EXPLOSIONS], x, y, size);
  }

  public makeLaser(origin: GameSprite, target: GameSprite, color: number) {
    new Laser(origin.getFirePoint(), target, color, 1, this.layers[DisplayLayer.PROJECTILES]);
  }

  public makeEMP(origin: GameSprite, target: GameSprite) {
    new Laser(origin.getFirePoint(), target, 0x99ffff, 3, this.layers[DisplayLayer.PROJECTILES]);
  }
}

export interface IClosestProperties {
  notThis?: BaseObject;
  layer?: any;
  has?: any;
  not?: any;
  greater?: any;
  less?: any;
}
