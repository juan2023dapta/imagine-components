import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImaginePopUpConfig } from '../interfaces/imagine-pop-up.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PopUpController {
  /**pop up animation */
  private animation = '';
  /**shows pop up */
  private show = false;
  /**pop up configuration */
  private popUpConfiguration!: ImaginePopUpConfig;
  /**notifies pop up was closed */
  private closed = new EventEmitter();
  /**flag to hidde pop up */
  hidde = false;

  /**
   * opens pop up
   * @param popUpConfiguration configuration to be used in component
   */
  openPopUp(popUpConfiguration: ImaginePopUpConfig) {
    this.popUpConfiguration = popUpConfiguration;
    this.animation = 'popUpFadeIn';
    this.show = true;
  }

  /**
   * close pop up and emits when that happens
   * @param data data returned from component injected
   * @returns promise
   */
  closePopUp(data?: any) {
    return new Promise<void>((resolve) => {
      this.animation = 'popUpFadeOut';
      setTimeout(() => {
        this.show = false;
        this.closed.emit(data);
        resolve();
      }, 300);
    });
  }

  /**
   * on pop up closed returns data
   * @returns promise
   */
  popUpClosed() {
    return new Promise<any>((resolve) => {
      let subscription = new Subscription();
      subscription = this.closed.subscribe((data) => {
        resolve(data);
        subscription.unsubscribe();
      });
    });
  }

  /**
   * hiddes pop up to not destroy it
   * @returns promise
   */
  hiddePopUp() {
    return new Promise<void>((resolve) => {
      this.animation = 'popUpFadeOut';
      setTimeout(() => {
        this.hidde = false;
        resolve();
      }, 300);
    });
  }
  /**
   * unhides pop-up
   * @returns promise
   */
  unHiddePopUp() {
    return new Promise<void>((resolve) => {
      this.animation = 'popUpFadeIn';
      this.hidde = false;
      resolve();
    });
  }

  /**
   * tells to show pop up to the outside
   */
  get showPopUp() {
    return this.show;
  }
  /**
   * tells to hidde pop up to the outside
   */
  get hiddenPopUp() {
    return this.hidde;
  }
  /**
   * tells pop up animation to the outside
   */
  get animationPopUp() {
    return this.animation;
  }
  /**
   * tells pop up config to the outside
   */
  get popUpConfig() {
    return this.popUpConfiguration;
  }
}
