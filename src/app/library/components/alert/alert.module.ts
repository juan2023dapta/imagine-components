import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/alert/alert.component';
import { AlertLoadingComponent } from './components/alert-loading/alert-loading.component';

@NgModule({
  declarations: [AlertComponent, AlertLoadingComponent],
  imports: [CommonModule],
  exports: [AlertComponent, AlertLoadingComponent],
})
export class AlertModule {}
