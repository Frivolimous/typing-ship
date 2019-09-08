import { ILevelEvent, ISpawnEvent, getLevel, EventType, getBossLoop } from '../../data/LevelData';
import { BossShip } from '../objects/BossShip';

export class EventInterpreter {
  public DISTANCE_MULT: number = 0.0002;

  public level: number;
  public data: ILevelEvent[];
  public finalDistance: number;
  public distance: number;
  public boss: BossShip;

  constructor(private addShipCallback: (spawn: ISpawnEvent) => void, private addBossCallback: (bossType: number) => BossShip) {

  }

  public loadLevel(level: number, gameSpeed: number) {
    this.level = level;
    this.data = getLevel(level, gameSpeed);
    this.finalDistance = this.data[this.data.length - 1].distance;
    this.distance = 0;
    // console.log('level', this.data);
    // console.log('time', this.finalDistance);
  }

  public loadBossLoop(bossType: number, gameSpeed: number) {
    this.data = getBossLoop(bossType, gameSpeed);
    this.data.forEach(event => event.distance += this.distance);
  }

  public addDistance(gameSpeed: number, timeElapsed: number): number {
    this.distance += gameSpeed * this.DISTANCE_MULT; // ??? based timing
    // this.distance += timeElapsed * 0.001; // USE THIS for second based timing
    while (this.data.length > 0 && this.distance > this.data[0].distance) {
      let nextEvent = this.data.shift();

      switch (nextEvent.type) {
        case EventType.LOOP:
          let tArray: ILevelEvent[] = getLevel(this.level, gameSpeed).splice(nextEvent.jumpIndex);
          this.data = this.data.concat(tArray);
          break;
        case EventType.SPAWN:
          this.addShipCallback(nextEvent.spawnEvent);
          break;
        case EventType.BOSS: this.boss = this.addBossCallback(nextEvent.bossType); break;
        case EventType.WAIT: break;
      }
    }
    if (this.boss) {
      if (this.boss.toDestroy) {
        this.boss = null;
        this.data = [];
      } else {
        if (this.data.length === 0 && this.boss.commands.length === 0) {
          this.loadBossLoop(this.boss.bossType, gameSpeed);
        }
      }
    }
    return this.distance;
  }

  public isComplete(): boolean {
    if (this.boss) {
      return false;
    }
    return (this.data.length === 0);
  }

  public getTotalEnemies(): number {
    let total = 0;
    for (let data of this.data) {
      if (data.type === EventType.SPAWN) {
        total++;
      }
    }

    return total;
  }
}
