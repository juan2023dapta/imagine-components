import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagineTableComponent } from './components/imagine-table/imagine-table.component';
import { ImagineTablePaginationComponent } from './components/imagine-table-pagination/imagine-table-pagination.component';
import { ImagineCellTemplateDirective } from './directives/imagine-table-cell-template.directive';
import { ImagineTableObjectPathPipe } from './pipes/imagine-table-object-path.pipe';
import { ImagineFormatColumnTablePipe } from './pipes/imagine-table-format-column.pipe';

@NgModule({
  declarations: [
    ImagineTableComponent,
    ImagineTablePaginationComponent,
    ImagineCellTemplateDirective,
    ImagineTableObjectPathPipe,
    ImagineFormatColumnTablePipe,
  ],
  imports: [CommonModule],
  exports: [ImagineTableComponent, ImagineTablePaginationComponent, ImagineCellTemplateDirective],
})
export class ImagineTableModule {}
