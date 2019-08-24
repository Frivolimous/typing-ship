import { BaseUI } from '../JMGE/UI/BaseUI';
import { GameManager } from '../game/GameManager';
import { WinUI } from './WinUI';
import { LossUI } from './LossUI';
import { GameUIElements } from '../ui/GameUIElements';

export class GameUI extends BaseUI {
  private manager: GameManager;
  private ui: GameUIElements;
  constructor(level: number, difficulty: number) {
    super();

    this.manager = new GameManager(level, difficulty, this);
    this.ui = new GameUIElements();

    this.addChild(this.manager.display, this.ui);
  }

  public navWin = () => {
    this.navForward(new WinUI(), this.previousUI);
  }

  public navLoss = () => {
    this.navForward(new LossUI(), this.previousUI);
  }

  public dispose = () => {
    this.manager.dispose();
    this.ui.destroy();
    this.destroy();
  }
}
