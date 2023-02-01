import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FormsDocumentationRoutingModule } from './forms-documentation-routing.module';
import { ImagineInputDocumentationComponent } from './pages/imagine-input-documentation/imagine-input-documentation.component';
import { ImagineSelectDocumentationComponent } from './pages/imagine-select-documentation/imagine-select-documentation.component';
import { ImagineInputModule } from '../library/components/imagine-input/imagine-input.module';
import { ImagineSelectModule } from '../library/components/imagine-select/imagine-select.module';
import { ImagineButtonModule } from '../library/components/imagine-button/imagine-button.module';

@NgModule({
  declarations: [
    ImagineInputDocumentationComponent,
    ImagineSelectDocumentationComponent,
  ],
  imports: [
    CommonModule,
    FormsDocumentationRoutingModule,
    ImagineInputModule,
    ImagineSelectModule,
    ReactiveFormsModule,
    ImagineButtonModule,
  ],
})
export class FormsDocumentationModule {}
