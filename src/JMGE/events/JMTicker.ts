export const JMTicker = {
  tickEvents: [] as (() => void)[],

  active: false,

  add: (output: () => void) => {
    JMTicker.tickEvents.push(output);
    if (!JMTicker.active) {
      JMTicker.active = true;
      requestAnimationFrame(JMTicker.onTick);
    }
  },

  addOnce: (output: () => void) => {
    let m = () => {
      JMTicker.remove(m);
      output();
    };
    JMTicker.tickEvents.push(m);
  },

  remove: (output: () => void) => {
    let i = JMTicker.tickEvents.indexOf(output);
    if (i >= 0) {
      JMTicker.tickEvents.splice(i, 1);
    }
  },

  clear : () => {
    JMTicker.tickEvents = [];
  },

  onTick: () => {
    if (JMTicker.tickEvents.length === 0) {
      JMTicker.active = false;
    } else {
      JMTicker.tickEvents.forEach(output => output());
      requestAnimationFrame(JMTicker.onTick);
    }
  },
};
