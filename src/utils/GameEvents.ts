import { JMEventListener } from '../JMGE/events/JMEventListener';
import { BaseObject } from '../game/objects/BaseObject';
import { JMTicker } from '../JMGE/events/JMTicker';
import { ILevelInstance } from '../data/LevelInstance';

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
  NOTIFY_ENEMY_ESCAPED: new JMEventListener<IObjectEvent>(),
  NOTIFY_ENEMY_DESTROYED: new JMEventListener<IObjectEvent>(),
  NOTIFY_TEST_COMPLETE: new JMEventListener<ITestEvent>(),
  NOTIFY_LEVEL_COMPLETED: new JMEventListener<ILevelEvent>(),
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

export interface ILevelEvent {
  levelIndex: number;
  difficulty: number;
  levelInstance: ILevelInstance;
  win: boolean;
}
