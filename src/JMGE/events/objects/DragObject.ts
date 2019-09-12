import * as PIXI from 'pixi.js';
import { MouseObject } from "./MouseObject";

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