import { Pipe, PipeTransform } from '@angular/core';
import { DatepickerService } from '../services/datepicker.service';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  /**
   *
   * @param datePickerService date picker service to share methods
   */
  constructor(private datePickerService: DatepickerService) {}
  /**
   * formats date according to the format
   * @param value date string to format
   * @param format date string format
   * @returns date formatted
   */
  transform(value: string | Date, format: string) {
    return this.datePickerService.dateFormat(value, format);
  }
}
