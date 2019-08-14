interface ITweenProperty {
  key: string;
  start: number;
  end: number;

  inc?: number;

  isColor?: boolean;
  incR?: number;
  incG?: number;
  incB?: number;

  eased?: boolean;
}

let running = false;
let tweenFuncs: ((time: number) => void)[] = [];

let _add = (func: (time: number) => void) => {
  tweenFuncs.push(func);
  _tryRun();
};

let _remove = (func: (time: number) => void) => {
  let index = tweenFuncs.indexOf(func);
  if (index >= 0) {
    tweenFuncs.splice(index, 1);
  }
};

let _tryRun = () => {
  if (!running && tweenFuncs.length > 0) {
    running = true;
    requestAnimationFrame(_tick);
  }
};

let _tick = (time: number) => {
  running = false;
  tweenFuncs.forEach(func => func(time));
  if (!running && tweenFuncs.length > 0) {
    running = true;
    requestAnimationFrame(_tick);
  }
};

export class JMTween<T = any> {
  public running = false;
  private started = false;

  private onUpdateCallback: (object: T) => void;
  private onCompleteCallback: (object: T) => void;
  private onWaitCompleteCallback: (object: T) => void;
  private properties: ITweenProperty[] = [];
  private hasWait: boolean;

  private _Easing: (percent: number) => number;

  private waitTime: number;
  private totalTime: number;

  private startTime: number;
  private endTime: number;

  private tickThis: (tick: number) => void;

  constructor(private object: T) {
    this.tickThis = this.firstTick;
  }

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

    _add(this.tickThis);

    return this;
  }

  public stop = () => {
    this.running = false;

    _remove(this.tickThis);

    return this;
  }

  public complete = () => {
    this.running = false;

    _remove(this.tickThis);
    console.log('DONE!');

    this.properties.forEach(property => {
      this.object[property.key] = property.end;
    });

    if (this.onCompleteCallback) this.onCompleteCallback(this.object);

    return this;
  }

  public reset = () => {
    this.started = false;
    this.tickThis = this.firstTick;
    if (this.waitTime) this.hasWait = true;

    return this;
  }

  public wait = (time: number) => {
    this.waitTime = time;
    this.hasWait = true;

    return this;
  }

  public to = (props: Partial<T>, time: number, eased = true) => {
    this.totalTime = time;

    for (let key of Object.keys(props)) {
      this.properties.push({ key, start: this.object[key], end: props[key], inc: (props[key] - this.object[key]), eased });
    }

    return this;
  }

  public from = (props: Partial<T>, time: number, eased = true) => {
    this.totalTime = time;

    for (let key of Object.keys(props)) {
      this.properties.push({ key, start: props[key], end: this.object[key], inc: (this.object[key] - props[key]), eased });
    }

    return this;
  }

  public colorTo = (props: Partial<T>, time: number, eased = true) => {
    this.totalTime = time;

    for (let key of Object.keys(props)) {
      this.properties.push({
        key,
        start: this.object[key],
        end: props[key],
        incR: Math.floor(props[key] / 0x010000) - Math.floor(this.object[key] / 0x010000),
        incG: Math.floor((props[key] % 0x010000) / 0x000100) - Math.floor((this.object[key] % 0x010000) / 0x000100),
        incB: Math.floor(props[key] % 0x000100) - Math.floor(this.object[key] % 0x000100),
        eased,
        isColor: true,
      });
    }

    return this;
  }

  public easing = (func: (percent: number) => number) => {
    this._Easing = func;

    return this;
  }

  private firstTick = (time: number) => {
    this.started = true;
    if (this.hasWait) {
      this.startTime = time + this.waitTime;
    } else {
      this.startTime = time;
    }
    this.endTime = this.startTime + (this.totalTime || 0);
    console.log('START', time, this.endTime);
    this.tickThis = this.tailTick;
  }

  private tailTick = (time: number) => {
    if (this.hasWait && time > this.startTime) {
      this.hasWait = false;
      if (this.onWaitCompleteCallback) this.onWaitCompleteCallback(this.object);
    }

    if (time > this.endTime) {
      this.complete();
    } else if (time > this.startTime) {
      let raw = (time - this.startTime) / this.totalTime;
      let eased: number = this._Easing ? this._Easing(raw) : raw;

      this.properties.forEach(property => {
        let percent = property.eased ? eased : raw;

        if (property.isColor) {
          this.object[property.key] = Math.round(property.start +
            Math.floor(property.incR * percent) * 0x010000 +
            Math.floor(property.incG * percent) * 0x000100 +
            Math.floor(property.incB * percent));
        } else {
          this.object[property.key] = property.start + property.inc * percent;
        }
      });

      if (this.onUpdateCallback) this.onUpdateCallback(this.object);
    }
  }
}

export const JMEasings = {
  linear: (p: number) => {
    return p;
  },
  quadIn: (p: number) => {
    return p * p;
  },
  quadOut: (p: number) => {
    return - p * (p - 2);
  },
  quad: (p: number) => {
    p *= 2;
    if (p < 1) {
      return p * p / 2;
    } else {
      p--;
      return - (p * (p - 2) - 1) / 2;
    }
  },
  cubicIn: (p: number) => {
    return p * p * p;
  },

  cubicOut: (p: number) => {
    p--;
    return p * p * p + 1;
  },

  cubic: (p: number) => {
    p *= 2;
    if (p < 1) {
      return p * p * p / 2;
    } else {
      p -= 2;
      return (p * p * p + 2) / 2;
    }
  },
};
