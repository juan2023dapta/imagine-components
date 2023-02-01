import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagineSelectComponent } from './components/imagine-select/imagine-select.component';
import { ImagineSelectOptionComponent } from './components/imagine-select-option/imagine-select-option.component';

@NgModule({
  declarations: [ImagineSelectComponent, ImagineSelectOptionComponent],
  imports: [CommonModule],
  exports: [ImagineSelectComponent, ImagineSelectOptionComponent],
})
export class ImagineSelectModule {}
