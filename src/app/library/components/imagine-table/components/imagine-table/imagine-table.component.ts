import { AfterViewInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { ImagineCellTemplateDirective } from '../../directives/imagine-table-cell-template.directive';
import {
  ImagineTableColDef,
  ImagineTableConfig,
  ImagineTableLoadingConfig,
} from '../../interfaces/imagine-table.interface';

@Component({
  selector: 'imagine-table',
  templateUrl: './imagine-table.component.html',
  styleUrls: ['./imagine-table.component.scss'],
})
export class ImagineTableComponent implements AfterViewInit {
  /**table templates to has custom cells */
  @ContentChildren(ImagineCellTemplateDirective, { read: ImagineCellTemplateDirective })
  templates!: QueryList<ImagineCellTemplateDirective>;
  /**stores cell templates */
  colTemplates: any[] = [];
  /**tells the parent whe row was clicked */
  @Output() rowClicked = new EventEmitter();
  /**tells the parent when delete action is clicked */
  @Output() deleteItem = new EventEmitter();
  /**tells the parent when edit action is clicked */
  @Output() editItem = new EventEmitter();
  /**data source to be painted */
  @Input() dataSource: any[] = [];
  /**flag to know if table has sticky header */
  @Input() stickyHead = true;
  /**table config to paint cells */
  @Input() tableConfig: ImagineTableConfig = {
    editAction: false,
    deleteAction: false,
    actionsTitle: null,
    colDefs: [],
  };
  /**loading config to show skeleton while loading */
  @Input() loadingConfig: ImagineTableLoadingConfig = {
    loadingData: false,
    skeletonHeight: '19px',
    rowsNumber: 0,
  };

  /**
   * after view init stores the templates inside the component in an array
   */
  ngAfterViewInit() {
    this.templates.forEach((template) => {
      this.colTemplates.push(template);
    });
  }

  /**
   * on row click tells the parent row was clicked
   * @param row row date
   * @param col col data to know if tells the parent or not thta row was clicked
   */
  rowClick(row: any, col: ImagineTableColDef) {
    if (col.stopClickPropagation) {
      return;
    }
    this.rowClicked.emit(row);
  }
}
