export enum BadgeState{
  NONE,
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM
}

export enum Badges{
  SOLDIER_BRONZE,
  SOLDIER_SILVER,
  SOLDIER_GOLD,
  CONQUEROR_BRONZE,
  CONQUEROR_SILVER,
  CONQUEROR_GOLD,
  RIDDLER_BRONZE,
  RIDDLER_SILVER,
  RIDDLER_GOLD,
  DEFENDER_BRONZE,DEFENDER_SILVER,DEFENDER_GOLD,
  PERFECTION_BRONZE,
  PERFECTION_SILVER,
  PERFECTION_GOLD,
  EXPLORER_BRONZE,
  EXPLORER_SILVER,
  EXPLORER_GOLD
}

export class ExtrinsicModel{
  static loadExtrinsic=(data:ExtrinsicData)=>{
    return new ExtrinsicModel(data);
  }

  constructor(public data?:ExtrinsicData){
    if (!data){
      data={
        badges:[],
        levels:[],
        scores:{
          kills:0,
          deaths:0,
          playtime:0
        }
      }
    }
  }
}

export interface ExtrinsicData{
  badges:boolean[];
  levels:LevelScores[];
  scores:{
    kills:number,
    deaths:number,
    playtime:number,
  };
}

export interface LevelScores{
  healthPercent:number,
  killPercent:number,
  accuracy:number,
  score:number,
  highestDifficulty:number
}