import * as PIXI from 'pixi.js';

export interface IScrollbar {
  width: number;
  height: number;
  output?: (percent: number) => void;
  bgColor: number;
  moverColor: number;
  ratio?: number;
  position?: number;
  horizontal?: boolean;
}

export class Scrollbar extends PIXI.Container {
  public output: (percent: number) => void;
  private mover: PIXI.Graphics = new PIXI.Graphics();
  private topY: number = 0;
  private bottomY: number = 40;
  private dragging: boolean;
  private moverColor: number;
  private offset: number = 0;
  private ratio: number;
  private horizontal: boolean = false;

  constructor(private config: IScrollbar) {
    super();
    let background = new PIXI.Graphics();
    this.addChild(background);
    background.beginFill(config.bgColor).drawRoundedRect(0, 0, config.width, config.height, config.width / 2);
    this.addChild(this.mover);

    this.output = config.output;
    this.horizontal = config.horizontal;
    this.interactive = true;
    this.buttonMode = true;
    this.moverColor = config.moverColor || 0x333333;
    this.ratio = config.ratio || 0.5;
    this.drawMover(this.ratio);
    this.setPosition(config.position || 0);

    this.on('pointerdown', (e: PIXI.interaction.InteractionEvent) => {
      let point: PIXI.Point = e.data.getLocalPosition(this);
      this.dragging = true;
      if (this.horizontal) {
        this.offset = point.x - this.x - this.mover.x;
      } else {
        this.offset = point.y - this.y - this.mover.y;
      }
    });

    this.on('pointerup', () => {
      this.dragging = false;
    });

    this.on('pointerupoutside', () => {
      this.dragging = false;
    });

    this.on('pointermove', (e: any) => {
      if (this.dragging) {
        let point: PIXI.Point = e.data.getLocalPosition(this);
        if (this.horizontal) {
          let _x: number = point.x - this.x - this.offset;
          _x = Math.max(_x, this.topY);
          _x = Math.min(_x, this.bottomY);
          this.mover.x = _x;
        } else {
          let _y: number = point.y - this.y - this.offset;
          _y = Math.max(_y, this.topY);
          _y = Math.min(_y, this.bottomY);
          this.mover.y = _y;
        }
        if (this.output) this.output(this.getPosition());
      }
    });
  }

  public getWidth() {
    return this.config.width;
  }

  public getHeight() {
    return this.config.height;
  }

  public setPosition = (p: number) => {
    if (this.horizontal) {
      let _x: number = p * (this.bottomY - this.topY) + this.topY;
      this.mover.x = _x;
    } else {
      let _y: number = p * (this.bottomY - this.topY) + this.topY;
      this.mover.y = _y;
    }
    if (this.output != null) this.output(p);
  }

  public getPosition = () => {
    // returns 0-1
    if (this.horizontal) {
      return (this.mover.x - this.topY) / (this.bottomY - this.topY);
    } else {
      return (this.mover.y - this.topY) / (this.bottomY - this.topY);
    }
  }

  public startMove = (e: any) => {
    if (this.horizontal) {
      this.offset = e.x - this.x - this.mover.x;
    } else {
      this.offset = e.y - this.y - this.mover.y;
    }

    this.dragging = true;
  }

  private drawMover = (p: number) => {
    // p = 0-1
    p = Math.min(1, Math.max(0, p));
    if (p >= 1) this.visible = false;
    else this.visible = true;

    this.mover.clear();
    this.mover.beginFill(this.moverColor);
    if (this.horizontal) {
      this.mover.drawRoundedRect(0, 0, p * this.config.width, this.config.height, this.config.height / 2);
      this.bottomY = this.config.width - this.mover.width;
    } else {
      this.mover.drawRoundedRect(0, 0, this.config.width, p * this.config.height, this.config.width / 2);
      this.bottomY = this.config.height - this.mover.height;
    }
  }
}
