import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagineTooltipContentComponent } from './components/imagine-tooltip-content/imagine-tooltip-content.component';
import { ImagineTooltipDirective } from './directives/imagine-tooltip.directive';
import { ImagineTooltipComponent } from './components/imagine-tooltip/imagine-tooltip.component';

@NgModule({
  declarations: [ImagineTooltipContentComponent, ImagineTooltipDirective, ImagineTooltipComponent],
  imports: [CommonModule],
  exports: [ImagineTooltipContentComponent, ImagineTooltipDirective, ImagineTooltipComponent],
})
export class ImagineTooltipModule {}
