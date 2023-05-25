import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ImagineFormGroup } from '../../classes/imagine-forms/imagine-form-group.class';

@Injectable({
  providedIn: 'root',
})
export class ImagineFormValidators {
  /**
   * checks if array is emty
   * @returns
   */
  requiredIf(comparisonData: { field: string; operator: string; value: any }, fieldToBeRequired: string): ValidatorFn {
    const { field, operator, value } = comparisonData;
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control as ImagineFormGroup;
      if (!form) {
        return null;
      }
      const functionToEvaluate = new Function(
        `value, equal`,
        `
        return value ${operator} equal
      `
      );

      if (functionToEvaluate(form.controls[field].value, value)) {
        if (!form.validatorExist(fieldToBeRequired, Validators.required)) {
          form.controls[fieldToBeRequired].setValidators([Validators.required]);
          form.controls[fieldToBeRequired].updateValueAndValidity();
        }
      } else {
        if (form.validatorExist(fieldToBeRequired, Validators.required)) {
          form.controls[fieldToBeRequired].setValidators(null);
          form.controls[fieldToBeRequired].updateValueAndValidity();
        }
      }
      return null;
    };
  }

  objectPath(value: string, objectValue: any) {
    value = value.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    value = value.replace(/^\./, ''); // strip a leading dot
    const array = value.split('.');
    for (let i = 0, n = array.length; i < n; ++i) {
      const k = array[i];
      if (k in objectValue) {
        objectValue = objectValue[k];
      } else {
        return;
      }
    }
    return objectValue;
  }
}
