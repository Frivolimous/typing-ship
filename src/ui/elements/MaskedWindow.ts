import * as PIXI from 'pixi.js';
import { Scrollbar } from './Scrollbar';
import { JMTicker } from '../../JMGE/events/JMTicker';

export interface IMaskedWindow {
  width?: number;
  height?: number;
  maskHeight?: number;
  maskWidth?: number;
  autoSort?: boolean;
  sortMargin?: number;
  horizontal?: boolean;
}

export class MaskedWindow extends PIXI.Container {
  public container: PIXI.Container;
  private objects: PIXI.DisplayObject[] = [];
  private autoSort: boolean;
  private offset: number = 0;
  private goalY: number = 1;
  private scrollbar: Scrollbar = null;
  private vY: number = 0;
  private sortMargin: number = 5;
  private dragging: boolean = false;
  private scrollHeight: number = 0;
  private horizontal: boolean = false;

  constructor(private config: IMaskedWindow) {
    super();
    this.container = new PIXI.Container();
    this.addChild(this.container);

    this.mask = new PIXI.Graphics();
    this.addChild(this.mask);
    this.mask.beginFill(0);
    this.mask.drawRect(0, 0, config.width, config.height);
    this.autoSort = config.autoSort || false;
    this.interactive = true;
    this.sortMargin = config.sortMargin || 5;
    this.horizontal = config.horizontal;

    this.on('mousedown', (e: PIXI.interaction.InteractionEvent) => {
      let point: PIXI.Point = e.data.getLocalPosition(this);
      if (this.horizontal) {
        this.offset = point.x - this.x - this.container.x;
      } else {
        this.offset = point.y - this.y - this.container.y;
      }
      this.dragging = true;
    });

    this.on('mouseup', () => {
      this.goalY = 1;
      this.dragging = false;
    });

    this.on('mouseupoutside', () => {
      this.goalY = 1;
      this.dragging = false;
    });

    this.on('mousemove', (e: PIXI.interaction.InteractionEvent) => {
      let point: PIXI.Point = e.data.getLocalPosition(this);
      if (this.dragging) {
        if (this.horizontal) {
          this.goalY = point.x - this.x - this.offset;
          this.vY = (this.goalY - this.container.x) / 4;
        } else {
          this.goalY = point.y - this.y - this.offset;
          this.vY = (this.goalY - this.container.y) / 4;
        }
      }
    });

    JMTicker.add(this.update);
  }
  public addScrollbar = (_scrollbar: Scrollbar) => {
    this.scrollbar = _scrollbar;
    _scrollbar.output = this.setScroll;
  }

  public onWheel = (e: any) => {
    if (e.mouse.x > this.x && e.mouse.x < this.x + this.mask.width && e.mouse.y > this.y && e.mouse.y < this.y + this.mask.height) {
      this.vY -= e.delta * 0.008;
    }
  }

  public setScroll = (p: number) => {
    if (this.horizontal) {
      if (this.scrollHeight > this.mask.width) {
        this.container.x = p * (this.mask.width - this.scrollHeight);
        if (this.container.x > 0) this.container.x = 0;
        if (this.container.x < this.mask.width - this.scrollHeight) this.container.x = this.mask.width - this.scrollHeight;
      } else {
        this.container.x = 0;
      }
    } else {
      if (this.scrollHeight > this.mask.height) {
        this.container.y = p * (this.mask.height - this.scrollHeight);
        if (this.container.y > 0) this.container.y = 0;
        if (this.container.y < this.mask.height - this.scrollHeight) this.container.y = this.mask.height - this.scrollHeight;
      } else {
        this.container.y = 0;
      }
    }
  }

  public getRatio = (): number => {
    if (this.horizontal) {
      return Math.min(1, this.mask.width / this.scrollHeight);
    } else {
      return Math.min(1, this.mask.height / this.scrollHeight);
    }
  }

  public addObject = (_object: any) => {
    this.objects.push(_object);
    _object.x -= this.x - this.container.x;
    _object.y -= this.y - this.container.y;
    this.container.addChild(_object);
    if (this.autoSort) this.sortObjects();
  }

  public removeObject = (_object: any) => {
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i] === _object) {
        this.removeObjectAt(i);
        return;
      }
    }
  }

  public removeObjectAt = (i: number) => {
    this.container.removeChild(this.objects[i]);
    this.objects.splice(i, 1);
    if (this.autoSort) this.sortObjects();
  }

  public sortObjects = () => {
    this.scrollHeight = this.sortMargin;

    for (let i = 0; i < this.objects.length; i++) {
      if (this.horizontal) {
        this.objects[i].x = this.scrollHeight;
        // this.objects[i].x=this.objects[i].graphics.width/2;
        // this.objects[i].timeout = false;
        this.objects[i].y = 0;
        this.scrollHeight += this.objects[i].getBounds().width + this.sortMargin;
      } else {
        this.objects[i].y = this.scrollHeight;
        // this.objects[i].x=this.objects[i].graphics.width/2;
        // this.objects[i].timeout = false;
        this.objects[i].x = 0;
        this.scrollHeight += this.objects[i].getBounds().height + this.sortMargin;
      }
    }
  }

  public updateScrollHeight() {
    if (this.horizontal) {
      this.scrollHeight = (this.container as any).getWidth();

    } else {
      this.scrollHeight = (this.container as any).getHeight();
    }
  }

  private update = () => {
    if (this.horizontal) {
      if (this.goalY <= 0) {
        this.vY = (this.goalY - this.container.x) / 4;
      }
      if (this.vY !== 0) {
        if (Math.abs(this.vY) < 0.1) this.vY = 0;
        else {
          let _y: number = this.container.x + this.vY;
          _y = Math.min(0, Math.max(_y, this.mask.width - this.scrollHeight));
          this.vY *= 0.95;
          if (this.scrollbar != null) this.scrollbar.setPosition(_y / (this.mask.width - this.scrollHeight));
          else this.setScroll(_y / (this.mask.width - this.scrollHeight));
        }
      }
    } else {
      if (this.goalY <= 0) {
        this.vY = (this.goalY - this.container.y) / 4;
      }
      if (this.vY !== 0) {
        if (Math.abs(this.vY) < 0.1) this.vY = 0;
        else {
          let _y: number = this.container.y + this.vY;
          _y = Math.min(0, Math.max(_y, this.mask.height - this.scrollHeight));
          this.vY *= 0.95;
          if (this.scrollbar != null) this.scrollbar.setPosition(_y / (this.mask.height - this.scrollHeight));
          else this.setScroll(_y / (this.mask.height - this.scrollHeight));
        }
      }
    }
  }
}
