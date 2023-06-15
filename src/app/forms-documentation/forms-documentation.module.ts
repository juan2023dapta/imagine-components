import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FormsDocumentationRoutingModule } from './forms-documentation-routing.module';
import { ImagineInputDocumentationComponent } from './pages/imagine-input-documentation/imagine-input-documentation.component';
import { ImagineSelectDocumentationComponent } from './pages/imagine-select-documentation/imagine-select-documentation.component';
import { ImagineInputModule } from '../library/components/imagine-input/imagine-input.module';
import { ImagineSelectModule } from '../library/components/imagine-select/imagine-select.module';
import { ImagineButtonModule } from '../library/components/imagine-button/imagine-button.module';
import { ImagineTooltipModule } from '../library/components/imagine-tooltip/imagine-tooltip.module';
import { ImagineFormsDocumentationComponent } from './pages/imagine-forms-documentation/imagine-forms-documentation.component';
import { ImagineDatepickerModule } from '../library/components/imagine-datepicker/imagine-datepicker.module';
import { ImagineDatePickerDocumentationComponent } from './pages/imagine-date-picker-documentation/imagine-date-picker-documentation.component';
import { ImaginePopUpDocumentationComponent } from './pages/imagine-pop-up-documentation/imagine-pop-up-documentation.component';

@NgModule({
  declarations: [
    ImagineInputDocumentationComponent,
    ImagineSelectDocumentationComponent,
    ImagineFormsDocumentationComponent,
    ImagineDatePickerDocumentationComponent,
    ImaginePopUpDocumentationComponent,
  ],
  imports: [
    CommonModule,
    FormsDocumentationRoutingModule,
    ImagineInputModule,
    ImagineSelectModule,
    ReactiveFormsModule,
    ImagineButtonModule,
    ImagineTooltipModule,
    ImagineDatepickerModule,
  ],
})
export class FormsDocumentationModule {}
