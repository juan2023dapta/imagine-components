import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'imagine-pop-up-wrapper',
  templateUrl: './imagine-pop-up-wrapper.component.html',
  styleUrls: ['./imagine-pop-up-wrapper.component.scss'],
})
export class ImaginePopUpWrapperComponent {
  /**access pop up container */
  @ViewChild('popupContainer') popupContainer!: ElementRef<HTMLDivElement>;
  /**sets max width for pop up */
  @Input() maxWidth = '400px';
  /**sets max height for pop up */
  @Input() maxHeight = '400px';
  /**sets max height for pop up */
  @Input() width = '90%';
  /**sets animation for pop up */
  animation = '';
  /**flag to know if show pop up */
  showPopUp = false;

  /**
   * open pop up function
   */
  openPopUp() {
    this.animation = 'popUpFadeIn';
    this.showPopUp = true;
  }

  /**
   * close pop up function
   * @returns promise
   */
  closePopUp() {
    return new Promise<void>((resolve) => {
      this.animation = 'popUpFadeOut';
      setTimeout(() => {
        this.showPopUp = false;
        resolve();
      }, 300);
    });
  }
}
