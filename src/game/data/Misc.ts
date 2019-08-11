import { BaseObject } from '../objects/BaseObject';

export enum GameEvents {
  REQUEST_HEAL_PLAYER = 'healPlayer', // healAmount:number
  REQUEST_PAUSE_GAME = 'requestPauseGame', // forceTo:boolean
  REQUEST_OVERFLOW_WORD = 'overflowWord', // word:string

  NOTIFY_UPDATE_INPUT_WORD = 'updateInputWord', // word:string
  NOTIFY_LETTER_DELETED = 'letterDeleted', // numDeleted:number
  NOTIFY_WORD_COMPLETED = 'wordComplete', // word:string
  NOTIFY_OBJECT_WORD_COMPLETED = 'ObjectWordCompleted', // object:BaseObject
  NOTIFY_SET_SCORE = 'setScore', // newScore:number
  NOTIFY_SET_PROGRESS = 'setProgress', // progress:ISetProgress
  NOTIFY_SET_HEALTH = 'setHealth', // newHealth:number
  NOTIFY_BOSS_DAMAGED = 'bossDamaged', // newHealth:number
  NOTIFY_COMMANDS_COMPLETE = 'commandsComplete', // object:BaseObject
  NOTIFY_ACHIEVEMENT = 'achievement', // index:number
}

export interface ISetProgress {
  current: number;
  total: number;
}

export enum ActionType {
  MISSILE,
  LASER,
  SUICIDE,
  AUTO_MISSILE,
  EMP,
  INSTANT,
}
