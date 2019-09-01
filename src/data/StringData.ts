export const StringData = {
  SOLDIER: 'SOLDIER',
  CONQUEROR: 'CONQUEROR',
  PERFECTIONIST: 'PERFECTION',
  RIDDLER: 'RIDDLER',
  EXPLORER: 'EXPLORER',
  DEFENDER: 'DEFENDER',

  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  DONE: 'DONE',

  HEALTH_AWARD: 'Health Award',
  KILLS_AWARD: 'Kill Award',
  HEALTH_AWARD_DESC: 'Earn Gold / Silver / Bronze based on health remaining at the end of a map.',
  KILLS_AWARD_DESC: 'Earn Gold / Silver / Bronze based on the number of ships you destroyed.',
  RECOMMENDED_TITLE: 'Recommended Difficulty',
  RECOMMENDED_DESC: 'Based on your performance, this is the difficulty we recommend.',
  TYPING_TEST_TITLE: 'Typing Test',
  TYPING_TEST_DESC: 'We recommend you start with the Typing Test to determine which difficulty best suits you.',

  // score menu
  LEVEL_SCORE: 'LEVEL SCORE: ',
  DIFF_BONUS: 'DIFFICULTY BONUS x',
  HEALTH_BONUS: 'HEALTH BONUS x',
  HEALTH_PERFECT: 'PERFECT HEALTH x',
  ACC_BONUS: 'ACCURACY BONUS x',
  ACC_PERFECT: 'PERFECT ACCURACY x',
  FINAL_SCORE: 'FINAL SCORE: ',
  SPACEBAR: 'HIT SPACEBAR TO CONTINUE',

  // in game
  SCORE: 'SCORE:',
  PAUSED: '-PAUSED-',
  YES: 'YES',
  NO: 'NO',
  LOW_HEALTH: 'Low Health!',

  // diff
  DIFFICULTY: ['FREEZE', 'EASY', 'NORMAL', 'HARD', 'EXTREME', 'INSANE'],

  // game over screen
  MENU: 'MENU',
  HS_SUBMIT: 'SUBMIT SCORE',
  MORE_GAMES: 'MORE GAMES',
  WON_GAME: 'Congratulations!  You won the game!',
  LOSE_GAME: 'You have been destroyed!',

  // misc. words for testing
  MUTE: 'mute',
  UNMUTE: 'unmute',
  SUPERMAN: 'superman',
  KAMIKAZE: 'kamikaze',
  CHAMELEON: 'chameleon',
  PAUSE: 'pause',
  UNPAUSE: 'unpause',

  // other words
  HEALTH: 'HEALTH',
  ACCURACY: 'ACCURACY',
  START_GAME: 'START GAME',
  HIGHSCORE: 'HIGH SCORE',
  ACHIEVE: 'ACHIEVEMENTS',
  CREDITS: 'CREDITS',
  TITLE0: 'MILLENIUM',
  TITLE1: 'TYPER',
  NEW_ACHIEVE: 'New Achievement!',
  SKIP: 'SKIP',
  FINAL_CREDITS: 'As the debris settles in the depths of space a heavy sigh of relief washes across all the people of earth.  The evil emperor has been defeated and the planet freed... an age of peace and prosperity is sure to follow.\n\n\nConcept and Design by:\nYermiyah Hornick\n\n\nProgramming by:\nYermiyah Hornick\n\n\nArt by:\nAvi Kentridge\n\n\nMusic By:\nBinyamin Hornick\n\n\nSound Effects by:\nYermiyah Hornick\nAvi Kentridge\n\n\nThank you for playing!',
};

export function getAchieveArray(s: string): string[] {
  switch (s) {
    case StringData.SOLDIER: return ['DESTROY 10 ENEMY SHIPS', 'DESTROY 1,000 ENEMY SHIPS', 'DESTROY 20,000 ENEMY SHIPS'];
    case StringData.CONQUEROR: return ['DEFEAT THE FIRST BOSS', 'DEFEAT THE SECOND BOSS', 'FINISH THE GAME'];
    case StringData.PERFECTIONIST: return ['COMPLETE ANY LEVEL KILLING EVERY SHIP', 'ACHIEVE 5 GOLD ACCURACY MEDALS', 'FINISH EVERY LEVEL WITH PERFECT ACCURACY'];
    case StringData.RIDDLER: return ["IT'S A BIRD, IT'S A PLANE, IT'S...", "JAPANESE DEATH PILOT'S SCREAM", "NATURE'S MASTER OF DISGUISE"];
    case StringData.EXPLORER: return ['VISIT OUR SPONSORS', 'PAUSE THE GAME WITHOUT CLICKING', 'KILL SUPERMAN'];
    case StringData.DEFENDER: return ['COMPLETE ANY LEVEL WITH PERFECT HEALTH', 'ACHIEVE 5 GOLD HEALTH MEDALS', 'FINISH EVERY LEVEL WITH PERFECT HEALTH'];
    default: return null;
  }
}

export function levelComplete(i: number) {
  return 'Level ' + String(i) + ' Complete!';
}
