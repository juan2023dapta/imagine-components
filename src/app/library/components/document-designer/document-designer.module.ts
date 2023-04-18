import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [
    ImagineDcument,
    DocumentElementComponent,
    ElementPropertiesComponent,
    ElementTypeDirective,
    ResizableDocumentCellDirective,
    DateFormatPipe,
  ],
  imports: [CommonModule],
  exports: [DocumentDesignerComponent, DocumentElementComponent, ElementPropertiesComponent, ElementTypeDirective],
})
export class DocumentDesignerModule {}
