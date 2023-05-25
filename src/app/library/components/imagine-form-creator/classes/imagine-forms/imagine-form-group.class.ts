import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { ImagineFormControl } from './imagine-form-control.class';
import { ImagineAbstractControl } from './imagine-abstract-control.class';
import { NodeStructure } from '../../interfaces/imagine-node-structure.interface';

export class ImagineFormGroup extends FormGroup {
  /**
   * @description
   * inital value of the form to check state
   */
  initalValue: any;

  /**
   * child nodes of the form
   */
  nodesStructure: NodeStructure[] = [];

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

  /**
   * sets nodesStructure of the form to paint in
   */
  setNodesStructure(nodesStructure: NodeStructure[]) {
    this.nodesStructure = nodesStructure;
  }

  /**
   * returns true if control has validator
   * @param field field to check
   * @param validator validator to check
   * @returns boolean
   */
  validatorExist(field: string, validator: any) {
    return this.controls[field].hasValidator(validator);
  }
}
