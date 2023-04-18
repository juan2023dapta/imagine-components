import { AfterViewInit, Directive, ElementRef, EventEmitter, Inject, Output } from '@angular/core';

@Directive({
  selector: '[imagineResizableTable]',
})
export class ImagineResizableTableDirective implements AfterViewInit {
  /**tells the parent is resizing */
  @Output() resizing = new EventEmitter();
  /**tells the parent width change*/
  @Output() valueChange = new EventEmitter();
  /**
   *
   * @param elementRef table element reference
   */
  constructor(
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLTableElement>
  ) {}

  /**
   * after view init
   */
  ngAfterViewInit(): void {
    this.setResizable();
  }

  /**
   * sets the table native element resizable
   */
  setResizable() {
    const table = this.elementRef.nativeElement;
    // Query all headers
    const cols = table.querySelectorAll('.first-row');
    // Loop over them
    cols.forEach((col, i) => {
      //create resizers
      if (i < cols.length - 1) {
        const createResizableColumn = (col: any) => {
          const resizer = col.querySelector('.resizer');
          // Track the current position of mouse
          let x = 0;
          let w = 0;

          const mouseDownHandler = (e: any) => {
            e.stopPropagation();
            // Get the current mouse position
            x = e.clientX;

            // Calculate the current width of column
            const styles = window.getComputedStyle(col);
            w = parseInt(styles.width, 10);

            // Attach listeners for document's events
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
            this.resizing.emit(true);
          };

          const mouseMoveHandler = (e: any) => {
            // Determine how far the mouse has been moved
            const dx = e.clientX - x;

            // Update the width of column
            col.style.width = `${w + dx}px`;
          };

          // When user releases the mouse, remove the existing event listeners
          const mouseUpHandler = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            resizer.classList.remove('resizing');
            this.resizing.emit(true);
            this.valueChange.emit();
          };

          resizer.addEventListener('mousedown', mouseDownHandler);
        };

        // Will be implemented in the next section
        createResizableColumn(col);
      }
    });
  }
  /**
   * tell the table to set auto width to columns
   */
  setAutoWidth() {
    const table = this.elementRef.nativeElement;
    // Query all headers
    const cols = table.querySelectorAll('th');

    cols.forEach((col) => {
      col.style.width = 'auto';
    });
  }
}
