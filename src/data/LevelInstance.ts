export interface ILevelInstance {
  level: number;
  difficulty: number;

  score: number;
  gameSpeed: number;
  levelEnded: boolean;

  enemiesKilled: number;
  totalEnemies: number;

  lettersTyped: number;
  lettersDeleted: number;

  healthLost: boolean;
  playerHealth: number;
}
