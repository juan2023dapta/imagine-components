import { ComponentRef, EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImaginePopUpConfig, ImaginePopUpInternalConfig } from '../interfaces/imagine-pop-up.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ImaginePopUpController {
  /**pop up instaces */
  popUps: ImaginePopUpInternalConfig[] = [];
  /**pop up animation */
  animation = '';
  /**notifies pop up was closed */
  private closed = new EventEmitter();
  /**component create */
  componentCreated = new EventEmitter();
  /**global props */
  globalProps: any;

  /**
   * opens pop up
   * @param popUpConfiguration configuration to be used in component
   */
  openPopUp<T>(popUpConfiguration: ImaginePopUpConfig) {
    return new Promise<ComponentRef<T>>((resolve) => {
      const config: ImaginePopUpInternalConfig = { ...popUpConfiguration };
      config.animation = 'popUpFadeIn';
      config.showingPopUp = true;
      this.popUps.push(config);
      const componentCreatedSub = this.componentCreated.subscribe((componentRef) => {
        componentCreatedSub.unsubscribe();
        resolve(componentRef as ComponentRef<T>);
      });
    });
  }

  /**
   * close pop up and emits when that happens
   * @param data data returned from component injected
   * @returns promise
   */
  closePopUp(data?: any) {
    return new Promise<void>((resolve) => {
      this.currentPopup.animation = 'popUpFadeOut';
      setTimeout(() => {
        this.popUps.pop();
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

  get currentPopup() {
    return this.popUps[this.popUps.length - 1];
  }
}
