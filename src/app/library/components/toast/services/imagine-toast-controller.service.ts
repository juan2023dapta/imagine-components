import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImagineToastController {
  /**toats information to be shown */
  toastInfo: ToastInfo = {
    title: '',
    message: '',
    icon: '',
    color: '',
    duration: 0,
  };

  /** variable to change the animation of the toast when it is opened or closed*/
  animation = 'toastFadeIn';

  /**flag to know if show toast or not */
  showToast = false;

  /**flag to know if toast is loading */
  loading = false;

  /**timer id to clear */
  openTimerIds: {
    openTimerAnimation: NodeJS.Timeout | undefined;
    openTimer: NodeJS.Timeout | undefined;
  } = {
    openTimerAnimation: undefined,
    openTimer: undefined,
  };
  closeTimerIds: {
    closeTimerAnimation: NodeJS.Timeout | undefined;
    closeTimer: NodeJS.Timeout | undefined;
  } = {
    closeTimerAnimation: undefined,
    closeTimer: undefined,
  };

  /**
   * shows the toast
   * @param toastInfo toast information to be painted
   * @returns promise
   */
  openToast(toastInfo: ToastInfo) {
    return new Promise<void>((resolve) => {
      clearTimeout(this.closeTimerIds.closeTimerAnimation);
      clearTimeout(this.closeTimerIds.closeTimer);
      clearTimeout(this.openTimerIds.openTimer);
      clearTimeout(this.openTimerIds.openTimerAnimation);
      this.showToast = false;
      this.animation = 'toastFadeIn';
      this.toastInfo = toastInfo;
      this.loading = false;
      this.openTimerIds.openTimerAnimation = setTimeout(() => {
        this.showToast = true;
        if (toastInfo.duration) {
          this.openTimerIds.openTimer = setTimeout(() => {
            this.closeToast().then(() => {
              resolve();
            });
          }, toastInfo.duration);
        } else {
          resolve();
        }
      }, 0);
    });
  }

  /**
   *Method that close the toast
   */
  closeToast() {
    return new Promise<void>((resolve) => {
      clearTimeout(this.closeTimerIds.closeTimerAnimation);
      clearTimeout(this.closeTimerIds.closeTimer);
      this.closeTimerIds.closeTimerAnimation = setTimeout(() => {
        this.animation = 'toastFadeOut';
        this.closeTimerIds.closeTimer = setTimeout(() => {
          this.showToast = false;
          resolve();
        }, 500);
      }, 500);
    });
  }

  /**
   * tells the toast to star loading
   * @param data contains the title message and the color to be shown
   * @returns promise
   */
  startLoading(data: { title: string; message: string; color?: string }) {
    this.loading = true;
    return new Promise<void>((resolve) => {
      this.animation = 'toastFadeIn';
      this.toastInfo.title = data.title;
      this.toastInfo.message = data.message;
      this.toastInfo.color = data.color || 'primary';
      this.showToast = true;
      resolve();
    });
  }

  /**
   * tells the toast to stop loading
   * @returns promise
   */
  stopLoading() {
    return new Promise<void>((resolve) => {
      this.closeToast().then(() => {
        this.loading = false;
        resolve();
      });
    });
  }

  /**
   * shows success toast
   * @param data contains the title message and the duration to be shown
   * @returns promise
   */
  handleSuccess(data: { message: string; title?: string; duration?: number }) {
    return new Promise<void>((resolve) => {
      this.openToast({
        title: data.title || 'Success',
        message: data.message,
        duration: data.duration || 10000,
        color: 'success',
        icon: 'bx bx-check',
      }).then(() => {
        resolve();
      });
    });
  }
  /**
   * shows danger toast
   * @param data contains the title message and the duration to be shown
   * @returns promise
   */
  handleError(data: { message: string; title?: string; duration?: number }) {
    return new Promise<void>((resolve) => {
      this.openToast({
        title: data.title || 'Error',
        message: data.message,
        duration: data.duration,
        color: 'danger',
        icon: 'bx bx-error',
      }).then(() => {
        resolve();
      });
    });
  }
}

interface ToastInfo {
  title: string;
  message: string;
  color: string;
  duration?: number;
  icon: string;
}
