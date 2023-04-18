import { Pipe, PipeTransform } from '@angular/core';
import { dateFormat } from '../methods/document-dates.methods';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  /**
   * formats date according to the format
   * @param value date string to format
   * @param format date string format
   * @returns date formatted
   */
  transform(value: string | Date, format: string): unknown {
    return dateFormat(value, format);
  }
}
