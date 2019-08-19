import { JMERegister } from '../../JMGE/events/JMESelfRegister';
import { BaseObject } from '../objects/BaseObject';
import { JMEvents } from '../../JMGE/events/JMEvents';

export const GameEvents = {
  ticker: JMEvents.ticker,
  REQUEST_HEAL_PLAYER: new JMERegister<IHealEvent>(),
  REQUEST_PAUSE_GAME: new JMERegister<IPauseEvent>(),
  REQUEST_OVERFLOW_WORD: new JMERegister<IWordEvent>(),
  NOTIFY_UPDATE_INPUT_WORD: new JMERegister<IWordEvent>(),
  NOTIFY_LETTER_DELETED: new JMERegister<IDeleteEvent>(),
  NOTIFY_WORD_COMPLETED: new JMERegister<IWordEvent>(),
  NOTIFY_OBJECT_WORD_COMPLETED: new JMERegister<IObjectEvent>(),
  NOTIFY_SET_SCORE: new JMERegister<IScoreEvent>(),
  NOTIFY_SET_PROGRESS: new JMERegister<IProgressEvent>(),
  NOTIFY_SET_HEALTH: new JMERegister<IHealthEvent>(),
  NOTIFY_BOSS_DAMAGED: new JMERegister<IHealthEvent>(),
  NOTIFY_COMMANDS_COMPLETE: new JMERegister<IObjectEvent>(),
  // NOTIFY_ACHIEVEMENT: new JMERegister<{index: number}>(),
};

export interface IProgressEvent {
  current: number;
  total: number;
}

export interface IWordEvent {
  word: string;
}

export interface IObjectEvent {
  object: BaseObject;
}

export interface IHealthEvent {
  oldHealth: number;
  newHealth: number;
}

export interface IPauseEvent {
  paused: boolean;
}

export interface IScoreEvent {
  // index: number;
  oldScore: number;
  newScore: number;
}

export interface IHealEvent {
  amount: number;
}

export interface IDeleteEvent {
  numDeleted: number;
}
