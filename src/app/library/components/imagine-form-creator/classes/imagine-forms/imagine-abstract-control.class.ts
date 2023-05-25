import { AbstractControl } from '@angular/forms';
import { ImagineInputData } from '../../interfaces/imagine-input-data.interface';

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
