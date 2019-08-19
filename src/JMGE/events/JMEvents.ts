export class JMEvents {
  public static ticker = {
    add: (output: () => void) => JMEvents.tickEvents.push(output),
    addOnce: (output: () => void) => {
      let m = () => {
        JMEvents.ticker.remove(m);
        output();
      };
      JMEvents.tickEvents.push(m);
    },
    remove: (output: () => void) => {
      let i = JMEvents.tickEvents.indexOf(output);
      if (i >= 0) {
        JMEvents.tickEvents.splice(i, 1);
      }
    },
  };

  public static clearAllEvents = () => {
    JMEvents.registry = {};
    JMEvents.activeRegistry = [];
    JMEvents.tickEvents = [];
  }

  public static add = (type: string, output: (event: any) => void) => {
    if (!JMEvents.registry[type]) JMEvents.createRegister(type);

    JMEvents.registry[type].listeners.push(output);
  }

  public static addOnce = (type: string, output: (event: any) => void) => {
    if (!JMEvents.registry[type]) JMEvents.createRegister(type);

    JMEvents.registry[type].once.push(output);
  }

  public static remove = (type: string, output: (event: any) => void) => {
    if (JMEvents.registry[type]) {
      let i = JMEvents.registry[type].listeners.indexOf(output);
      if (i >= 0) {
        JMEvents.registry[type].listeners.splice(i, 1);
      }
    }
  }

  public static publish = (type: string, event?: any) => {
    if (!JMEvents.registry[type]) JMEvents.createRegister(type);
    JMEvents.registry[type].events.push(event);

    if (!JMEvents.registry[type].active) {
      JMEvents.registry[type].active = true;
      JMEvents.activeRegistry.push(JMEvents.registry[type]);
    }
  }

  public static selfPublish = (register: IJMERegister, event?: any, replaceCurrent?: boolean) => {
    if (replaceCurrent) {
      register.events = [event];
    } else {
      register.events.push(event);
    }
    if (!register.active) {
      register.active = true;
      JMEvents.activeRegistry.push(register);
    }
  }

  public static onTick = () => {
    while (JMEvents.activeRegistry.length > 0) {
      let register = JMEvents.activeRegistry.shift();
      register.active = false;

      while (register.events.length > 0) {
        let event = register.events.shift();
        register.listeners.forEach(output => output(event));

        while (register.once.length > 0) {
          register.once.shift()(event);
        }
      }
    }

    JMEvents.tickEvents.forEach(output => output());

    requestAnimationFrame(JMEvents.onTick);
  }

  private static registry: { [key: string]: IJMERegister } = {};
  private static activeRegistry: IJMERegister[] = [];
  private static tickEvents: (() => void)[] = [];

  private static createRegister = (type: string) => {
    JMEvents.registry[type] = {
      listeners: [],
      once: [],
      events: [],
      active: false,
    };
  }
}

export interface IJMERegister<T = any> {
  listeners: ((event: T) => void)[];
  once: ((event: T) => void)[];

  events: T[];
  active: boolean;
}

requestAnimationFrame(JMEvents.onTick);
