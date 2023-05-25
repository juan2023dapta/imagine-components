import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImagineToggleComponent } from './components/imagine-toggle/imagine-toggle.component';
import { ImagineSwitchComponent } from './components/imagine-switch/imagine-switch.component';

@NgModule({
  declarations: [ImagineToggleComponent, ImagineSwitchComponent],
  imports: [CommonModule, FormsModule],
  exports: [ImagineToggleComponent, ImagineSwitchComponent],
})
export class ImagineToggleModule {}
