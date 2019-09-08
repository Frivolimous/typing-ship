export const JMTicker = {
  prevTime: -1,
  tickEvents: [] as ((ms?: number) => void)[],

  active: false,

  add: (output: (ms?: number) => void) => {
    JMTicker.tickEvents.push(output);
    if (!JMTicker.active) {
      JMTicker.active = true;
      requestAnimationFrame(JMTicker.onTick);
    }
  },

  addOnce: (output: (ms?: number) => void) => {
    let m = () => {
      JMTicker.remove(m);
      output();
    };
    JMTicker.tickEvents.push(m);
  },

  remove: (output: (ms?: number) => void) => {
    let i = JMTicker.tickEvents.indexOf(output);
    if (i >= 0) {
      JMTicker.tickEvents.splice(i, 1);
    }
  },

  clear : () => {
    JMTicker.tickEvents = [];
  },

  onTick: (time: number) => {
    let ms: number;
    if (JMTicker.prevTime < 0) {
      ms = 0;
    } else {
      ms = time - JMTicker.prevTime;
    }
    JMTicker.prevTime = time;

    if (JMTicker.tickEvents.length === 0) {
      JMTicker.active = false;
      JMTicker.prevTime = -1;
    } else {
      JMTicker.tickEvents.forEach(output => output(ms));
      requestAnimationFrame(JMTicker.onTick);
    }
  },
};
