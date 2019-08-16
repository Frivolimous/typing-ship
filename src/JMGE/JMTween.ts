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
let tweens: JMTween[] = [];

let _add = (tween: JMTween) => {
  tweens.push(tween);
  _tryRun();
};

let _remove = (tween: JMTween) => {
  let index = tweens.indexOf(tween);
  if (index >= 0) {
    tweens.splice(index, 1);
  }
};

let _tryRun = () => {
  if (!running && tweens.length > 0) {
    running = true;
    requestAnimationFrame(_tick);
  }
};

let _tick = (time: number) => {
  running = false;
  tweens.forEach(tween => tween.tickThis(time));
  if (!running && tweens.length > 0) {
    running = true;
    requestAnimationFrame(_tick);
  }
};

export class JMTween<T = any> {
  public running = false;
  public tickThis: (time: number) => void;

  private onUpdateCallback: (object: T) => void;
  private onCompleteCallback: (object: T) => void;
  private onWaitCompleteCallback: (object: T) => void;
  private properties: ITweenProperty[] = [];
  private hasWait: boolean;

  // private nextTween: JMTween;

  private _Easing: (percent: number) => number;

  private waitTime: number;
  // private totalTime: number;

  private startTime: number;
  private endTime: number;

  constructor(private object: T, private totalTime: number = 200) {
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

    _add(this);

    return this;
  }

  public stop = () => {
    this.running = false;

    _remove(this);

    return this;
  }

  public complete = (time: number) => {
    this.running = false;

    _remove(this);

    this.properties.forEach(property => {
      this.object[property.key] = property.end;
    });

    this.tickThis = () => {};
    if (this.onCompleteCallback) this.onCompleteCallback(this.object);

    // if (this.nextTween) {
    //   this.nextTween.start();
    //   this.nextTween.tickThis(time);
    // }
    return this;
  }

  public reset = () => {
    this.tickThis = this.firstTick;
    if (this.waitTime) this.hasWait = true;

    return this;
  }

  public wait = (time: number) => {
    this.waitTime = time;
    this.hasWait = true;

    return this;
  }

  public over = (time: number) => {
    this.totalTime = time;

    return this;
  }

  public to = (props: Partial<T>, eased = true) => {
    for (let key of Object.keys(props)) {
      this.properties.push({ key, start: this.object[key], end: props[key], inc: (props[key] - this.object[key]), eased });
    }

    return this;
  }

  public from = (props: Partial<T>, eased = true) => {
    for (let key of Object.keys(props)) {
      this.properties.push({ key, start: props[key], end: this.object[key], inc: (this.object[key] - props[key]), eased });
    }

    return this;
  }

  public colorTo = (props: Partial<T>, eased = true) => {
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

  // public thenTween<U>(nextObj: U) {
  //   this.nextTween = new JMTween<U>(nextObj);

  //   return this.nextTween;
  // }

  private firstTick = (time: number) => {
    if (this.hasWait) {
      this.startTime = time + this.waitTime;
    } else {
      this.startTime = time;
    }
    this.endTime = this.startTime + (this.totalTime || 0);
    this.tickThis = this.tailTick;
  }

  private tailTick = (time: number) => {
    if (this.hasWait && time > this.startTime) {
      this.hasWait = false;
      if (this.onWaitCompleteCallback) this.onWaitCompleteCallback(this.object);
    }

    if (time > this.endTime) {
      this.complete(time);
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

export const JMEasing = {

  Linear: {

    None: (k: number) => {

      return k;

    },

  },

  Quadratic: {

    In: (k: number) => {

      return k * k;

    },

    Out: (k: number) => {

      return k * (2 - k);

    },

    InOut: (k: number) => {
      k *= 2;
      if (k < 1) {
        return 0.5 * k * k;
      }

      return - 0.5 * (--k * (k - 2) - 1);

    },

  },

  Cubic: {

    In: (k: number) => {

      return k * k * k;

    },

    Out: (k: number) => {

      return --k * k * k + 1;

    },

    InOut: (k: number) => {
      k *= 2;
      if (k < 1) {
        return 0.5 * k * k * k;
      }

      return 0.5 * ((k -= 2) * k * k + 2);

    },

  },

  Quartic: {

    In: (k: number) => {

      return k * k * k * k;

    },

    Out: (k: number) => {

      return 1 - (--k * k * k * k);

    },

    InOut: (k: number) => {
      k *= 2;
      if (k < 1) {
        return 0.5 * k * k * k * k;
      }

      return - 0.5 * ((k -= 2) * k * k * k - 2);

    },

  },

  Quintic: {

    In: (k: number) => {

      return k * k * k * k * k;

    },

    Out: (k: number) => {

      return --k * k * k * k * k + 1;

    },

    InOut: (k: number) => {
      k *= 2;
      if (k < 1) {
        return 0.5 * k * k * k * k * k;
      }

      return 0.5 * ((k -= 2) * k * k * k * k + 2);

    },

  },

  Sinusoidal: {

    In: (k: number) => {

      return 1 - Math.cos(k * Math.PI / 2);

    },

    Out: (k: number) => {

      return Math.sin(k * Math.PI / 2);

    },

    InOut: (k: number) => {

      return 0.5 * (1 - Math.cos(Math.PI * k));

    },

  },

  Exponential: {

    In: (k: number) => {

      return k === 0 ? 0 : Math.pow(1024, k - 1);

    },

    Out: (k: number) => {

      return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

    },

    InOut: (k: number) => {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }
      k *= 2;
      if (k < 1) {
        return 0.5 * Math.pow(1024, k - 1);
      }

      return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

    },

  },

  Circular: {

    In: (k: number) => {

      return 1 - Math.sqrt(1 - k * k);

    },

    Out: (k: number) => {

      return Math.sqrt(1 - (--k * k));

    },

    InOut: (k: number) => {
      k *= 2;
      if (k < 1) {
        return - 0.5 * (Math.sqrt(1 - k * k) - 1);
      }

      return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

    },

  },

  Elastic: {

    In: (k: number) => {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

    },

    Out: (k: number) => {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

    },

    InOut: (k: number) => {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      k *= 2;

      if (k < 1) {
        return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
      }

      return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

    },

  },

  Back: {

    In: (k: number) => {

      let s = 1.70158;

      return k * k * ((s + 1) * k - s);

    },

    Out: (k: number) => {

      let s = 1.70158;

      return --k * k * ((s + 1) * k + s) + 1;

    },

    InOut: (k: number) => {

      let s = 1.70158 * 1.525;
      k *= 2;
      if (k < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }

      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

    },

  },

  Bounce: {

    In: (k: number) => {

      return 1 - JMEasing.Bounce.Out(1 - k);

    },

    Out: (k: number) => {

      if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
      } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
      } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
      } else {
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
      }

    },

    InOut: (k: number) => {

      if (k < 0.5) {
        return JMEasing.Bounce.In(k * 2) * 0.5;
      }

      return JMEasing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

    },

  },

};
