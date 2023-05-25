import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ImagineFormGroup } from '../../classes/imagine-forms/imagine-form-group.class';
import { NodeStructure } from '../../interfaces/imagine-node-structure.interface';
import { ImagineFormControl } from '../../classes/imagine-forms/imagine-form-control.class';

@Injectable({
  providedIn: 'root',
})
export class ImagineFormBuilder extends FormBuilder {
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
  groupWithNodes(data: {
    controls: {
      [key: string]: any | any[];
    };
    options?: AbstractControlOptions | null;
    nodesStructure?: NodeStructure[];
  }): ImagineFormGroup {
    const { controls, options, nodesStructure } = data;
    const reducedControls = this._reduceControls(controls);
    let newOptions: any = {};
    if (this.isAbstractControlOptions(options)) {
      // `options` are `AbstractControlOptions`
      newOptions = options;
    }
    const form = new ImagineFormGroup(reducedControls, newOptions);
    if (nodesStructure) {
      form.setNodesStructure(nodesStructure);
    }
    return form;
  }

  isAbstractControlOptions(options: any) {
    return (
      !!options &&
      (options.asyncValidators !== undefined || options.validators !== undefined || options.updateOn !== undefined)
    );
  }

  /** @internal */
  _reduceControls(controls: any) {
    const createdControls: any = {};
    Object.keys(controls).forEach((controlName) => {
      createdControls[controlName] = this._createControl(controls[controlName]);
    });
    return createdControls;
  }
  /** @internal */
  _createControl(controls: any) {
    if (controls instanceof FormControl) {
      return controls;
    } else if (controls instanceof AbstractControl) {
      // A control; just return it
      return controls;
    } else if (Array.isArray(controls)) {
      // ControlConfig Tuple
      const value = controls[0];
      const validator = controls.length > 1 ? controls[1] : null;
      const asyncValidator = controls.length > 2 ? controls[2] : null;
      return this.controlBuilder(value, validator, asyncValidator);
    } else {
      // T or FormControlState<T>
      return this.controlBuilder(controls);
    }
  }

  /**
   * @description
   * Constructs a new `FormControl` with the given state, validators and options. Sets
   * `{nonNullable: true}` in the options to get a non-nullable control. Otherwise, the
   * control will be nullable. Accepts a single generic argument, which is the type  of the
   * control's value.
   *
   * @param formState Initializes the control with an initial state value, or
   * with an object that contains both a value and a disabled status.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or a `FormControlOptions` object that contains
   * validation functions and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator
   * functions.
   *
   * @usageNotes
   *
   * ### Initialize a control as disabled
   *
   * The following example returns a control with an initial value in a disabled state.
   *
   * <code-example path="forms/ts/formBuilder/form_builder_example.ts" region="disabled-control">
   * </code-example>
   */
  controlBuilder(formState: any, validatorOrOpts?: any, asyncValidator?: any) {
    let newOptions: any = {};
    if (!this.nonNullable) {
      return new ImagineFormControl(formState, validatorOrOpts, asyncValidator);
    }
    if (this.isAbstractControlOptions(validatorOrOpts)) {
      // If the second argument is options, then they are copied.
      newOptions = validatorOrOpts;
    } else {
      // If the other arguments are validators, they are copied into an options object.
      newOptions.validators = validatorOrOpts;
      newOptions.asyncValidators = asyncValidator;
    }
    return new ImagineFormControl(formState, { ...newOptions, nonNullable: true });
  }

  /**
   * Constructs a new `FormArray` from the given array of configurations,
   * validators and options. Accepts a single generic argument, which is the type of each control
   * inside the array.
   *
   * @param controls An array of child controls or control configs. Each child control is given an
   *     index when it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of such functions, or an
   *     `AbstractControlOptions` object that contains
   * validation functions and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions.
   */
  arrayBuilder(controls: ImagineFormControl[], validatorOrOpts: any, asyncValidator: any) {
    const createdControls = controls.map((c) => this._createControl(c));
    // Cast to `any` because the inferred types are not as specific as Element.
    return new FormArray(createdControls, validatorOrOpts, asyncValidator);
  }
}
