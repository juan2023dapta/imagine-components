import { ContentChild, Directive, ElementRef, Inject, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[imagineTableCellResizable]',
})
export class ImagineResizableCellDirective implements AfterViewInit {
  @ContentChild('resizer') resizer!: ElementRef<HTMLDivElement>;
  @Output() changeWidth = new EventEmitter();
  @Output() resizing = new EventEmitter();
  @Input() set resizable(resizable: boolean) {
    this._resizable = resizable;
    this.setResizableColumns();
  }
  _resizable = false;
  @Input() starterWidth!: string;
  /**sets prev x position */
  prevXItem: any;
  /**sets prev y position to update */
  prevYItem: any;
  /**if is rezising 't drag an drop */
  isResizing = false;

  /**Current resizer selected */
  currentResizer: any;
  /**Current resizer selected */
  currentWidth: any;
  /**Prev x position of resize */
  prevXResize: any;
  /**Prev y position of resize */
  prevYResize: any;
  /**When object is outside parent */
  isOutside = false;

  constructor(
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLTableElement>
  ) {}

  ngAfterViewInit(): void {
    this.setResizableColumns();
  }

  setResizableColumns() {
    if (this.resizer) {
      if (this._resizable) {
        this.resizer.nativeElement.style.cursor = 'col-resize';
        this.resizer.nativeElement.addEventListener('mousedown', this.mousedownResize);
        this.resizer.nativeElement.style.opacity = '1';
      } else {
        this.resizer.nativeElement.style.opacity = '0';
        this.resizer.nativeElement.removeEventListener('mousedown', this.mousedownResize);
        window.removeEventListener('mousemove', this.mouseMoveResize);
        window.removeEventListener('mouseup', this.mouseUpResize);
      }
    }

    this.elementRef.nativeElement.style.width = this.starterWidth;
  }

  mousedownResize = (e: any) => {
    e.stopPropagation();
    this.isResizing = true;
    this.resizing.emit(true);
    this.currentResizer = e.target;
    this.currentWidth = this.rectItem.width;
    this.prevXResize = e.clientX;
    this.prevYResize = e.clientY;
    window.addEventListener('mousemove', this.mouseMoveResize);
    window.addEventListener('mouseup', this.mouseUpResize);
  };

  mouseMoveResize = (e: any) => {
    const rect = this.rectItem;
    const rectParent = this.rectParent;
    const newX = this.prevXResize - (e.clientX - rectParent.left);
    const left = rect.left - newX;
    const width = rect.width - (this.prevXResize - e.clientX);

    if (left + width <= rectParent.width) {
      this.elementRef.nativeElement.style.width = (width / rectParent.width) * 100 + '%';
    }

    this.prevXResize = e.clientX;
    this.prevYResize = e.clientY;
  };
  mouseUpResize = () => {
    window.removeEventListener('mousemove', this.mouseMoveResize);
    window.removeEventListener('mouseup', this.mouseUpResize);
    this.isResizing = false;
    this.resizing.emit(false);
    this.changeWidth.emit();
  };

  get rectParent() {
    return this.elementRef.nativeElement.parentElement?.getBoundingClientRect() as DOMRect;
  }
  get rectItem() {
    return this.elementRef.nativeElement.getBoundingClientRect();
  }
}
