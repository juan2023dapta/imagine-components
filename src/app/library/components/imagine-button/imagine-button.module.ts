import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagineButtonComponent } from './components/imagine-button/imagine-button.component';

@NgModule({
  declarations: [ImagineButtonComponent],
  exports: [ImagineButtonComponent],
  imports: [CommonModule],
})
export class ImagineButtonModule {}
