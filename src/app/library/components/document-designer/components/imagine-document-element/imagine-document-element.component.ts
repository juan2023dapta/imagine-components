import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';

import { AreaElement, CheckAreaElement } from '../../classes/area-element.class';
import { DocumentElement } from '../../classes/document-element.class';
import { ImageElement } from '../../classes/image-element.class';
import { TableElement } from '../../classes/table-element.class';
import { TextElement } from '../../classes/text-element.class';
import { ContextMenuOption } from '../../interfaces/context-menu.interface';
import { DocumentElementType } from '../../interfaces/document-element-type.interface';
import { TableActionData } from '../../interfaces/table-action-data.interface';
import { AllContextMenuOptions } from '../../types/context-menu-options.type';
import { ImagineDocumentDesignerComponent } from '../imagine-document-designer/imagine-document-designer.component';

@Component({
  selector: 'imagine-document-element',
  templateUrl: './imagine-document-element.component.html',
  styleUrls: ['./imagine-document-element.component.scss'],
})
export class ImagineDocumentElementComponent implements AfterViewInit, OnDestroy {
  /**Access drag an drop item */
  @ViewChild('item') item!: ElementRef<HTMLDivElement>;
  /**Access to tables */
  @ViewChild('table') table!: ElementRef<HTMLTableElement>;

  /**Access to image content */
  @ViewChild('imageContent') imageContent!: ElementRef<HTMLImageElement>;
  /**Access resizers to resize items */
  @ViewChildren('resizer') resizers!: QueryList<ElementRef<HTMLDivElement>>;

  /**Access column resizers table directives */
  @ViewChildren(ResizableDocumentCellDirective) cellResizers!: QueryList<ResizableDocumentCellDirective>;

  /**Tells the parent component to open contextMenu */
  @Output() contextMenuChange = new EventEmitter();

  /**Defines the element */
  @Input() element!: DocumentElement;
  /**parent element */
  @Input() documentDesignerComponent!: ImagineDocumentDesignerComponent;
  /**units */
  @Input() units: 'px' | 'mm' = 'px';
  /**Zoom scale */
  @Input() zoom = 1;
  /**Element type */
  type: DocumentElementType | undefined;
  /**sets prev x position */
  prevXItem: any;
  /**sets prev y position to update */
  prevYItem: any;
  /**if is rezising drag an drop */
  isResizing = false;
  /**if is rezising drag an drop */
  isMoving = false;
  /**if is rezising table column */
  isResizingTableColumn = false;
  /**if is rezising table row */
  isResizingTableRow = false;

  /**Current resizer selected */
  currentResizer: any;
  /**Prev x position of resize */
  prevXResize: any;
  /**Prev y position of resize */
  prevYResize: any;
  /**When object is outside parent */
  isOutside = false;

  /**Dont let resize the height of the element*/
  blockResizeHeight = false;
  /**Dont let resize the width of the element*/
  blockResizeWidth = false;
  /**Dont let move the element in x*/
  blockMoveXPosition = false;
  /**Dont let move the element in y*/
  blockMoveYPosition = false;

  /**Tells if element is seleted */
  itemSelected = false;
  /**Tells if element is overlaped by selection */
  itemOverlapped = false;

  /**Stores selected elements by area*/
  elementsSelected: DocumentElementComponent[] = [];

  /**pressing control key to copy and paste */
  pressingCtrlKey = false;

  /**Context menu display*/
  contextMenuDisplay = 'none';

  /**
   *
   * @param changeDetector changeDetectorRef detect changes to avoid after view init bugs
   */
  constructor(private changeDetector: ChangeDetectorRef) {}

  /**Returns element as instace of text element */
  get textElement() {
    return this.element as TextElement;
  }

  /**text element styles */
  get textElementStyles() {
    return {
      margin:
        this.textElement.alignment === 'center'
          ? '0 auto'
          : this.textElement.alignment === 'right'
          ? '0 0 0 auto'
          : '0 auto 0 0',
      fontSize: this.textElement.fontSize + this.units,
      fontFamily: this.textElement.fontFamily + ', sans-serif',
      color: this.textElement.color,
      letterSpacing: this.textElement.characterSpacing + this.units,
      fontWeight: this.textElement.bold ? 'bold' : '400',
      fontStyle: this.textElement.italics ? 'italic' : '',
      textDecorationStyle: this.textElement.decorationStyle,
      textDecoration:
        (this.textElement.decoration === 'lineThrough' ? 'line-through' : this.textElement.decoration) +
        ' ' +
        this.textElement.decorationStyle,
    };
  }

