import * as _ from 'lodash';

import { JMInteractionEvents } from './events/JMInteractionEvents';
import { JMTextureCache } from './others/JMTextureCache';
export let initialized: boolean = false;
export let interactionMode: string = 'desktop';
export let sharedTextureCache: JMTextureCache;

export function setInteractionMode(s: string) {
  this.interactionMode = s;
}

export function init(app: PIXI.Application) {
  sharedTextureCache = new JMTextureCache(app.renderer);
  inputManager.init(app);
  initialized = true;
}

export class Rect extends PIXI.Rectangle {
  setLeft(n: number) {
    this.width += this.x - n;
    this.x = n;
  }

  setRight(n: number) {
    this.width += n - this.right;
  }

  setTop(n: number) {
    this.height -= n - this.y;
    this.y = n;
  }

  setBot(n: number) {
    this.height += n - this.top;
  }
}

export const inputManager = new class {
  MOUSE_HOLD: number = 200;
  mouse: MouseObject;
  app: PIXI.Application;

  public init(app: PIXI.Application) {
    this.app = app;
    this.mouse = new MouseObject();
    this.mouse.addCanvas(app.stage);

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    window.addEventListener("mousewheel", this.onWheel);
  }

  onWheel = (e: WheelEvent) => {
    JMInteractionEvents.MOUSE_WHEEL.publish({mouse: this.mouse, deltaY: e.deltaY });
  }

  onKeyDown = (e: any) => {
    //if (external keyboard override) dothat;
    switch (e.key) {
      case "a": case "A": break;
      case "Control": this.mouse.ctrlKey = true; break;
    }

    JMInteractionEvents.KEY_DOWN.publish({key: e.key});
  }

  onKeyUp = (e: any) => {
    switch (e.key) {
      case "Control": this.mouse.ctrlKey = false; break;
    }

    JMInteractionEvents.KEY_UP.publish({ key: e.key });
  }
}

export class MouseObject extends PIXI.Point {
  static HOLD: number = 200;
  //x,y;
  clickMode: boolean = false;
  down: boolean = false;
  ctrlKey: boolean = false;
  drag: DragObject;
  timerRunning: boolean = false;
  onUI: boolean = false;

  id: number;
  disabled: boolean = false;
  touchMode = false;
  target: any;

  private canvas: PIXI.Container;

  locationFilter: Function;

  constructor(config: IMouseObject = {}) {
    super(config.x, config.y);
    this.down = config.down || false;
    this.drag = config.drag || null;
    this.id = config.id || 0;
  }

  addCanvas(canvas: PIXI.Container) {

    // if (this.canvas){
    // 	this.removeCanvas();
    // }
    this.canvas = canvas;
    // canvas.on("mousedown",this.onDown);
    // canvas.on("mouseup",this.onUp);
    // if (interactionMode=="desktop"){
    // 	window.addEventListener("pointerup",this.onMouseUp);
    // }else{
    // 	window.addEventListener("touchend",this.onMouseUp);
    // }
    // canvas.on("mouseupoutside",this.onUp);
    // canvas.on("mousemove",this.onMove);
    canvas.addListener("touchstart", this.enableTouchMode);
    canvas.addListener("pointerdown", this.onDown);
    canvas.addListener("pointermove", this.onMove);
    canvas.addListener("pointerup", this.onUp);
    canvas.addListener("pointerupoutside", this.onUp);
  }

  // removeCanvas(){
  // 	this.canvas.off("mousedown",this.onDown);
  // 	this.canvas.off("mouseup",this.onUp);
  // 	this.canvas.off("mouseupoutside",this.onUp);
  // 	this.canvas.off("mousemove",this.onMove);
  // }

  enableTouchMode = () => {
    this.touchMode = true;
    this.canvas.removeListener("touchstart", this.enableTouchMode);
    this.canvas.addListener("mousedown", this.disableTouchMode);
    this.canvas.removeListener("pointerup", this.onUp);
    this.canvas.addListener("touchend", this.onUp);
  }

  disableTouchMode = () => {
    this.touchMode = false;
    this.canvas.removeListener("mousedown", this.disableTouchMode);
    this.canvas.addListener("touchstart", this.enableTouchMode);
    this.canvas.removeListener("touchend", this.onUp);
    this.canvas.addListener("pointerup", this.onUp);
  }


  startDrag = (target: any, onMove?: Function, onRelease?: Function, onDown?: Function, offset?: PIXI.Point) => {
    target.selected = true;
    this.drag = new DragObject(target, onMove, onRelease, onDown, offset);
  }

  endDrag = () => {
    if (this.drag) {
      if (this.drag.release(this)) {
        this.drag = null;
      }
    }
  }

  public onDown = (e) => {
    this.onMove(e);

    this.down = true;
    if (this.disabled || this.timerRunning) {
      return;
    }

    if (this.drag) {
      if (this.drag.down && this.drag.down(this)) {
        this.drag = null;
      }
    } else {
      if (this.clickMode) {
        this.timerRunning = true;
        setTimeout(() => {
          this.timerRunning = false;
          if (this.down) {
            JMInteractionEvents.MOUSE_DOWN.publish(this);
          }
        }, MouseObject.HOLD);
      } else {
        JMInteractionEvents.MOUSE_DOWN.publish(this);
      }
    }
  }

  public onUp = (e) => {
    this.onMove(e);
    this.down = false;

    if (this.disabled) {
      return;
    }
    if (this.drag) {
      this.endDrag();
    } else {
      if (this.clickMode && this.timerRunning) {
        JMInteractionEvents.MOUSE_CLICK.publish(this);
      } else {
        JMInteractionEvents.MOUSE_UP.publish(this);
      }
    }
  }

  public onMove = (e) => {
    this.target = e.target;
    if (e.target && e.target.isUI) {
      this.onUI = true;
    } else {
      this.onUI = false;
    }

    let point: PIXI.Point = e.data.getLocalPosition(this.canvas);
    if (this.locationFilter) {
      point = this.locationFilter(point, this.drag ? this.drag.object : null);
    }
    this.set(point.x, point.y);

    if (this.disabled) {
      return;
    }

    if (this.drag != null) {
      if (this.drag.move) {
        this.drag.move(this);
      }
    }

    JMInteractionEvents.MOUSE_MOVE.publish(this);
  }
}

export class DragObject {
  object: any;
  private onRelease: Function;
  private onDown: Function;
  private onMove: Function;
  public offset: PIXI.Point;

  constructor(object: any, onMove?: Function, onRelease?: Function, onDown?: Function, offset?: PIXI.Point) {
    this.object = object;
    this.onRelease = onRelease || this.nullFunc;
    this.onDown = onDown || this.nullFunc;
    this.onMove = onMove || this.nullFunc;
    this.offset = offset;
  }

  setOffset(x: number, y: number) {
    this.offset = new PIXI.Point(x, y);
  }

  nullFunc(object: any, e: MouseObject) {
    return true;
  };

  release(e: MouseObject): boolean {
    let m: boolean = this.onRelease(this.object, e);
    this.object.selected = !m;
    return m
  }

  move(e: MouseObject): boolean {
    return this.onMove(this.object, e);
  }

  down(e: MouseObject): boolean {
    let m: boolean = this.onDown(this.object, e);
    this.object.selected = !m;
    return m;
  }
}

export interface IMouseObject {
  x?: number,
  y?: number,
  down?: boolean,
  drag?: DragObject,
  id?: number,
}
