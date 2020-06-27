import { Howl } from 'howler';

export enum SoundIndex {
  TYPING,
  CLICK,
  SCORE,
  LASER,
  EXPLODE_SS,
  EXPLODE_BS,
  CHARGE,
  HEAL,
  EMP,
  BOSS_CHARGE,
  BOSS_LASER,
  SUPERMAN,
}

export class SoundData {
  public static musicVolume = 0.5;

  public static setMute = (b: boolean) => {
    SoundData.muted = b;
    if (b) {
      if (SoundData.musicPlaying) {
        SoundData.musicPlaying.fade(SoundData.musicVolume, 0, 500);
      }
    } else {
      if (SoundData.musicPlaying) {
        SoundData.musicPlaying.fade(0, SoundData.musicVolume, 500);
      }
    }
  }

  public static playMusicForLevel = (i: number) => {
    switch (i) {
      case 0: case 1: case 2:
        SoundData.playMusic(1);
        break;
      case 4: case 5: case 6:
        SoundData.playMusic(2);
        break;
      case 8: case 9: case 10:
        SoundData.playMusic(3);
        break;
      case 3: case 7: case 11:
        SoundData.playMusic(4);
        break;
    }
  }

  public static playMusic = (i: number) => {
    let nextTrack: Howl = SoundData.music[i];
    if (SoundData.musicPlaying === nextTrack) {
      return;
    }

    if (SoundData.muted) {
      if (SoundData.musicPlaying) {
        SoundData.musicPlaying.stop();
      }
      nextTrack.volume(0);
      nextTrack.play();
      SoundData.musicPlaying = nextTrack;
    } else {
      if (SoundData.musicPlaying) {
        let prev = SoundData.musicPlaying;
        prev.fade(SoundData.musicVolume, 0, 1000);
        prev.once('fade', () => prev.stop());
      }
      nextTrack.fade(0, SoundData.musicVolume, 1000);
      nextTrack.play();
      SoundData.musicPlaying = nextTrack;
    }
  }

  public static playSound = (i: SoundIndex) => {
    if (SoundData.muted) return;

    switch (i) {
      case SoundIndex.TYPING: SoundData.typing.play(); break;
      case SoundIndex.CLICK: SoundData.click.play(); break;
      case SoundIndex.SCORE: SoundData.score.play(); break;
      case SoundIndex.CHARGE: SoundData.charge.play(); break;
      case SoundIndex.EMP: SoundData.emp.play(); break;
      case SoundIndex.LASER: SoundData.laser.play(); break;
      case SoundIndex.BOSS_CHARGE: SoundData.bossCharge.play(); break;
      case SoundIndex.BOSS_LASER: SoundData.bossLaser.play(); break;
      case SoundIndex.EXPLODE_SS: SoundData.explodeSS.play(); break;
      case SoundIndex.EXPLODE_BS: SoundData.explodeBS.play(); break;
      case SoundIndex.SUPERMAN: SoundData.superman.play(); break;
      case SoundIndex.HEAL: SoundData.heal.play(); break;
    }
  }

  private static muted: boolean = false;

  private static typing = new Howl({
    src: ['./assets/Audio/Sounds/Y_Keyboard.mp3'],
    volume: 1,
  });
  private static click = new Howl({
    src: ['./assets/Audio/Sounds/Y_Click.ogg'],
    volume: 1,
  });
  private static score = new Howl({
    src: ['./assets/Audio/Sounds/Cash_Edit.mp3'],
    volume: 1,
  });
  private static laser = new Howl({
    src: ['./assets/Audio/Sounds/Y_LaserShot.mp3'],
    volume: 0.3,
  });
  private static explodeSS = new Howl({
    src: ['./assets/Audio/Sounds/A_Explode_Small.mp3'],
    volume: 0.4,
  });
  private static explodeBS = new Howl({
    src: ['./assets/Audio/Sounds/Explode_Large_Edit.mp3'],
    volume: 0.3,
  });
  private static charge = new Howl({
    src: ['./assets/Audio/Sounds/Y_Charge.mp3'],
    volume: 1,
  });
  private static heal = new Howl({
    src: ['./assets/Audio/Sounds/Y_Heal.mp3'],
    volume: 1.5,
  });
  private static emp = new Howl({
    src: ['./assets/Audio/Sounds/Y_EMP.mp3'],
    volume: 1.3,
  });
  private static bossCharge = new Howl({
    src: ['./assets/Audio/Sounds/Y_BossCharge.mp3'],
    volume: 0.75,
  });
  private static bossLaser = new Howl({
    src: ['./assets/Audio/Sounds/Y_BossFire.mp3'],
    volume: 1,
  });
  private static superman = new Howl({
    src: ['./assets/Audio/Sounds/Superman.mp3'],
    volume: 0.5,
  });

  private static musicPlaying: Howl;

  private static music = [
    new Howl({
      src: ['./assets/Audio/Music/Binyamin track 0.mp3'],
      html5: true,
      loop: true,
      volume: SoundData.musicVolume,
    }),
    new Howl({
      src: ['./assets/Audio/Music/Binyamin track 1.mp3'],
      html5: true,
      loop: true,
      volume: SoundData.musicVolume,
    }),
    new Howl({
      src: ['./assets/Audio/Music/Binyamin track 2.mp3'],
      html5: true,
      loop: true,
      volume: SoundData.musicVolume,
    }),
    new Howl({
      src: ['./assets/Audio/Music/Binyamin track 3.mp3'],
      html5: true,
      loop: true,
      volume: SoundData.musicVolume,
    }),
    new Howl({
      src: ['./assets/Audio/Music/Binyamin track 4.mp3'],
      html5: true,
      loop: true,
      volume: SoundData.musicVolume,
    }),
  ];
}

// window.addEventListener('keydown', (e: any) => {
//   switch (e.key) {
//     case '1': SoundData.playSound(0); break;
//     case '2': SoundData.playSound(1); break;
//     case '3': SoundData.playSound(2); break;
//     case '4': SoundData.playSound(3); break;
//     case '5': SoundData.playSound(4); break;
//     case '6': SoundData.playSound(5); break;
//     case '7': SoundData.playSound(6); break;
//     case '8': SoundData.playSound(7); break;
//     case '9': SoundData.playSound(8); break;
//     case '0': SoundData.playSound(9); break;
//     case '-': SoundData.playSound(10); break;
//     case '=': SoundData.playSound(11); break;
//     case 'q': SoundData.playMusic(0); break;
//     case 'w': SoundData.playMusic(1); break;
//     case 'e': SoundData.playMusic(2); break;
//     case 'r': SoundData.playMusic(3); break;
//     case 't': SoundData.playMusic(4); break;
//   }
// });
