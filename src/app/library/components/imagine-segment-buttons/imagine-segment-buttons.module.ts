import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagineButtonModule } from '../imagine-button/imagine-button.module';
import { ImagineSegmentButtonComponent } from './components/imagine-segment-button/imagine-segment-button.component';
import { ImagineSegmentButtonsComponent } from './components/imagine-segment-buttons/imagine-segment-buttons.component';

@NgModule({
  declarations: [ImagineSegmentButtonComponent, ImagineSegmentButtonsComponent],
  imports: [CommonModule, ImagineButtonModule],
  exports: [ImagineSegmentButtonComponent, ImagineSegmentButtonsComponent],
})
export class ImagineSegmentButtonsModule {}
