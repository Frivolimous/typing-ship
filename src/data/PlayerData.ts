export enum BadgeState {
  NONE,
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM,
}

export enum Badges {
  SOLDIER_BRONZE,
  SOLDIER_SILVER,
  SOLDIER_GOLD,
  CONQUEROR_BRONZE,
  CONQUEROR_SILVER,
  CONQUEROR_GOLD,
  RIDDLER_BRONZE,
  RIDDLER_SILVER,
  RIDDLER_GOLD,
  DEFENDER_BRONZE, DEFENDER_SILVER, DEFENDER_GOLD,
  PERFECTION_BRONZE,
  PERFECTION_SILVER,
  PERFECTION_GOLD,
  EXPLORER_BRONZE,
  EXPLORER_SILVER,
  EXPLORER_GOLD,
}

export class ExtrinsicModel {
  public static loadExtrinsic = (data: IExtrinsicData) => {
    return new ExtrinsicModel(data);
  }

  constructor(public data?: IExtrinsicData) {
    if (!data) {
      this.data = {
        badges: [],
        levels: [
          {score: 100, highestDifficulty: 0, killBadge: 0, healthBadge: 3},
          {score: 100, highestDifficulty: 1, killBadge: 1, healthBadge: 2},
          {score: 100, highestDifficulty: 2, killBadge: 2, healthBadge: 1},
          {score: 100, highestDifficulty: 3, killBadge: 3, healthBadge: 0},
          {score: 100, highestDifficulty: 4},
          {score: 0},
        ],
        scores: {
          kills: 0,
          deaths: 0,
          playtime: 0,
        },
      };
    }
  }
}

export interface IExtrinsicData {
  badges: boolean[];
  levels: ILevelScores[];
  scores: {
    kills: number,
    deaths: number,
    playtime: number,
  };
}

export interface ILevelScores {
  healthBadge?: number;
  killBadge?: number;
  score?: number;
  highestDifficulty?: number;
}

export function calcHealthPercent(health: number, maxHealth: number, neverHurt: boolean) {
  return neverHurt ? 2 : health / maxHealth;
}

export function calcKillPercent(numKilled: number, numEnemies: number) {
  return numKilled / numEnemies;
}

export function calcScoreSteps(baseScore: number, healthPercent: number, killPercent: number, difficulty: number): [string, number][] {
  let m: [string, number][] = [];

  let score = baseScore;
  m.push(['LEVEL SCORE:', score]);
  let diffMult = 1 + difficulty * 0.15;
  score *= diffMult;
  m.push(['DIFFICULTY BONUS x' + diffMult, score]);
  score *= healthPercent;
  m.push(['HEALTH BONUS x' + healthPercent, score]);
  score *= killPercent;
  m.push(['KILL BONUS x' + killPercent, score]);

  return m;
}
