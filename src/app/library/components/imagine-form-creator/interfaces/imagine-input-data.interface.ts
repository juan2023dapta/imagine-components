export interface ImagineInputData {
  [key: string]: any;
}
type ImagineInputType =
  | 'text'
  | 'password'
  | 'number'
  | 'positiveNumber'
  | 'currency'
  | 'groupNumber'
  | 'phone'
  | 'mask'
  | 'color'
  | 'chip'
  | 'title'
  | 'variables'
  | 'box';
