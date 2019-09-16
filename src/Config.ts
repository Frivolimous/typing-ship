export const CONFIG = {
  INIT: {
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 800,
    STAGE_BUFFER: 80,
    RESOLUTION: 1,
    BACKGROUND_COLOR: 0,
    MOUSE_HOLD: 200,
    FPS: 60,
    BORDER: false,
  },
  STAGE: {
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 800,
  },
  TILEMAP: {
    TILE_SIZE: 30,
  },
  GAME: {
    skillPerLevel: 0.2,
    godmode: true,
    playerHealth: 10,
  },
  toPS: (n: number): number => {
    return Math.floor(CONFIG.INIT.FPS * 10 / n) / 10;
  },

  fromPS: (n: number): number => {
    return Math.floor(n / CONFIG.INIT.FPS * 10) / 10;
  },

  toDur: (n: number): number => {
    return Math.floor(n * 10 / CONFIG.INIT.FPS) / 10;
  },

  pixelToTile: (n: number, minusHalf: boolean = true): number => {
    return Math.floor(n * 10 / CONFIG.TILEMAP.TILE_SIZE - (minusHalf ? 5 : 0)) / 10;
  },

  toTPS: (n: number): number => {
    return Math.floor(n * CONFIG.INIT.FPS / CONFIG.TILEMAP.TILE_SIZE * 10) / 10;
  },
};
