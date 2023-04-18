import { AfterViewInit, Directive, ElementRef, EventEmitter, Inject, Output } from '@angular/core';

@Directive({
  selector: '[resizableDocumentTable]',
})
export class ResizableDocumentTableDirective implements AfterViewInit {
  @Output() resizing = new EventEmitter();
  @Output() valueChange = new EventEmitter();
  constructor(
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLTableElement>
  ) {}

  ngAfterViewInit(): void {
    this.setResizable();
  }

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

  setAutoWidth() {
    const table = this.elementRef.nativeElement;
    // Query all headers
    const cols = table.querySelectorAll('th');

    cols.forEach((col) => {
      col.style.width = 'auto';
    });
  }
}
