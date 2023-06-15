import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagineInputComponent } from './components/imagine-input/imagine-input.component';
import { ImagineCodeEditorComponent } from './components/imagine-code-editor/imagine-code-editor.component';

@NgModule({
  declarations: [ImagineInputComponent, ImagineCodeEditorComponent],
  imports: [CommonModule],
  exports: [ImagineInputComponent, ImagineCodeEditorComponent],
})
export class ImagineInputModule {}
