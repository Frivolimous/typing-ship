import { ImageRepo } from '../../TextureData';
import { ActionType } from './Misc';

export interface IEnemyConfig {
  textureUrl: string;
  textureScale: number;
  wordSize: number;
  value: number;
  moveSpeed: number;
  turnRate?: number;
  fires: ActionType;
  killBy: ActionType;
  firePoint: PIXI.Point;
  shield: PIXI.Rectangle;
  health: number;
}

export interface IMissileConfig {
  textureUrl: string;
  textureScale: number;
  wordSize: number;
  value: number;
  moveSpeed: number;
  turnRate?: number;
  turnRateAccel?: number;
  killBy: ActionType;
  health: number;
}

export const EnemyData: { [key: string]: IEnemyConfig } = {
  sm: {
    textureUrl: ImageRepo.sm,
    textureScale: 0.7,
    shield: new PIXI.Rectangle(0, 0, 45, 45),
    health: 1,
    wordSize: 4,
    value: 5,
    moveSpeed: 1,
    fires: ActionType.MISSILE,
    killBy: ActionType.MISSILE,
    firePoint: new PIXI.Point(0, 0),
  },
  sl: {
    textureUrl: ImageRepo.sl,
    textureScale: 0.5,
    shield: new PIXI.Rectangle(0, 5, 55, 55),
    health: 1,
    wordSize: 5,
    value: 6,
    moveSpeed: 0.9,
    fires: ActionType.LASER,
    killBy: ActionType.MISSILE,
    firePoint: new PIXI.Point(0, -18),
  },
  ss: {
    textureUrl: ImageRepo.ss,
    textureScale: 0.1,
    shield: new PIXI.Rectangle(0, 0, 30, 30),
    health: 1,
    wordSize: 3,
    value: 5,
    moveSpeed: 0.8,
    fires: ActionType.SUICIDE,
    killBy: ActionType.LASER,
    firePoint: new PIXI.Point(0, 0),
  },
  mm: {
    textureUrl: ImageRepo.mm,
    textureScale: 0.8,
    shield: new PIXI.Rectangle(2, 0, 60, 60),
    health: 2,
    wordSize: 6,
    value: 6,
    moveSpeed: 0.8,
    fires: ActionType.MISSILE,
    killBy: ActionType.MISSILE,
    firePoint: new PIXI.Point(0, 0),
  },
  ml: {
    textureUrl: ImageRepo.ml,
    textureScale: 0.6,
    shield: new PIXI.Rectangle(0, 2, 70, 70),
    health: 2,
    wordSize: 7,
    value: 7,
    moveSpeed: 0.7,
    fires: ActionType.LASER,
    killBy: ActionType.MISSILE,
    firePoint: new PIXI.Point(-1, -28),
  },
  ms: {
    textureUrl: ImageRepo.ms,
    textureScale: 0.2,
    shield: new PIXI.Rectangle(0, 0, 35, 35),
    health: 1,
    wordSize: 3,
    value: 6,
    moveSpeed: 1,
    fires: ActionType.SUICIDE,
    killBy: ActionType.LASER,
    firePoint: new PIXI.Point(0, 0),
  },
  lm: {
    textureUrl: ImageRepo.lm,
    textureScale: 1,
    shield: new PIXI.Rectangle(1, 7, 82, 116),
    health: 4,
    wordSize: 8,
    value: 8,
    moveSpeed: 0.75,
    fires: ActionType.MISSILE,
    killBy: ActionType.MISSILE,
    firePoint: new PIXI.Point(0, 0),
  },
  ll: {
    textureUrl: ImageRepo.ll,
    textureScale: 0.7,
    shield: new PIXI.Rectangle(0, 8, 65, 110),
    health: 4,
    wordSize: 9,
    value: 9,
    moveSpeed: 0.65,
    fires: ActionType.LASER,
    killBy: ActionType.MISSILE,
    firePoint: new PIXI.Point(-3, -35),
  },
  xm: {
    textureUrl: ImageRepo.ls,
    textureScale: 0.5,
    shield: new PIXI.Rectangle(0, 0, 35, 50),
    health: 1,
    wordSize: 7,
    value: 8,
    moveSpeed: 0.9,
    fires: ActionType.AUTO_MISSILE,
    killBy: ActionType.MISSILE,
    firePoint: new PIXI.Point(0, 0),
  },
  nl: {
    textureUrl: null,
    textureScale: 1,
    shield: new PIXI.Rectangle(0, 0, 35, 50),
    health: 1,
    wordSize: 7,
    value: 0,
    moveSpeed: 1,
    fires: ActionType.LASER,
    killBy: ActionType.EMP,
    firePoint: new PIXI.Point(0, -10),
    turnRate: 0,
  },
};

export const MissileData: { player: IMissileConfig, enemy: IMissileConfig } = {
  player: {
    textureUrl: ImageRepo.playerMissile,
    textureScale: 0.1,
    wordSize: -1,
    value: 0,
    moveSpeed: 7,
    turnRate: 0,
    turnRateAccel: 0.002,
    killBy: ActionType.LASER,
    health: 1,
  },
  enemy: {
    textureUrl: ImageRepo.enemyMissile,
    textureScale: 0.1,
    wordSize: 3,
    value: 1,
    moveSpeed: 2,
    turnRate: 0,
    turnRateAccel: 0.002,
    killBy: ActionType.LASER,
    health: 1,
  },
};
