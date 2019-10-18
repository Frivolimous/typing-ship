import * as _ from 'lodash';
import { ExtrinsicModel } from "./PlayerData";
import { IAchievement, ITutorial, IScore } from "../utils/ATSManager";
import { GameEvents, ILevelEvent } from "../utils/GameEvents";

enum AchievementId {
  SOLDIER_BRONZE, SOLDIER_SILVER, SOLDIER_GOLD,
  CONQUEROR_BRONZE, CONQUEROR_SILVER, CONQUEROR_GOLD,
  DEFENDER_BRONZE, DEFENDER_SILVER, DEFENDER_GOLD,
  PERFECTION_BRONZE, PERFECTION_SILVER, PERFECTION_GOLD,
  RIDDLER_BRONZE, RIDDLER_SILVER, RIDDLER_GOLD,
  EXPLORER_BRONZE, EXPLORER_SILVER, EXPLORER_GOLD,
}

enum ScoreId {
  KILL_ENEMY,
  PLAYER_DEATH,
}

export function genAchievements() {
  let ACHIEVEMENTS: IAchievement[] = [
    {
      id: AchievementId.SOLDIER_BRONZE,
      title: 'Bronze Soldier',
      caption: 'You destroyed 10 enemy ships!',
      emitter: GameEvents.NOTIFY_ENEMY_DESTROYED,
      condition: extrinsic => extrinsic.data.scores.kills >= 10
    },
    {
      id: AchievementId.SOLDIER_SILVER,
      title: 'Silver Soldier',
      caption: 'You destroyed 100 enemy ships!',
      emitter: GameEvents.NOTIFY_ENEMY_DESTROYED,
      condition: extrinsic => extrinsic.data.scores.kills >= 100
    },
    {
      id: AchievementId.SOLDIER_GOLD,
      title: 'Gold Soldier',
      caption: 'You destroyed 1000 enemy ships!',
      emitter: GameEvents.NOTIFY_ENEMY_DESTROYED,
      condition: extrinsic => extrinsic.data.scores.kills >= 1000
    },
    {
      id: AchievementId.CONQUEROR_BRONZE,
      title: 'Bronze Conqueror',
      caption: 'You completed level 1',
      emitter: GameEvents.NOTIFY_LEVEL_COMPLETED,
      condition: (extrinsic, e: ILevelEvent) => (e.win && e.levelIndex >= 0),
    },
    {
      id: AchievementId.CONQUEROR_SILVER,
      title: 'Silver Conqueror',
      caption: 'You completed level 6',
      emitter: GameEvents.NOTIFY_LEVEL_COMPLETED,
      condition: (extrinsic, e: ILevelEvent) => (e.win && e.levelIndex >= 5),
    },
    {
      id: AchievementId.CONQUEROR_GOLD,
      title: 'Gold Conqueror',
      caption: 'You completed the game!',
      emitter: GameEvents.NOTIFY_LEVEL_COMPLETED,
      condition: (extrinsic, e: ILevelEvent) => (e.win && e.levelIndex >= 11),
    },
    {
      id: AchievementId.DEFENDER_BRONZE,
      title: 'Bronze Defender',
      caption: 'You completed a level with perfect health!',
      emitter: GameEvents.NOTIFY_LEVEL_COMPLETED,
      condition: (extrinsic, e: ILevelEvent) => (e.win && !e.levelInstance.healthLost),
    },
    {
      id: AchievementId.DEFENDER_SILVER,
      title: 'Silver Defender',
      caption: 'You completed 3 levels with perfect health!',
      emitter: GameEvents.NOTIFY_LEVEL_COMPLETED,
      condition: (extrinsic, e: ILevelEvent) => (_.filter(extrinsic.data.levels, {healthBadge: 3}).length >= 3),
    },
    {
      id: AchievementId.DEFENDER_GOLD,
      title: 'Gold Defender',
      caption: 'You completed 10 levels with perfect health!',
      emitter: GameEvents.NOTIFY_LEVEL_COMPLETED,
      condition: (extrinsic, e: ILevelEvent) => (_.filter(extrinsic.data.levels, {healthBadge: 3}).length >= 10),
    },
    {
      id: AchievementId.PERFECTION_BRONZE,
      title: 'Bronze Perfection',
      caption: 'You completed a level with perfect score!',
      emitter: GameEvents.NOTIFY_LEVEL_COMPLETED,
      condition: (extrinsic, e: ILevelEvent) => (e.win && e.levelInstance.enemiesKilled >= e.levelInstance.totalEnemies),
    },
    {
      id: AchievementId.PERFECTION_SILVER,
      title: 'Silver Perfection',
      caption: 'You completed 3 levels with perfect score!',
      emitter: GameEvents.NOTIFY_LEVEL_COMPLETED,
      condition: (extrinsic, e: ILevelEvent) => (_.filter(extrinsic.data.levels, {killBadge: 3}).length >= 3),
    },
    {
      id: AchievementId.PERFECTION_GOLD,
      title: 'Gold Perfection',
      caption: 'You completed 10 levels with perfect score!',
      emitter: GameEvents.NOTIFY_LEVEL_COMPLETED,
      condition: (extrinsic, e: ILevelEvent) => (_.filter(extrinsic.data.levels, {killBadge: 3}).length >= 10),
    },
  //   RIDDLER_BRONZE, RIDDLER_SILVER, RIDDLER_GOLD,
  // EXPLORER_BRONZE, EXPLORER_SILVER, EXPLORER_GOLD,
  ]
  return ACHIEVEMENTS;
}

export function genTutorials() {
  let m: ITutorial[] = [];

  return m;
}

export function genScores() {
  let m: IScore[] = [
    {
      id: ScoreId.KILL_ENEMY,
      type: '++',
      prop: 'scores.kills',
      emitter: GameEvents.NOTIFY_ENEMY_DESTROYED,
      condition: () => true,
    },
    {
      id: ScoreId.PLAYER_DEATH,
      type: '++',
      prop: 'scores.deaths',
      emitter: GameEvents.NOTIFY_LEVEL_COMPLETED,
      condition: (extrinsic: ExtrinsicModel, e: ILevelEvent) => !e.win,
    },
  ];

  return m;
}

// scores: {
//   kills: number,
//   deaths: number,
//   playtime: number,
// };