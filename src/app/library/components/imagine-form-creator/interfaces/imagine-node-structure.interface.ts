import { ImagineFormGroup } from '../classes/imagine-forms/imagine-form-group.class';
import { ImagineInputData } from './imagine-input-data.interface';

export interface NodeStructure {
  type?: 'input' | 'select' | 'switch' | 'form';
  className?: string;
  formControlName?: string;
  formGroupName?: string;
  childNodes?: NodeStructure[];
  inputData?: ImagineInputData;
  selectOptions?: { value: string; label: string }[];
  conditionToShow?: any;
}
