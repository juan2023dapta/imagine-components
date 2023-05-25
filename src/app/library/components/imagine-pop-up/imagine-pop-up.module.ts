import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImaginePopUpComponent } from './components/imagine-pop-up/imagine-pop-up.component';
import { ImaginePopUpDynamicHostDirective } from './directives/imagine-pop-up-dynamic-host.directive';

@NgModule({
  declarations: [ImaginePopUpComponent, ImaginePopUpDynamicHostDirective],
  imports: [CommonModule],
  exports: [ImaginePopUpComponent],
})
export class ImaginePopUpModule {}
