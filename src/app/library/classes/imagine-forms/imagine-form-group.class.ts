import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { ImagineFormControl } from './imagine-form-control.class';
import { ImagineAbstractControl } from './imagine-abstract-control.class';

export class ImagineFormGroup extends FormGroup {
  /**
   * @description
   * inital value of the form to check state
   */
  initalValue: any;

  override controls!: { [key: string]: ImagineAbstractControl };
  /**
   * Creates a new `FormGroup` instance.
   *
   * @param controls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  constructor(
    controls: {
      [key: string]: AbstractControl;
    },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  /**
   * sets intial value of the form
   */
  setIntialValue(value: any) {
    this.initalValue = value;
  }
}
