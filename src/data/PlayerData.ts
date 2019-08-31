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
          // {score: 100, highestDifficulty: 0, killBadge: 0, healthBadge: 3},
          // {score: 100, highestDifficulty: 1, killBadge: 1, healthBadge: 2},
          // {score: 100, highestDifficulty: 2, killBadge: 2, healthBadge: 1},
          // {score: 100, highestDifficulty: 3, killBadge: 3, healthBadge: 0},
          // {score: 100, highestDifficulty: 4},
          {score: 0},
        ],
        scores: {
          kills: 0,
          deaths: 0,
          playtime: 0,
        },

        options: {
          muted: false,
        },

        wpm: 0,
        recommended: 0,
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

  options: {
    muted: boolean,
  };

  wpm: number;
  recommended: number;
}

export interface ILevelScores {
  healthBadge?: number;
  killBadge?: number;
  score?: number;
  highestDifficulty?: number;
}
