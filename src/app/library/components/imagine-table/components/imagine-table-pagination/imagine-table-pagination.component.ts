import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'imagine-table-pagination',
  templateUrl: './imagine-table-pagination.component.html',
  styleUrls: ['./imagine-table-pagination.component.scss'],
})
export class ImagineTablePaginationComponent {
  /**tells the parent whe page change */
  @Output() pageChange = new EventEmitter();
  /** pagination data */
  @Input() results = 0;
  @Input() totalResults = 0;
  @Input() currentPage = 1;
  @Input() lastPage = 1;

  /**
   * manage pagination
   * @param direction checks to go back or next in pagination
   */
  pagination(direction: 'previous' | 'next') {
    if (direction === 'previous') {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    } else if (direction === 'next') {
      if (this.currentPage < this.lastPage) {
        this.currentPage++;
      }
    }
    this.pageChange.emit({ currentPage: this.currentPage });
  }
}
