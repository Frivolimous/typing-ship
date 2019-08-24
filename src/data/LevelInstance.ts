export interface ILevelInstance {
  score: number;
  gameSpeed: number;
  levelEnded: boolean;

  enemiesKilled: number;
  lettersTyped: number;
  lettersDeleted: number;

  healthLost: boolean;
  totalEnemies: number;
}
