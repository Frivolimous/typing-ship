import * as JMBUI from '../JMBUI';

export class BaseUI extends JMBUI.BasicElement {
  private saveCallback?: (finishNav: () => void) => void;
  private previousUI: BaseUI;

  constructor(UIConfig?: JMBUI.GraphicOptions) {
    super(UIConfig);
  }

  protected navBack = () => {
    if (!this.previousUI) {
      return;
    }
    if (this.saveCallback) {
      this.saveCallback(() => {
        this.parent.addChild(this.previousUI);
        this.dispose();
      });
    } else {
      this.parent.addChild(this.previousUI);
      this.dispose();
    }
  }

  protected navForward = (nextUI: BaseUI, previousUI?: BaseUI) => {
    nextUI.previousUI = previousUI || this;

    if (this.saveCallback) {
      nextUI.saveCallback = this.saveCallback;
      this.saveCallback(() => {
        this.parent.addChild(nextUI);
        this.parent.removeChild(this);
      });
    } else {
      this.parent.addChild(nextUI);
      this.parent.removeChild(this);
    }
  }

  protected dispose = () => {
    this.destroy();
  }
}