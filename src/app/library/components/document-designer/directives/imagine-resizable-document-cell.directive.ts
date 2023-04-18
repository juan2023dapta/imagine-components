import { ContentChild, Directive, ElementRef, Inject, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[IMagineresizableDocumentCell]',
})
export class IMagineResizableDocumentCellDirective {
  /**column resizer inside the column */
  @ContentChild('columnResizer') columnResizer!: ElementRef<HTMLDivElement>;
  /**row resizer inside the column */
  @ContentChild('rowResizer') rowResizer!: ElementRef<HTMLDivElement>;
  /**tells the parent when width is changed */
  @Output() changeWidth = new EventEmitter();
  @Output() changeHeight = new EventEmitter();
  @Output() resizingColumn = new EventEmitter();
  @Output() resizingRow = new EventEmitter();
  @Output() rowResized = new EventEmitter();
  @Input() resizableColumn = true;
  @Input() resizableRow = true;
  /**if is rezising 't drag an drop */
  isResizing = false;
  /**Current resizer selected */
  currentResizer: any;
  /**Prev x position of resize */
  prevXResize: any;
  /**Prev x position of resize */
  prevYResize: any;
  /**touched column */
  touched = false;

  /**
   *
   * @param elementRef access cell element reference
   */
  constructor(
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLTableCellElement>
  ) {}

  /**
   * access the resizers and enables them to resize the table cell
   */
  setResizable() {
    this.setResizableColumn();
    this.setResizableRow();
  }

  /**
   * access the column resizers and sets the event listeners for resize
   */
  setResizableColumn() {
    if (this.columnResizer) {
      if (this.resizableColumn) {
        this.columnResizer.nativeElement.style.cursor = 'col-resize';
        this.columnResizer.nativeElement.addEventListener('mousedown', this.mousedownResizeColumn);
        this.columnResizer.nativeElement.style.opacity = '1';
      } else {
        this.columnResizer.nativeElement.style.opacity = '0';
        this.columnResizer.nativeElement.removeEventListener('mousedown', this.mousedownResizeColumn);
        window.removeEventListener('mousemove', this.mouseMoveResizeColumn);
        window.removeEventListener('mouseup', this.mouseUpResizeColumn);
      }
    }
  }

  /**
   * on mouse down column resizer sets another event listeners
   * @param e mouse event
   */
  mousedownResizeColumn = (e: any) => {
    e.stopPropagation();
    this.isResizing = true;
    this.resizingColumn.emit(true);
    this.currentResizer = e.target;
    this.prevXResize = e.clientX;
    window.addEventListener('mousemove', this.mouseMoveResizeColumn);
    window.addEventListener('mouseup', this.mouseUpResizeColumn);
  };

  /**
   * on mouse move the cell is resized
   * @param e mouse event
   */
  mouseMoveResizeColumn = (e: any) => {
    const rect = this.columnRectItem;
    const rectParent = this.columnRectParent;
    const width = rect.width - (this.prevXResize - e.clientX);
    const currentRelativeWidth = (width / rectParent.width) * 100 + '%';
    const nextSibling = this.elementRef.nativeElement.nextElementSibling?.nextElementSibling as HTMLElement;
    this.elementRef.nativeElement.style.width = currentRelativeWidth;
    if (nextSibling) {
      const nextSiblingRealWidth = nextSibling.getBoundingClientRect().width + (this.prevXResize - e.clientX);
      const nextSiblingRelativeWidth = (nextSiblingRealWidth / rectParent.width) * 100 + '%';
      nextSibling.style.width = nextSiblingRelativeWidth;
    }
    this.prevXResize = e.clientX;
    this.changeWidth.emit();
  };

  /**
   * On mouse up event removes the listeners
   */
  mouseUpResizeColumn = () => {
    window.removeEventListener('mousemove', this.mouseMoveResizeColumn);
    window.removeEventListener('mouseup', this.mouseUpResizeColumn);
    this.isResizing = false;
    this.resizingColumn.emit(false);
  };
  /**
   * access the row resizers and sets the event listeners for resize
   */
  setResizableRow() {
    if (this.rowResizer) {
      if (this.resizableRow) {
        this.rowResizer.nativeElement.addEventListener('mousedown', this.mousedownResizeRow);
        this.rowResizer.nativeElement.style.opacity = '1';
      } else {
        this.rowResizer.nativeElement.style.opacity = '0';
        this.rowResizer.nativeElement.removeEventListener('mousedown', this.mousedownResizeRow);
        window.removeEventListener('mousemove', this.mouseMoveResizeRow);
        window.removeEventListener('mouseup', this.mouseUpResizeRow);
      }
    }
  }
  /**
   * on mouse down column resizer sets another event listeners
   * @param e mouse event
   */
  mousedownResizeRow = (e: MouseEvent) => {
    e.stopPropagation();
    this.isResizing = true;
    this.resizingRow.emit(true);
    this.elementRef.nativeElement.parentElement?.setAttribute('resizing', 'true');
    this.currentResizer = e.target;
    this.prevYResize = e.clientY;
    window.addEventListener('mousemove', this.mouseMoveResizeRow);
    window.addEventListener('mouseup', this.mouseUpResizeRow);
  };
  /**
   * on mouse move the cell is resized
   * @param e mouse event
   */
  mouseMoveResizeRow = (e: MouseEvent) => {
    if (this.isResizing) {
      e.stopPropagation();
      e.preventDefault();
    }
    const rect = this.rowRectItem;
    const rectParent = this.rowRectParent;
    if (rect) {
      const height = rect.height - (this.prevYResize - e.clientY);
      const currentRelativeheight = (height / rectParent.height) * 100 + '%';
      if (this.elementRef.nativeElement.parentElement) {
        this.elementRef.nativeElement.parentElement.style.height = currentRelativeheight;
        const nextSibling = this.elementRef.nativeElement.parentElement.nextElementSibling as HTMLElement;
        if (nextSibling) {
          const nextSiblingRealHeight = nextSibling.getBoundingClientRect().height + (this.prevYResize - e.clientY);
          const nextSiblingRelativeHeight = (nextSiblingRealHeight / rectParent.height) * 100 + '%';
          nextSibling.style.height = nextSiblingRelativeHeight;
        }
      }
      this.prevYResize = e.clientY;
      this.changeHeight.emit();
    }
  };

  /**
   * On mouse up event removes the listeners
   */
  mouseUpResizeRow = () => {
    window.removeEventListener('mousemove', this.mouseMoveResizeRow);
    window.removeEventListener('mouseup', this.mouseUpResizeRow);
    this.elementRef.nativeElement.parentElement?.removeAttribute('resizing');
    this.isResizing = false;
    this.resizingRow.emit(false);
    this.rowResized.emit(true);
  };

  /**
   * access the bounding client rect of the parentElement for the column
   */
  get columnRectParent() {
    return this.elementRef.nativeElement.parentElement?.getBoundingClientRect() as DOMRect;
  }
  /**
   * access the bounding client rect of the parentElement for the row
   */
  get rowRectParent() {
    return this.elementRef.nativeElement.parentElement?.parentElement?.getBoundingClientRect() as DOMRect;
  }
  /**
   * access the bounding client rect of the column element
   */
  get columnRectItem() {
    return this.elementRef.nativeElement.getBoundingClientRect();
  }
  /**
   * access the bounding client rect of the row element
   */
  get rowRectItem() {
    return this.elementRef.nativeElement.parentElement?.getBoundingClientRect();
  }
}
