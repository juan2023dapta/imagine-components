import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagineAlertComponent } from './components/imagine-alert/imagine-alert.component';
import { ImagineAlertLoadingComponent } from './components/imagine-alert-loading/imagine-alert-loading.component';

@NgModule({
  declarations: [ImagineAlertComponent, ImagineAlertLoadingComponent],
  imports: [CommonModule],
  exports: [ImagineAlertComponent, ImagineAlertLoadingComponent],
})
export class ImagineAlertModule {}
