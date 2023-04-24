import { AbstractControl } from '@angular/forms';

export interface ImagineAbstractControl extends AbstractControl {
  /**
   * @description
   * inital value of the form to check state
   */
  initialValue: any;

  /**
   * @description
   * state of the control
   */
  changed: any;
}
