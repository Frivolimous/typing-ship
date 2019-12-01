import * as _ from 'lodash';
import { ExtrinsicModel } from '../data/PlayerData';

export class SaveData {
  public static async init(): Promise<null> {
    return new Promise((resolve) => {
      this.loadVersion().then(version => {
        // if (true) {
        if (version < SaveData.VERSION) {
          SaveData.confirmReset();
          SaveData.saveVersion(SaveData.VERSION);
          SaveData.saveExtrinsic();
        } else {
          SaveData.loadExtrinsic().then(extrinsic => {
            if (extrinsic) {
              SaveData.extrinsic = extrinsic;
              SaveData._Extrinsic = _.cloneDeep(SaveData.extrinsic);
            } else {
              SaveData.confirmReset();
            }
            resolve();
          });
        }
      });
    });
  }

  public static resetData(): () => void {
    return this.confirmReset;
  }

  public static getExtrinsic(): ExtrinsicModel {
    if (SaveData.extrinsic) {
      return SaveData.extrinsic;
    }
  }

  public static async saveExtrinsic(extrinsic?: ExtrinsicModel): Promise<ExtrinsicModel> {
    return new Promise((resolve) => {
      extrinsic = extrinsic || this.extrinsic;
      SaveData.saveExtrinsicToLocal(extrinsic);
      resolve(extrinsic);
    });
  }

  public static async loadExtrinsic(): Promise<ExtrinsicModel> {
    return new Promise((resolve) => {
      resolve(this.loadExtrinsicFromLocal());
    });
  }

  private static extrinsic: ExtrinsicModel;
  private static _Extrinsic: ExtrinsicModel;
  private static VERSION = 8;

  private static confirmReset = () => {
    SaveData.extrinsic = new ExtrinsicModel();
    SaveData._Extrinsic = _.cloneDeep(SaveData.extrinsic);
  }

  private static saveExtrinsicToLocal(extrinsic?: ExtrinsicModel) {
    extrinsic = extrinsic || this.extrinsic;
    if (typeof Storage !== undefined) {
      window.localStorage.setItem('Extrinsic', JSON.stringify(extrinsic.data));
    } else {
      console.log('NO STORAGE!');
    }
  }

  private static loadExtrinsicFromLocal(): ExtrinsicModel {
    if (typeof Storage !== undefined) {
      let extrinsicStr = window.localStorage.getItem('Extrinsic');
      if (extrinsicStr !== 'undefined') {
        let extrinsicObj = JSON.parse(extrinsicStr);
        return ExtrinsicModel.loadExtrinsic(extrinsicObj);
      }
    } else {
      console.log('NO STORAGE!');
    }
  }

  private static loadVersion(): Promise<number> {
    return new Promise((resolve) => {
      if (typeof Storage !== undefined) {
        resolve(Number(window.localStorage.getItem('Version')));
      } else {
        console.log('NO STORAGE!');
        resolve(0);
      }
    });
  }

  private static saveVersion(version: number) {
    if (typeof Storage !== undefined) {
      window.localStorage.setItem('Version', String(version));
    } else {
      console.log('NO STORAGE!');
    }
  }

}