  /**Returns element as instace of image element*/
  get imageElement() {
    return this.element as ImageElement;
  }

  /**Returns background image of element image*/
  get backgroundImage() {
    return `url('${this.imageElement.image}'`;
  }

  /**Returns element as instace of table */
  get tableElement() {
    return this.element as TableElement;
  }

  /**Returns element as instace of checkarea */
  get checkAreaElement() {
    return this.element as CheckAreaElement;
  }

  /**Tells if element is a table*/
  get isTableElement() {
    return this.element instanceof TableElement;
  }

  /**Tells if element is an area*/
  get isAreaElement() {
    return this.element instanceof AreaElement;
  }
  /**Tells if element is an image*/
  get isImageElement() {
    return this.element instanceof ImageElement;
  }

  /**Returns the parent position*/
  get rectParent() {
    return this.documentDesignerComponent.containerElement.nativeElement.getBoundingClientRect();
  }

  /**Returns the item position*/
  get rectItem() {
    return this.item.nativeElement.getBoundingClientRect();
  }

  /**Returns true if can resize element */
  get canResize() {
    return this.type && !this.type.disableResize;
  }

  /**
   * element ng style
   */
  get ngStyle() {
    return {
      top: this.element.y + this.units,
      left: this.element.x + this.units,
      'pointer-events': this.itemOverlapped ? 'none' : '',
      background: this.isImageElement ? this.backgroundImage : '',
      ...this.type?.style,
    };
  }

  /** After view init */
  ngAfterViewInit(): void {
    this.type = this.documentDesignerComponent.types.find((type) => type.type === this.element.type);
    this.element.documentElementComponent = this;
    this.element.units = this.units;
    this.element.setValues();
    this.setRealPosition();

    for (const resizer of this.resizers) {
      resizer.nativeElement.addEventListener('mousedown', this.mousedownResize);
    }
    this.item.nativeElement.addEventListener('mousedown', this.mouseDownItem);
    if (!this.isAreaElement) {
      this.item.nativeElement.addEventListener('keydown', this.actionKeyDown);
      this.item.nativeElement.addEventListener('keyup', this.actionKeyUp);
    }
    window.addEventListener('mousedown', this.mouseDownOutside);
    this.changeDetector.detectChanges();
  }

  /**
   * Shows context menu
   * @param data data to send to context menu
   */
  showContextMenu(data: { event: MouseEvent; options?: ContextMenuOption[]; tableData?: TableActionData }) {
    const { event, options, tableData } = data;
    event.preventDefault();
    event.stopPropagation();
    this.contextMenuChange.emit({ open: true, options, event, element: this.element, tableData });
  }

