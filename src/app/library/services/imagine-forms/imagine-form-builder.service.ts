import { Injectable } from '@angular/core';
import { AbstractControlOptions, FormBuilder } from '@angular/forms';
import { ImagineFormGroup } from '../../classes/imagine-forms/imagine-form-group.class';
import { ImagineFormControl } from '../../classes/imagine-forms/imagine-form-control.class';

@Injectable({
  providedIn: 'root',
})
export class ImagineFormBuilder {
  /**
   * @description
   * Construct a new `FormGroup` instance.
   *
   * @param controlsConfig A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param options Configuration options object for the `FormGroup`. The object should have the
   * the `AbstractControlOptions` type and might contain the following fields:
   * * `validators`: A synchronous validator function, or an array of validator functions
   * * `asyncValidators`: A single async validator or array of async validator functions
   * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur' |
   * submit')
   */
  group(
    controlsConfig: {
      [key: string]: any;
    },
    options?: AbstractControlOptions | null
  ): ImagineFormGroup {
    let formConfig: any = {};
    Object.keys(controlsConfig).forEach((key: string) => {
      formConfig[key] = this.control(controlsConfig[key]);
    });
    console.log(formConfig, 'formConfig');

    return new ImagineFormGroup(formConfig, options);
  }
  /**
   * @description
   * Construct a new `FormControl` instance.
   *
   * @param control array to convert to control
   */
  control(control: any | any[]) {
    if (Array.isArray(control)) {
      return new ImagineFormControl(...control);
    } else {
      return new ImagineFormControl(control);
    }
  }
}
