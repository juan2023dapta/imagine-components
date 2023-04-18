import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { BuildDatePipe } from './pipes/build-date.pipe';

@NgModule({
  declarations: [DatepickerComponent, DateFormatPipe, BuildDatePipe],
  imports: [CommonModule],
  exports: [DatepickerComponent, BuildDatePipe],
})
export class DatepickerModule {}
