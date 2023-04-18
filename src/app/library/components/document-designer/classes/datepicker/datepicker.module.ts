import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { TooltipModule } from '../tooltip/tooltip.module';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { BuildDatePipe } from './pipes/build-date.pipe';

@NgModule({
  declarations: [DatepickerComponent, DateFormatPipe, BuildDatePipe],
  imports: [CommonModule, TooltipModule],
  exports: [DatepickerComponent, BuildDatePipe],
})
export class DatepickerModule {}
