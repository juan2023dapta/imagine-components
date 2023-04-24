import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagineDateFormatPipe } from './pipes/imagine-date-format.pipe';
import { ImagineBuildDatePipe } from './pipes/imagine-build-date.pipe';
import { ImagineDatepickerComponent } from './components/datepicker/imagine-datepicker.component';

@NgModule({
  declarations: [ImagineDatepickerComponent, ImagineDateFormatPipe, ImagineBuildDatePipe],
  imports: [CommonModule],
  exports: [ImagineDatepickerComponent, ImagineBuildDatePipe],
})
export class ImagineDatepickerModule {}
