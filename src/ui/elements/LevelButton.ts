import * as PIXI from 'pixi.js';
import { Colors } from '../../data/Colors';
import { ILevelScores } from '../../data/PlayerData';
import { TextureData } from '../../utils/TextureData';
import { TooltipReader } from '../../JMGE/TooltipReader';
import { StringData } from '../../data/StringData';
import { Button } from '../../JMGE/UI/Button';

export class LevelButton extends PIXI.Container {
  public data: ILevelScores;

  private button: Button;
  private killBadge: PIXI.Sprite;
  private healthBadge: PIXI.Sprite;

  constructor(i: number, onClick: () => void) {
    super();

    this.button = new Button({width: 50, height: 30, label: 'Level ' + i, color: 0xffffff, onClick});
    this.addChild(this.button);

    this.killBadge = new PIXI.Sprite(TextureData.kills);
    this.healthBadge = new PIXI.Sprite(TextureData.health);
    TooltipReader.addTooltip(this.killBadge, {title: StringData.KILLS_AWARD, description: StringData.KILLS_AWARD_DESC});
    TooltipReader.addTooltip(this.healthBadge, {title: StringData.HEALTH_AWARD, description: StringData.HEALTH_AWARD_DESC});

    this.killBadge.position.set(55, 5);
    this.healthBadge.position.set(85, 5);
    this.killBadge.scale.set(0.2);
    this.healthBadge.scale.set(0.2);
    this.addChild(this.killBadge, this.healthBadge);
  }

  public updateFromData(data: ILevelScores) {
    this.data = data;

    if (data) {
      if (data.highestDifficulty || data.highestDifficulty === 0) {
        let color = Colors.DIFFICULTY[data.highestDifficulty];
        this.button.setColor(color);
      } else {
        let color = 0x999999;
        this.button.setColor(color);
      }

      switch (data.killBadge) {
        case 3: this.killBadge.tint = Colors.GOLD; break;
        case 2: this.killBadge.tint = Colors.SILVER; break;
        case 1: this.killBadge.tint = Colors.BRONZE; break;
        default: this.killBadge.tint = 0; break;
      }
      switch (data.healthBadge) {
        case 3: this.healthBadge.tint = Colors.GOLD; break;
        case 2: this.healthBadge.tint = Colors.SILVER; break;
        case 1: this.healthBadge.tint = Colors.BRONZE; break;
        default: this.healthBadge.tint = 0; break;
      }

    } else {
      // this.button.disabled = true;
      this.data = {};
      this.killBadge.tint = 0;
      this.healthBadge.tint = 0;
    }
  }
}
