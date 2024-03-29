import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@NgModule({
  declarations: [SidenavComponent],
  imports: [CommonModule],
  exports: [SidenavComponent],
})
export class SidenavModule {}
