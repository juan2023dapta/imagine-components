import { Injectable } from '@angular/core';
import { AlertInfo, ButtonAlert } from '../components/imagine-alert/imagine-alert.component';

@Injectable({
  providedIn: 'root',
})
export class ImagineAlertController {
  showAlert = false;
  loading = false;
  loadingAux = 0;

  alertInfo: AlertInfo = {
    title: '',
    msg: '',
    showIcon: false,
    iconName: '',
    buttons: [],
  };

  animationAlert = 'alertFadeIn';

  /**
   *Method that opens the modal
   *@param alertInfo sets the modal info from outside
   */
  openAlert(alertInfo: AlertInfo) {
    this.animationAlert = 'alertFadeIn';
    this.alertInfo = alertInfo;
    this.showAlert = true;
  }

  startLoading() {
    this.loading = true;
  }

  startLoadingAux() {
    this.loadingAux++;
  }

  confirmAction(config: {
    msg?: string;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    confirmFunction: any;
    cancelFunction?: any;
    iconName?: string;
    iconColor?: string;
  }) {
    this.openAlert({
      title: config.title || 'Confirm',
      msg: config.msg || 'Deleted items can’t be recovered',
      showIcon: true,
      iconName: config.iconName || 'bx bxs-error-circle',
      color: 'primary',
      buttons: [
        {
          buttonColor: 'primary',
          buttonText: config.confirmText || 'Yes',
          buttonIcon: 'bx bx-check',
          buttonHandler: () => {
            config.confirmFunction();
            this.hideAlert();
          },
        },
        {
          buttonColor: 'dark',
          buttonText: config.cancelText || 'No, Cancel',
          buttonHandler: () => {
            if (config.cancelFunction) {
              config.cancelFunction();
            }
            this.hideAlert();
          },
        },
      ],
    });
  }

  /**
   *hides the modal info
   */
  hideAlert() {
    this.animationAlert = 'alertFadeOut';
    setTimeout(() => {
      this.showAlert = false;
    }, 300);
  }

  /**
   * stops loader
   */
  stopLoading() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  stopLoadingAux() {
    setTimeout(() => {
      this.loadingAux = this.loadingAux - 0.5;
    }, 500);
  }
  /**
   *Method that handles the success of a request with an alert
   */
  handleSuccess(alertData: { msg: string; title?: string; buttons?: ButtonAlert[] }) {
    this.openAlert({
      showIcon: true,
      iconName: 'bx bxs-check-circle',
      title: alertData.title || 'Success',
      msg: alertData.msg,
      color: 'success',
      buttons: alertData.buttons || [
        {
          buttonColor: 'success',
          buttonText: 'OK',
          buttonHandler: () => {
            this.hideAlert();
          },
        },
      ],
    });
  }

  /**
   *Method that handles error of a request with an alert
   */
  handleError(
    alertData: {
      msg: string;
      title?: string;
      iconName?: string;
      iconColor?: string;
      buttons?: ButtonAlert[];
      color?: 'danger' | 'primary' | 'success' | 'white' | undefined;
    },
    error?: { error: { detail: string } }
  ) {
    if (error) {
      if (alertData.msg !== error.error.detail) {
        alertData.msg = `<p>${alertData.msg} ${error.error.detail}</p>`;
      } else {
        alertData.msg = `<p>${alertData.msg}</p>`;
      }
    }
    this.openAlert({
      showIcon: true,
      iconName: alertData.iconName || 'bx bxs-error-circle',
      title: alertData.title || 'Error',
      msg: alertData.msg,
      color: alertData.color || 'danger',
      buttons: alertData.buttons || [
        {
          buttonColor: alertData.color || 'danger',
          buttonText: 'OK',
          buttonHandler: () => {
            this.hideAlert();
          },
        },
      ],
    });
  }

  handleListMessages(listMessages: string[], listMessageTitle: string) {
    let message = '';
    if (listMessages && listMessages.length > 0) {
      listMessages = listMessages.map((listMessage) => `<li>${listMessage}</li>`);
      message += `
    <div class="text-align-start alert-margin-top-10">
      <p>
      ${listMessageTitle}
      </p>
   </div>
   <div class="text-align-start">
      <ul class="alert-ul">
         ${listMessages.join('')}
      </ul>
   </div>`;
    }

    return message;
  }
}
