import * as PIXI from 'pixi.js';
import * as _ from 'lodash';

import { JMTextureCache } from './others/JMTextureCache';
import { InputManager } from './events/JMInputManager';

let initialized: boolean = false;
export let interactionMode: string = 'desktop';
export let sharedTextureCache: JMTextureCache;
export let inputManger: InputManager;

export function setInteractionMode(s: string) {
  this.interactionMode = s;
}

export function init(app: PIXI.Application) {
  if (!initialized) {
    sharedTextureCache = new JMTextureCache(app.renderer);
    inputManger = new InputManager(app);
    initialized = true;
  }
}