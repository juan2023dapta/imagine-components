import { Pipe, PipeTransform } from '@angular/core';
import { ImagineDatepickerService } from '../services/imagine-datepicker.service';

@Pipe({
  name: 'dateFormat',
})
export class ImagineDateFormatPipe implements PipeTransform {
  /**
   *
   * @param datePickerService date picker service to share methods
   */
  constructor(private datePickerService: ImagineDatepickerService) {}
  /**
   * formats date according to the format
   * @param value date string to format
   * @param format date string format
   * @returns date formatted
   */
  transform(value: string | Date, format: string, showTimeDay = false) {
    return this.datePickerService.dateFormat(value, format, showTimeDay);
  }
}
