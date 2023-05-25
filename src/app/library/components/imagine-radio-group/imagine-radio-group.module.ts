import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagineRadioComponent } from './components/imagine-radio/imagine-radio.component';
import { ImagineRadioGroupComponent } from './components/imagine-radio-group/imagine-radio-group.component';

@NgModule({
  declarations: [ImagineRadioComponent, ImagineRadioGroupComponent],
  imports: [CommonModule],
  exports: [ImagineRadioComponent, ImagineRadioGroupComponent],
})
export class ImagineRadioGroupModule {}
