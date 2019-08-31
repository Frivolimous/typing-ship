import { JMEventListener } from '../../JMGE/events/JMEventListener';
import { BaseObject } from '../objects/BaseObject';
import { JMTicker } from '../../JMGE/events/JMTicker';

export const GameEvents = {
  ticker: JMTicker,
  REQUEST_HEAL_PLAYER: new JMEventListener<IHealEvent>(),
  REQUEST_PAUSE_GAME: new JMEventListener<IPauseEvent>(),
  REQUEST_MUTE_GAME: new JMEventListener<IMuteEvent>(),
  REQUEST_OVERFLOW_WORD: new JMEventListener<IWordEvent>(),
  NOTIFY_UPDATE_INPUT_WORD: new JMEventListener<IWordEvent>(),
  NOTIFY_LETTER_DELETED: new JMEventListener<IDeleteEvent>(),
  NOTIFY_LETTER_ADDED: new JMEventListener<ILetterEvent>(),
  NOTIFY_WORD_COMPLETED: new JMEventListener<IWordEvent>(),
  NOTIFY_OBJECT_WORD_COMPLETED: new JMEventListener<IObjectEvent>(),
  NOTIFY_SET_SCORE: new JMEventListener<IScoreEvent>(),
  NOTIFY_SET_PROGRESS: new JMEventListener<IProgressEvent>(),
  NOTIFY_SET_HEALTH: new JMEventListener<IHealthEvent>(),
  NOTIFY_BOSS_DAMAGED: new JMEventListener<IHealthEvent>(),
  NOTIFY_COMMANDS_COMPLETE: new JMEventListener<IObjectEvent>(),
  NOTIFY_ENEMY_DESTROYED: new JMEventListener<IObjectEvent>(),
  NOTIFY_TEST_COMPLETE: new JMEventListener<ITestEvent>(),
  // NOTIFY_ACHIEVEMENT: new JMEventListener<{index: number}>(),

  clearAll : () => {
    JMTicker.clear(),
    GameEvents.REQUEST_HEAL_PLAYER.clear();
    GameEvents.REQUEST_PAUSE_GAME.clear();
    GameEvents.REQUEST_MUTE_GAME.clear();
    GameEvents.REQUEST_OVERFLOW_WORD.clear();
    GameEvents.NOTIFY_UPDATE_INPUT_WORD.clear();
    GameEvents.NOTIFY_LETTER_ADDED.clear();
    GameEvents.NOTIFY_LETTER_DELETED.clear();
    GameEvents.NOTIFY_WORD_COMPLETED.clear();
    GameEvents.NOTIFY_OBJECT_WORD_COMPLETED.clear();
    GameEvents.NOTIFY_SET_SCORE.clear();
    GameEvents.NOTIFY_SET_PROGRESS.clear();
    GameEvents.NOTIFY_SET_HEALTH.clear();
    GameEvents.NOTIFY_BOSS_DAMAGED.clear();
    GameEvents.NOTIFY_COMMANDS_COMPLETE.clear();
    GameEvents.NOTIFY_ENEMY_DESTROYED.clear();
    // GameEvents.NOTIFY_TEST_COMPLETE.clear();
  },
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

export interface IMuteEvent {
  muted: boolean;
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

export interface ILetterEvent {
  letter: string;
}

export interface ITestEvent {
  wpm: number;
}
