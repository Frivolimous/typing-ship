import * as JMBUI from '../JMBUI';

export class BaseUI extends JMBUI.BasicElement {
  protected previousUI: BaseUI;
  private saveCallback?: (finishNav: () => void) => void;

  constructor(UIConfig?: JMBUI.GraphicOptions) {
    super(UIConfig);
  }

  public navIn = () => { };

  public navBack = () => {
    if (!this.previousUI) {
      return;
    }
    if (this.saveCallback) {
      this.saveCallback(() => {
        this.parent.addChild(this.previousUI);
        this.previousUI.navIn();
        this.dispose();
      });
    } else {
      this.parent.addChild(this.previousUI);
      this.previousUI.navIn();
      this.dispose();
    }
  }

  protected navForward = (nextUI: BaseUI, previousUI?: BaseUI) => {
    nextUI.previousUI = previousUI || this;

    if (this.saveCallback) {
      nextUI.saveCallback = this.saveCallback;
      this.saveCallback(() => {
        this.parent.addChild(nextUI);
        nextUI.navIn();
        this.parent.removeChild(this);
      });
    } else {
      this.parent.addChild(nextUI);
      nextUI.navIn();
      this.parent.removeChild(this);
    }
  }

  protected dispose = () => {
    this.destroy();
  }
}
