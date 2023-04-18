import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { TooltipModule } from '../tooltip/tooltip.module';

@NgModule({
  declarations: [TextAreaComponent],
  imports: [CommonModule, TooltipModule],
  exports: [TextAreaComponent],
})
export class TextAreaModule {}
