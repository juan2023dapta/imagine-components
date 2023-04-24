import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buildDate',
})
export class ImagineBuildDatePipe implements PipeTransform {
  transform(data: { year: number; month: number; day: number }): Date {
    const { year, month, day } = data;
    return new Date(year, month, day);
  }
}
