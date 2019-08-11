import * as JMBL from './JMBL';

interface ITweenProperty {
  key: string;
  start: number;
  end: number;

  inc?: number;

  incR?: number;
  incG?: number;
  incB?: number;
}

export class JMTween<T = any> {
  public running = false;

  private onUpdateCallback: (object: T) => void;
  private onCompleteCallback: (object: T) => void;
  private onWaitCompleteCallback: (object: T) => void;
  private properties: ITweenProperty[];
  private hasWait: boolean;
  private isColor: boolean;

  private cTicks: number = 0;
  private maxTicks: number = 0;
  private waitTicks: number = 0;

  constructor(private object: T) { }

  public onUpdate = (callback: (object: T) => void) => {
    this.onUpdateCallback = callback;

    return this;
  }

  public onComplete = (callback: (object: T) => void) => {
    this.onCompleteCallback = callback;

    return this;
  }

  public onWaitComplete = (callback: (object: T) => void) => {
    this.onWaitCompleteCallback = callback;

    return this;
  }

  public start = () => {
    this.running = true;

    this.properties.forEach(property => {
      this.object[property.key] = property.start;
    });

    JMBL.events.ticker.add(this.tickThis);

    return this;
  }

  public stop = () => {
    this.running = false;

    JMBL.events.ticker.remove(this.tickThis);

    return this;
  }

  public complete = () => {
    this.running = false;

    JMBL.events.ticker.remove(this.tickThis);

    this.properties.forEach(property => {
      this.object[property.key] = property.end;
    });

    if (this.onCompleteCallback) this.onCompleteCallback(this.object);

    return this;
  }

  public reset = () => {
    this.cTicks = this.waitTicks;
    if (this.waitTicks > 0) {
      this.hasWait = true;
    }

    return this;
  }

  public wait = (ticks: number) => {
    this.waitTicks = ticks;
    this.cTicks = -ticks;
    this.hasWait = true;

    return this;
  }

  public to = (props: Partial<T>, ticks: number) => {
    this.maxTicks = ticks;

    this.properties = [];

    for (let key of Object.keys(props)) {
      this.properties.push({key, start: this.object[key], end: props[key], inc: (props[key] - this.object[key]) / ticks});
    }

    return this;
  }

  public from = (props: Partial<T>, ticks: number) => {
    this.maxTicks = ticks;

    this.properties = [];

    for (let  key of Object.keys(props)) {
      this.properties.push({key, start: props[key], end: this.object[key], inc: (this.object[key] - props[key]) / ticks});
    }

    return this;
  }

  public colorTo = (props: Partial<T>, ticks: number) => {
    this.isColor = true;
    this.maxTicks = ticks;

    this.properties = [];

    for (let key of Object.keys(props)) {
      this.properties.push({
        key,
        start: this.object[key],
        end: props[key],
        incR: Math.floor(props[key] / 0x010000) - Math.floor(this.object[key] / 0x010000) / ticks,
        incG: Math.floor((props[key] % 0x010000) / 0x000100) - Math.floor((this.object[key] % 0x010000) / 0x000100) / ticks,
        incB: Math.floor(props[key] % 0x000100) - Math.floor(this.object[key] % 0x000100) / ticks,
      });
    }

    return this;
  }

  private tickThis = () => {
    this.cTicks ++;

    if (this.hasWait && this.cTicks > 0) {
      this.hasWait = false;
      if (this.onWaitCompleteCallback) this.onWaitCompleteCallback(this.object);
    } else if (this.cTicks <= 0) {
      return;
    }

    if (this.cTicks > this.maxTicks) {
      this.complete();
    } else {
      if (this.isColor) {
        this.properties.forEach(property => {
          this.object[property.key] = property.start + property.inc * this.cTicks;
          this.object[property.key] = property.start +
            Math.floor(property.incR * this.cTicks) * 0x010000 +
            Math.floor(property.incG * this.cTicks) * 0x000100 +
            Math.floor(property.incB * this.cTicks);
        });
      } else {
        this.properties.forEach(property => {
          this.object[property.key] = property.start + property.inc * this.cTicks;
        });
      }

      if (this.onUpdateCallback) this.onUpdateCallback(this.object);
    }
  }
}
