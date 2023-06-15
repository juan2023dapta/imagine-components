import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImaginePopUpComponent } from './components/imagine-pop-up/imagine-pop-up.component';
import { ImaginePopUpDynamicHostDirective } from './directives/imagine-pop-up-dynamic-host.directive';
import { ImaginePopUpContainerComponent } from './components/imagine-pop-up-container/imagine-pop-up-container.component';

@NgModule({
  declarations: [ImaginePopUpComponent, ImaginePopUpDynamicHostDirective, ImaginePopUpContainerComponent],
  imports: [CommonModule],
  exports: [ImaginePopUpContainerComponent],
})
export class ImaginePopUpModule {}
