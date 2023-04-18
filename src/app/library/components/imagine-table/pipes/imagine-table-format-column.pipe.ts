import { Pipe, PipeTransform } from '@angular/core';
import { ImagineTableColDef } from '../interfaces/imagine-table.interface';

@Pipe({
  name: 'imagineTableFormatColumn',
})
export class ImagineFormatColumnTablePipe implements PipeTransform {
  /**
   *
   * @param value value to format
   * @param colDef column definition
   * @returns value formatred
   */
  transform(value: any, colDef: ImagineTableColDef) {
    let newValue = value;
    if (colDef && colDef.columnFunctionFormat) {
      newValue = colDef.columnFunctionFormat(newValue);
    }
    return newValue;
  }
}