  /**
   * Closes context menu
   */
  hideContextMenu() {
    this.contextMenuChange.emit({ open: false });
  }
  /**
   * Detects the ctrl v and ctrl c keys to copy and paste keydown
   * @param event keyboard event
   * */
  actionKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Control') {
      this.pressingCtrlKey = true;
    }
    if (
      this.pressingCtrlKey &&
      event.key === 'c' &&
      this.documentDesignerComponent.canCopyDocumentElement(this.element)
    ) {
      this.documentDesignerComponent.copiedElement = this.element;
    }
    if (event.key === 'Delete' && this.documentDesignerComponent.canDeleteDocumentElement(this.element)) {
      this.documentDesignerComponent.deleteElement.emit(this.element);
    }
  };

  /**
   * Detects the ctrl v and ctrl c keys ti copy and paste keyup
   * @param event keyboard event
   * */
  actionKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Control') {
      this.pressingCtrlKey = false;
    }
  };

  /**
   * detects on mouse down item event and set other event listeners
   * @param preventItemSelected prevent item selected flag on area selection
   * @param event mouse event
   */
  mouseDownItem = (event: MouseEvent, preventItemSelected?: boolean) => {
    if (this.itemSelected && event.button === 2) {
      const options: ContextMenuOption[] = [];
      if (this.documentDesignerComponent.canCopyDocumentElement(this.element)) options.push({ option: 'Copy' });
      if (this.documentDesignerComponent.canDeleteDocumentElement(this.element)) options.push({ option: 'Delete' });
      if (this.documentDesignerComponent.copiedElement) options.push({ option: 'Paste' });
      if (options.length > 0) this.showContextMenu({ event, options });
      return;
    }
    this.hideContextMenu();
    window.addEventListener('mousemove', this.mouseMoveItem);
    window.addEventListener('mouseup', this.mouseUpItem);
    if (!preventItemSelected) {
      this.itemSelected = true;
      this.blockMoveXPosition = false;
      this.blockMoveYPosition = false;
    }
    this.prevXItem = event.clientX;
    this.prevYItem = event.clientY;
    // if is area element selects the other element are inside the area
    if (this.isAreaElement) {
      this.areaSelection();
      this.item.nativeElement.style.zIndex = '2';
      for (const element of this.elementsSelected) {
        element.mouseDownItem(event, true);
      }
    }
  };

  /**
   * updates the position of the element
   * @param event mouse event
   */
  mouseMoveItem = (event: MouseEvent) => {
    if (!this.isResizing) {
      this.isMoving = true;
      const prevXItem = this.prevXItem;
      const prevYItem = this.prevYItem;
      const rectParent = this.rectParent;
      const newX = prevXItem - (event.clientX - rectParent.left);
      const newY = prevYItem - (event.clientY - rectParent.top);

      const rect = this.rectItem;

      const left = rect.left - newX;

      const top = rect.top - newY;

      if (
        left >= 0 &&
        left + rect.width <= rectParent.width &&
        !this.blockMoveXPosition &&
        !this.type?.blockMoveXPosition
      ) {
        this.item.nativeElement.style.left = (left / rectParent.width) * 100 + '%';
        if (this.isAreaElement) {
          for (const element of this.elementsSelected) {
            element.blockMoveXPosition = false;
          }
        }
      } else {
        if (this.isAreaElement) {
          for (const element of this.elementsSelected) {
            element.blockMoveXPosition = true;
          }
        }
      }

      if (
        top >= 0 &&
        top + rect.height <= rectParent.height &&
        !this.blockMoveYPosition &&
        !this.type?.blockMoveYPosition
      ) {
        this.item.nativeElement.style.top = (top / rectParent.height) * 100 + '%';
        if (this.isAreaElement) {
          for (const element of this.elementsSelected) {
            element.blockMoveYPosition = false;
          }
        }
      } else {
        if (this.isAreaElement) {
          for (const element of this.elementsSelected) {
            element.blockMoveYPosition = true;
          }
        }
      }

      this.prevXItem = event.clientX;
      this.prevYItem = event.clientY;
    }
  };

  /**
   * Mouse down on column
   * This function adds the options to the context menu and send them to the document designer component to be shown
   * @param data data to send to context menu
   */
  mouseDownColumn(data: { event: MouseEvent; tableData: TableActionData }) {
    const { event } = data;
    const { rowIndex, columnIndex, stackIndex } = data.tableData;
    if (event.button === 2) {
      event.stopPropagation();
      //Stack validation
      if (!this.tableElement.data[rowIndex][columnIndex].stack) {
        this.tableElement.data[rowIndex][columnIndex].stack = [];
      }

      //merge options
      const options: ContextMenuOption[] = [];
      options.push(this.getTableTextOptions(data.tableData));
      options.push(this.getTableBordersOptions(data.tableData));
      options.push(this.getTableColumnOptions(data.tableData));
      options.push(this.getTableRowOptions(data.tableData));
      options.push(this.getTableOptions());

      //send them to document designer
      this.showContextMenu({ event, options, tableData: { rowIndex, columnIndex, stackIndex } });
    }
  }

  /**
   * builds and returns the text options for the context menu
   * @param tableData row index, column index, stack index
   * @returns border options for the context menu
   */
  getTableBordersOptions(tableData: TableActionData) {
    const borderOptions: ContextMenuOption = {
      option: 'Borders',
      subOptions: [
        this.getTableBorderOption(tableData, { borderType: 'borders', icon: 'all', name: 'Borders' }),
        this.getTableBorderOption(tableData, { borderType: 'borderTop', icon: 'top', name: 'Border Top' }),
        this.getTableBorderOption(tableData, { borderType: 'borderRight', icon: 'right', name: 'Border Right' }),
        this.getTableBorderOption(tableData, { borderType: 'borderBottom', icon: 'bottom', name: 'Border Bottom' }),
        this.getTableBorderOption(tableData, { borderType: 'borderLeft', icon: 'left', name: 'Border Left' }),
      ],
    };
    return borderOptions;
  }
  /**
   * builds and returns the border option for the border options array
   * @param tableData row index, column index
   * @param borderData border type, icon, name
   * @returns border option for the border options array
   */
  getTableBorderOption(
    tableData: TableActionData,
    borderData: {
      borderType: 'borders' | 'borderTop' | 'borderRight' | 'borderBottom' | 'borderLeft';
      icon: 'all' | 'top' | 'right' | 'bottom' | 'left';
      name: AllContextMenuOptions;
    }
  ) {
    const { rowIndex, columnIndex } = tableData;
    const { borderType, icon, name } = borderData;
    const borderOption: ContextMenuOption = { option: name, icon: `bx bx-border-${icon}`, iconColor: '#000000' };
    if (this.tableElement.data[rowIndex][columnIndex][borderType]) {
      borderOption.iconColor = '#000000';
    } else {
      borderOption.iconColor = '#BBB';
    }
    return borderOption;
  }

  /**
   * builds and returns the column options for the context menu
   * @param tableData row index, column index
   * @returns column options for the context menu
   */
  getTableColumnOptions(tableData: TableActionData) {
    const { rowIndex, columnIndex } = tableData;
    const columnOptions: ContextMenuOption = {
      option: 'Column',
      subOptions: [{ option: 'Add Column' }],
    };
    //column options
    if (this.tableElement.greaterColumnsNumber > 1) {
      columnOptions.subOptions?.push({ option: 'Delete Column' });
    }
    if (this.tableElement.data[rowIndex][columnIndex].colspan > 1) {
      columnOptions.subOptions?.push({ option: 'Unmerge Columns Cells' });
    }
    const colspan = this.tableElement.data[rowIndex][columnIndex].colspan;
    if (this.tableElement.data[rowIndex][columnIndex + colspan]) {
      columnOptions.subOptions?.push({ option: 'Merge Columns Cells' });
    }
    return columnOptions;
  }

  /**
   * builds and returns the row options for the context menu
   * @param tableData row index, column index
   * @returns row options for the context menu
   */
  getTableRowOptions(tableData: TableActionData) {
    const { rowIndex, columnIndex } = tableData;

    const rowOptions: ContextMenuOption = {
      option: 'Row',
      subOptions: [{ option: 'Add Row' }],
    };
    //row options
    if (this.tableElement.data.length > 1) {
      rowOptions.subOptions?.push({ option: 'Delete Row' });
    }
    if (this.tableElement.data[rowIndex][columnIndex].rowspan > 1) {
      rowOptions.subOptions?.push({ option: 'Unmerge Rows Cells' });
    }
    const rowspan = this.tableElement.data[rowIndex][columnIndex].rowspan;
    if (this.tableElement.data[rowIndex + rowspan]) {
      rowOptions.subOptions?.push({ option: 'Merge Rows Cells' });
    }
    return rowOptions;
  }

  /**
   * builds and return table options for the context menu
   * @returns table options
   */
  getTableOptions() {
    const tableOptions: ContextMenuOption = { option: 'Table', subOptions: [] };
    //table options
    if (this.documentDesignerComponent.canCopyDocumentElement(this.element)) {
      tableOptions.subOptions?.push({ option: 'Copy Table' });
    }
    if (this.documentDesignerComponent.canDeleteDocumentElement(this.element)) {
      tableOptions.subOptions?.push({ option: 'Delete Table' });
    }
    return tableOptions;
  }

  /**
   * builds and returns the text options for the context menu
   * @param tableData row index, column index, stack index
   * @returns text options for the context menu
   */
  getTableTextOptions(tableData: TableActionData) {
    const { rowIndex, columnIndex, stackIndex } = tableData;
    const textOptions: ContextMenuOption = {
      option: 'Text',
      subOptions: [{ option: 'Edit Text' }, { option: 'Add Text' }],
    };
    //text options
    if (this.tableElement.data[rowIndex][columnIndex].stack.length > 1 && (stackIndex || stackIndex === 0)) {
      textOptions.subOptions?.push({ option: 'Remove Text' });
    }
    return textOptions;
  }

  /**
   * When the mouse click is up removes event listeners and set real position of the elements
   */
  mouseUpItem = () => {
    window.removeEventListener('mousemove', this.mouseMoveItem);
    window.removeEventListener('mouseup', this.mouseUpItem);
    //Converts elements relative units to absolute units
    this.setRealPosition();
    if (this.isAreaElement) {
      this.elementsSelected = [];
      this.item.nativeElement.style.zIndex = '0';
    }
    this.isMoving = false;
  };

  /**
   * detects on mouse down event outside of element
   * @param event MouseEvent
   */
  mouseDownOutside = (event: any) => {
    if (
      this.documentDesignerComponent.containerElement.nativeElement.contains(event.target) &&
      !this.item.nativeElement.contains(event.target)
    ) {
      this.itemSelected = false;
      this.itemOverlapped = false;
      this.hideContextMenu();
      if (this.isAreaElement) {
        for (const element of this.elementsSelected) {
          element.blockMoveXPosition = false;
          element.blockMoveYPosition = false;
        }
      }
    }
  };

  /**
   * detects on mouse down event to resize element
   * @param event MouseEvent
   */
  mousedownResize = (event: any) => {
    this.isResizing = true;
    this.currentResizer = event.target;
    this.prevXResize = event.clientX;
    this.prevYResize = event.clientY;
    window.addEventListener('mousemove', this.mouseMoveResize);
    window.addEventListener('mouseup', this.mouseUpResize);
    if (this.isAreaElement) {
      for (const element of this.elementsSelected) {
        element.blockMoveXPosition = true;
        element.blockMoveYPosition = true;
      }
    }
  };

  /**
   * detects on mouse move event to resize element
   * @param event MouseEvent
   */
  mouseMoveResize = (event: any) => {
    const rect = this.rectItem;
    const rectParent = this.rectParent;
    const newX = this.prevXResize - (event.clientX - rectParent.left);
    const newY = this.prevYResize - (event.clientY - rectParent.top);
    const left = rect.left - newX;
    const top = rect.top - newY;
    if (this.currentResizer.classList.contains('se')) {
      const width = rect.width - (this.prevXResize - event.clientX);
      const height = rect.height - (this.prevYResize - event.clientY);
      if (left + width <= rectParent.width && !this.blockResizeWidth) {
        this.item.nativeElement.style.width = (width / rectParent.width) * 100 + '%';
      }
      if (top + height <= rectParent.height && !this.blockResizeHeight) {
        this.item.nativeElement.style.height = (height / rectParent.height) * 100 + '%';
      }
    } else if (this.currentResizer.classList.contains('sw')) {
      const width = rect.width + (this.prevXResize - event.clientX);
      const height = rect.height - (this.prevYResize - event.clientY);
      if (left >= 0 && !this.blockResizeWidth) {
        const newLeft = rect.left - (this.prevXResize - (event.clientX - rectParent.left));
        this.item.nativeElement.style.width = (width / rectParent.width) * 100 + '%';
        this.item.nativeElement.style.left = (newLeft / rectParent.width) * 100 + '%';
      }
      if (top + height <= rectParent.height && !this.blockResizeHeight) {
        this.item.nativeElement.style.height = (height / rectParent.height) * 100 + '%';
      }
    } else if (this.currentResizer.classList.contains('ne')) {
      const width = rect.width - (this.prevXResize - event.clientX);
      const height = rect.height + (this.prevYResize - event.clientY);
      if (left + width <= rectParent.width && !this.blockResizeWidth) {
        this.item.nativeElement.style.width = (width / rectParent.width) * 100 + '%';
      }

      if (top >= 0 && !this.blockResizeHeight) {
        const newTop = rect.top - (this.prevYResize - (event.clientY - rectParent.top));
        this.item.nativeElement.style.height = (height / rectParent.height) * 100 + '%';
        this.item.nativeElement.style.top = (newTop / rectParent.height) * 100 + '%';
      }
    } else if (this.currentResizer.classList.contains('nw')) {
      const width = rect.width + (this.prevXResize - event.clientX);
      const height = rect.height + (this.prevYResize - event.clientY);

      if (left >= 0 && !this.blockResizeWidth) {
        const newLeft = rect.left - (this.prevXResize - (event.clientX - rectParent.left));
        this.item.nativeElement.style.width = (width / rectParent.width) * 100 + '%';
        this.item.nativeElement.style.left = (newLeft / rectParent.width) * 100 + '%';
      }

      if (top >= 0 && !this.blockResizeHeight) {
        const newTop = rect.top - (this.prevYResize - (event.clientY - rectParent.top));
        this.item.nativeElement.style.height = (height / rectParent.height) * 100 + '%';
        this.item.nativeElement.style.top = (newTop / rectParent.height) * 100 + '%';
      }
    }
    if (this.isTableElement) {
      this.tableElement.setRealHeight(this.table.nativeElement);
    }
    this.prevXResize = event.clientX;
    this.prevYResize = event.clientY;
  };

  /**
   * detects on mouse up event to resize element
   */
  mouseUpResize = () => {
    window.removeEventListener('mousemove', this.mouseMoveResize);
    window.removeEventListener('mouseup', this.mouseUpResize);
    this.isResizing = false;
    this.setRealPosition();
    if (this.isTableElement) {
      this.tableElement.setRealSizes(this.table.nativeElement);
    }
    if (this.isAreaElement) {
      this.areaSelection();
    }
  };

  /**
   * Selects elements inside area element
   */
  areaSelection() {
    this.elementsSelected = [];
    this.documentDesignerComponent._documentElements.forEach((element) => {
      if (
        element.element.id !== this.element.id &&
        this.overlapping(this.item.nativeElement, element.item.nativeElement)
      ) {
        this.elementsSelected.push(element);
      }
    });
    this.item.nativeElement.style.zIndex = '0';
  }

  /**
   *
   * @param parentElement parentElement who is over
   * @param childElement childElement who is inside parentElement
   * @returns boolean
   */
  overlapping(parentElement: HTMLElement, childElement: HTMLElement) {
    const rect1 = parentElement.getBoundingClientRect();
    const rect2 = childElement.getBoundingClientRect();

    return (
      ((rect2.top >= rect1.top && rect2.top <= rect1.bottom) ||
        (rect2.bottom >= rect1.top && rect2.bottom <= rect1.bottom)) &&
      ((rect2.left >= rect1.left && rect2.left <= rect1.right) ||
        (rect2.right >= rect1.left && rect2.right <= rect1.right))
    );
  }

  /**
   * detects when element text being writted and sets new value
   * @param event event object
   */
  elementTextChange(event: any) {
    if (this.element instanceof TextElement) {
      this.element.text = event.target.innerText;
    }
  }

  /**
   * detects when is being writted in column table and sets new value
   * @param event event object
   * @param column column object
   */
  tableTextChange(event: any, column: any) {
    if (event.target.innerText.length > 30) {
      event.target.innerText = column.text;
      return;
    }
    if (this.isTableElement) {
      column.text = event.target.innerText;
    }
  }

  /**
   *
   * @param value value to convert to units
   * @returns string
   */
  transformValueInUnits(value: number): string {
    return this.units === 'mm' ? (value * 0.264583).toFixed(2) + this.units : Number(value.toFixed(2)) + this.units;
  }

  /**
   *
   * @param value value to convert to units
   * @returns number
   */
  transformValueInUnitsNumber(value: number): number {
    return this.units === 'mm' ? Number((value * 0.264583).toFixed(2)) : Number(value.toFixed(2));
  }

  /**
   * Sets the real position of the element
   */
  setRealPosition() {
    if (this.item.nativeElement) {
      const top = this.transformValueInUnitsNumber(parseFloat(window.getComputedStyle(this.item.nativeElement).top));
      const left = this.transformValueInUnitsNumber(parseFloat(window.getComputedStyle(this.item.nativeElement).left));
      const width = this.transformValueInUnitsNumber(
        parseFloat(window.getComputedStyle(this.item.nativeElement).width)
      );
      const height = this.transformValueInUnitsNumber(
        parseFloat(window.getComputedStyle(this.item.nativeElement).height)
      );

      this.element.setCoords({ x: left, y: top });
      this.element.setSize({ width: width, height: height });
    }
  }

  /**
   * On destroy component
   */
  ngOnDestroy(): void {
    window.removeEventListener('mousedown', this.mouseDownOutside);
  }
}
