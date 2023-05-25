import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagineFormCreatorComponent } from './components/imagine-form-creator/imagine-form-creator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImagineInputModule } from '../imagine-input/imagine-input.module';
import { ImagineNodeFormComponent } from './components/imagine-node-form/imagine-node-form.component';
import { ImagineSelectModule } from '../imagine-select/imagine-select.module';
import { ImagineToggleModule } from '../imagine-toggle/imagine-toggle.module';

@NgModule({
  declarations: [ImagineFormCreatorComponent, ImagineNodeFormComponent],
  imports: [CommonModule, ReactiveFormsModule, ImagineInputModule, ImagineSelectModule, ImagineToggleModule],
  exports: [ImagineFormCreatorComponent],
})
export class ImagineFormCreatorModule {}
