import * as PIXI from 'pixi.js';
import { JMInteractionEvents } from "../JMInteractionEvents";
import { DragObject } from "./DragObject";

export interface IMouseObject {
  x?: number,
  y?: number,
  down?: boolean,
  drag?: DragObject,
  id?: number,
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

  public onDown = (e: any) => {
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

  public onUp = (e: any) => {
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

  public onMove = (e: any) => {
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