import { AbstractControlOptions, AsyncValidatorFn, FormControl, FormControlOptions, ValidatorFn } from '@angular/forms';
import { ImagineInputData } from '../../interfaces/imagine-input-data.interface';

export class ImagineFormControl extends FormControl {
  /**
   * @description
   * inital value of the form to check state
   */
  initialValue: any;

  /**
   * Creates a new `FormControl` instance.
   *
   * @param formState Initializes the control with an initial value,
   * or an object that defines the initial value and disabled state.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  constructor(
    formState?: any,
    validatorOrOpts?: FormControlOptions & {
      nonNullable: true;
    },
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
    this.initialValue = formState;
  }

  /**
   * @description
   * state of the control
   */
  get changed() {
    return this.value !== this.initialValue;
  }
}
