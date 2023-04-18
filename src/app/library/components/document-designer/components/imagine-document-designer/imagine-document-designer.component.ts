import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { DocumentElement } from '../../classes/document-element.class';
import { CellText, TableCell, TableElement } from '../../classes/table-element.class';
import { ContextMenuOption } from '../../interfaces/context-menu.interface';
import { DocumentElementType } from '../../interfaces/document-element-type.interface';
import { TableActionData } from '../../interfaces/table-action-data.interface';
import { DocumentDesignerWarning } from '../../types/document-designer-warning.type';
import { ImagineDocumentElementComponent } from '../imagine-document-element/imagine-document-element.component';

@Component({
  selector: 'imagine-document-designer',
  templateUrl: './imagine-document-designer.component.html',
  styleUrls: ['./imagine-document-designer.component.scss'],
})
export class ImagineDocumentDesignerComponent implements AfterViewInit {
  /**access ui elements */
  @ViewChild('container') containerElement!: ElementRef<HTMLDivElement>;
  @ViewChild('mainContainer') mainContainerElement!: ElementRef<HTMLDivElement>;
  @ViewChild('wrapper') wrapperElement!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollTop') scrollTopElement!: ElementRef<HTMLDivElement>;
  @ViewChildren(ImagineDocumentElementComponent) _documentElements!: QueryList<ImagineDocumentElementComponent>;

  /**Access context menu */
  @ViewChild('contextMenu') contextMenu!: ElementRef<HTMLDivElement>;

  /**Emits when element its created */
  @Output() elementsUpdated = new EventEmitter();
  /**Emits when element its created */
  @Output() deleteElement = new EventEmitter();
  /**Emits when we want to edit a table column */
  @Output() editTableText = new EventEmitter<TableCell | CellText>();
  /**Emits when we want to delete a table column */
  @Output() deleteTableCell = new EventEmitter<{ rowIndex: number; columnIndex: number; tableId: string }>();
  /**Emits when we want to delete a table column */
  @Output() deleteTableColumn = new EventEmitter<{ columnIndex: number; tableId: string }>();
  /**Emits when we want to delete a table row */
  @Output() deleteTableRow = new EventEmitter<{ rowIndex: number; tableId: string }>();
  /**Emits when we want to delete a table row */
  @Output() deleteStack = new EventEmitter<{
    columnIndex: number;
    rowIndex: number;
    stackIndex: number;
    tableId: string;
  }>();
  /**Emits when we cant copy */
  @Output() warning = new EventEmitter<{
    warning: DocumentDesignerWarning;
    elementData: { elementType: DocumentElementType };
  }>();

  /**Drag an drop elements */
  @Input() elements: DocumentElement[] = [];
  @Input() selectors: HTMLDivElement[] = [];
  @Input() page = 1;

  /**units allowed */
  @Input() units: 'px' | 'mm' = 'px';
  /**types allowed */
  @Input() types: DocumentElementType[] = [];
  /**background for designer */
  @Input() background = '';

  /**Container size */
  width = '';
  height = '';
  /**Ruler groups */
  rulerGroupsX = 0;
  rulerGroupsY = 0;

  /**Prev x position of resize */
  prevXSelection: any;
  /**Prev y position of resize */
  prevYSelection: any;

  /**Tells which element is copied */
  copiedElement!: DocumentElement;
  /**Tells which element is going to be copied or delete */
  selectedElement!: DocumentElement;
  /**Tells which element is going to be copied or delete */
  currentTableData!: TableActionData;

  /**pressing control key to copy and paste */
  pressingCtrlKey = false;
  /**pressing control key to copy and paste */
  contextMenuOptions: ContextMenuOption[] = [];

  /**stores selection container */
  selectionContainer!: HTMLDivElement | null;
  /**prev coordinates of mouse selection */
  prevXSelectionContainer: any;
  prevYSelectionContainer: any;
  /**elements selected to be moved */
  elementsSelected: ImagineDocumentElementComponent[] = [];
  /**zoom percentage */
  zoom = 1;

  /**
   * background image
   */
  get backgroundImage() {
    return this.background ? `rgba(255, 255, 255, 0.5) url('${this.background}')` : 'white';
  }

  /**
   * returns the ruler height
   */
  get rulerHeight() {
    return parseFloat(this.height) + 7.9375 + 'mm';
  }

  /**
   * returns the ruler width
   */
  get rulerWidth() {
    return parseFloat(this.width) + 7.9375 + 'mm';
  }

  /**
   * returns the zoom value
   */
  get zoomValue() {
    return (this.zoom * 100).toFixed(0) + '%';
  }

  /**
   * after view init
   */
  ngAfterViewInit(): void {
    this.containerElement.nativeElement.addEventListener('mousedown', this.startSelection);
    this.wrapperElement.nativeElement.style.height = this.height;
    this.containerElement.nativeElement.addEventListener('keydown', this.pasteKeyDown);
    this.containerElement.nativeElement.addEventListener(
      'contextmenu',
      function (e: any) {
        // do something here...
        e.preventDefault();
      },
      false
    );
  }

  /**
   * starts elements selection
   * @param event mouse event
   */
  startSelection = (event: MouseEvent) => {
    if (event.button === 2) {
      if (this.copiedElement) {
        this.contextMenuOptions = [{ option: 'Paste' }];
        this.showContextMenu(event);
      }
      return;
    }
    this.hideContextMenu();
    const itemSelected = this._documentElements.toArray().some((element) => element.itemSelected);
    if (itemSelected) {
      return;
    }
    window.addEventListener('mouseup', this.endSelection);
    if (this.selectionContainer) {
      this.selectionContainer.remove();
      this.selectionContainer = null;
    }
    const x = event.clientX - this.containerElement.nativeElement.getBoundingClientRect().x;
    const y = event.clientY - this.containerElement.nativeElement.getBoundingClientRect().y;
    this.prevXSelection = event.clientX;
    this.prevYSelection = event.clientY;
    this.selectionContainer = document.createElement('div');
    this.selectionContainer.style.position = 'absolute';
    this.selectionContainer.style.width = '0px';
    this.selectionContainer.style.height = '0px';
    this.selectionContainer.style.background = 'tranparent';
    this.selectionContainer.style.border = '1px dashed var(--app-primary-color)';
    this.selectionContainer.classList.toggle('no-select');
    const rectParent = this.containerElement.nativeElement.getBoundingClientRect();
    this.selectionContainer.style.top =
      ((y - parseInt(this.selectionContainer.style.height)) / rectParent.height) * 100 + '%';
    this.selectionContainer.style.left =
      ((x - parseInt(this.selectionContainer.style.width)) / rectParent.width) * 100 + '%';
    this.containerElement.nativeElement.appendChild(this.selectionContainer);
    window.addEventListener('mousemove', this.moveSelection);
  };

  /**
   * move elements selected
   * @param event mouse event
   */
  moveSelection = (event: MouseEvent) => {
    if (this.selectionContainer) {
      const rect = this.selectionContainer.getBoundingClientRect();
      const rectParent = this.containerElement.nativeElement.getBoundingClientRect();
      const newX = this.prevXSelection - (event.clientX - rectParent.left);
      const newY = this.prevYSelection - (event.clientY - rectParent.top);
      const left = rect.left - newX;
      const top = rect.top - newY;

      const width = event.clientX - this.prevXSelection + rect.width;
      const height = event.clientY - this.prevYSelection + rect.height;
      if (left + width <= rectParent.width) {
        this.selectionContainer.style.width = (width / rectParent.width) * 100 + '%';
      }
      if (top + height <= rectParent.height) {
        this.selectionContainer.style.height = (height / rectParent.height) * 100 + '%';
      }
      this.prevXSelection = event.clientX;
      this.prevYSelection = event.clientY;
    }
  };

  /**
   * ends elements selection
   */
  endSelection = () => {
    if (this.selectionContainer) {
      this.elementsSelected = [];
      this._documentElements.forEach((element) => {
        if (this.overlapping(this.selectionContainer, element.item.nativeElement)) {
          this.elementsSelected.push(element);
          element.itemOverlapped = true;
        }
      });
      if (this.elementsSelected.length === 0) {
        this.selectionContainer.remove();
        this.selectionContainer = null;
      } else {
        this.selectionContainer.style.cursor = 'move';
        this.selectionContainer.addEventListener('mousedown', this.mouseDownSelection);
        this.setSelectionRealPosition();
        window.addEventListener('mousedown', this.mouseDownOutsideSelection);
      }
    }
    window.removeEventListener('mousemove', this.moveSelection);
    window.removeEventListener('mouseup', this.endSelection);
  };

  /**
   * mouse down selection
   * @param event mouse event
   */
  mouseDownSelection = (event: MouseEvent) => {
    event.stopPropagation();
    this.prevXSelectionContainer = event.clientX;
    this.prevYSelectionContainer = event.clientY;
    window.addEventListener('mousemove', this.mouseMoveSelectionContainer);
    window.addEventListener('mouseup', this.mouseUpSelectionContainer);
    for (const element of this.elementsSelected) {
      element.mouseDownItem(event, true);
    }
  };

  /**
   * mouse move selection container event
   * @param event mouse event
   */
  mouseMoveSelectionContainer = (event: MouseEvent) => {
    if (this.selectionContainer) {
      const prevXSelectionContainer = this.prevXSelectionContainer;
      const prevYSelectionContainer = this.prevYSelectionContainer;
      const rect = this.selectionContainer.getBoundingClientRect();
      const rectParent = this.containerElement.nativeElement.getBoundingClientRect();
      const newX = prevXSelectionContainer - (event.clientX - rectParent.left);
      const newY = prevYSelectionContainer - (event.clientY - rectParent.top);

      const left = rect.left - newX;
      const top = rect.top - newY;

      if (left >= 0 && left + rect.width <= rectParent.width) {
        this.selectionContainer.style.left = (left / rectParent.width) * 100 + '%';
        for (const element of this.elementsSelected) {
          element.blockMoveXPosition = false;
        }
      } else {
        for (const element of this.elementsSelected) {
          element.blockMoveXPosition = true;
        }
      }
      if (top >= 0 && top + rect.height <= rectParent.height) {
        this.selectionContainer.style.top = (top / rectParent.height) * 100 + '%';
        for (const element of this.elementsSelected) {
          element.blockMoveYPosition = false;
        }
      } else {
        for (const element of this.elementsSelected) {
          element.blockMoveYPosition = true;
        }
      }

      this.prevXSelectionContainer = event.clientX;
      this.prevYSelectionContainer = event.clientY;
    }
  };
  /**
   * mouse up selection container event
   * @param event mouse event
   */
  mouseUpSelectionContainer = () => {
    window.removeEventListener('mousemove', this.mouseMoveSelectionContainer);
    window.removeEventListener('mouseup', this.mouseUpSelectionContainer);
    for (const element of this.elementsSelected) {
      element.mouseUpItem();
    }
    this.setSelectionRealPosition();
  };

  /**
   * mouse out selection container event
   * @param event mouse event
   */
  mouseDownOutsideSelection = (event: any) => {
    if (
      this.containerElement.nativeElement.contains(event.target) &&
      this.selectionContainer &&
      !this.selectionContainer.contains(event.target)
    ) {
      for (const element of this.elementsSelected) {
        element.blockMoveXPosition = false;
        element.blockMoveYPosition = false;
        element.itemOverlapped = false;
      }
      this.elementsSelected = [];
      this.setSelectionRealPosition();
      this.selectionContainer.removeEventListener('mousedown', this.mouseDownSelection);
      this.selectionContainer.remove();
      this.selectionContainer = null;
      window.removeEventListener('mousedown', this.mouseDownOutsideSelection);
    }
  };

  /**
   * checks if overlapping selection
   * @param el1 element 1 to be checked
   * @param el2 element 2 to be checked
   * @returns boolean
   */
  overlapping(el1: any, el2: any) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right
    );
  }

  /**
   * sets paper size
   * @param width width of the paper
   * @param height height of the paper
   */
  setPaperSize(width: string, height: string) {
    for (const element of this.elements) {
      if (element.x + element.width > parseFloat(width)) {
        const newPosition = element.x + (parseFloat(width) - parseFloat(this.width));
        if (newPosition >= 0) {
          element.setCoords({ x: newPosition });
        } else {
          element.setCoords({ x: 0 });
          element.setSize({ width: parseFloat(width) });
        }
      }

      if (element.y + element.height > parseFloat(height)) {
        const newPosition = element.y + (parseFloat(height) - parseFloat(this.height));
        if (newPosition >= 0) {
          element.setCoords({ y: newPosition });
        } else {
          element.setCoords({ y: 0 });
          element.setSize({ height: parseFloat(height) });
        }
      }
    }
    this.width = width;
    this.height = height;
    this.rulerGroupsX = Math.floor(parseInt(width) / 9);
    this.rulerGroupsY = Math.floor(parseInt(height) / 9);
  }

  /**
   * transform pixel values to mm and fixed value
   * @param value number of pixels
   * @returns string with pixel values transformed into units
   */
  transformValueInUnits(value: number): string {
    return this.units === 'mm' ? (value * 0.264583).toFixed(2) + this.units : Number(value.toFixed(2)) + this.units;
  }

  /**
   * transform pixel values to mm and fixed value
   * @param value number of pixels
   * @returns number with pixel values transformed into units
   */
  transformValueInUnitsNumber(value: number): number {
    return this.units === 'mm' ? Number((value * 0.264583).toFixed(2)) : Number(value.toFixed(2));
  }

  /**
   * substract document zoom
   */
  substractZoom() {
    if (this.zoom > 0.5) {
      this.zoom -= 0.1;
      this.setZoom();
    }
  }

  /**
   * add document zoom
   */
  addZoom() {
    if (this.zoom < 1.5) {
      this.zoom += 0.1;
      this.setZoom();
    }
  }

  /**
   * sets document zoom
   */
  setZoom() {
    this.wrapperElement.nativeElement.style.transform = `scale(${this.zoom})`;
    this.wrapperElement.nativeElement.style.height = `${parseInt(this.height) * this.zoom}px`;
  }

  /**
   * sets selection real position
   */
  setSelectionRealPosition() {
    if (this.selectionContainer) {
      this.selectionContainer.style.top = window.getComputedStyle(this.selectionContainer).top;
      this.selectionContainer.style.left = window.getComputedStyle(this.selectionContainer).left;
      this.selectionContainer.style.width = window.getComputedStyle(this.selectionContainer).width;
      this.selectionContainer.style.height = window.getComputedStyle(this.selectionContainer).height;
    }
  }

  /**creates a new element depending on type */
  createElement(elementData: any, elementType: string): DocumentElement | null {
    const type = this.types.find((t) => t.type === elementType);
    return type ? new type.class(elementData) : null;
  }

  /**
   * Detects the ctrl v and ctrl c keys ti copy and paste keydown
   * @param event keyboard event
   * */
  pasteKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Control') {
      this.pressingCtrlKey = true;
    }
    if (this.pressingCtrlKey && event.key === 'v') {
      this.pasteElement();
    }
  };

  /**
   *
   * @param event mouse event
   * @param option option to be checked if is selected
   */
  actionFromContextMenu(event: MouseEvent, option: ContextMenuOption) {
    event.stopPropagation();
    const action = option.option;
    let tableElement: TableElement | null;

    if (this.selectedElement instanceof TableElement) tableElement = this.selectedElement;
    else tableElement = null;

    const { rowIndex, columnIndex, stackIndex } = this.currentTableData || {};
    switch (action) {
      case 'Paste':
        this.pasteElement(event);
        break;
      case 'Delete':
      case 'Delete Table':
        this.deleteDocumentElement(this.selectedElement);
        break;
      case 'Copy':
      case 'Copy Table':
        this.copyDocumentElement(this.selectedElement);
        break;
      case 'Add Row':
        if (tableElement) {
          tableElement.addRow({ rowIndex, columnIndex });
        }
        break;
      case 'Delete Row':
        if (tableElement) {
          this.deleteTableRow.emit({ rowIndex: rowIndex, tableId: tableElement.id });
        }
        break;
      case 'Add Cell':
        if (tableElement) {
          tableElement.addCell({ rowIndex, columnIndex });
        }
        break;
      case 'Delete Cell':
        if (tableElement) {
          this.deleteTableCell.emit({
            rowIndex,
            columnIndex,
            tableId: tableElement.id,
          });
        }
        break;
      case 'Add Text':
        if (tableElement) {
          tableElement.addCellStack({ rowIndex, columnIndex, stackIndex });
        }
        break;
      case 'Remove Text':
        if (tableElement) {
          this.deleteStack.emit({ rowIndex, columnIndex, stackIndex, tableId: tableElement.id });
        }
        break;
      case 'Edit Text':
        if (tableElement) {
          if (stackIndex?.toString()) {
            if (stackIndex === -1) {
              this.editTableText.emit(tableElement.data[rowIndex][columnIndex]);
            } else {
              this.editTableText.emit(tableElement.data[rowIndex][columnIndex].stack[stackIndex]);
            }
          }
        }
        break;
      case 'Delete Column':
        if (tableElement) {
          this.deleteTableColumn.emit({
            columnIndex,
            tableId: tableElement.id,
          });
        }
        break;
      case 'Add Column':
        if (tableElement) {
          tableElement.addColumn({ rowIndex, columnIndex });
        }
        break;
      case 'Merge Columns Cells':
        if (tableElement) {
          tableElement.addColSpan({ rowIndex, columnIndex });
        }
        break;
      case 'Unmerge Columns Cells':
        if (tableElement) {
          tableElement.removeColSpan({ rowIndex, columnIndex });
        }
        break;
      case 'Merge Rows Cells':
        if (tableElement) {
          tableElement.addRowSpan({ rowIndex, columnIndex });
        }
        break;
      case 'Unmerge Rows Cells':
        if (tableElement) {
          tableElement.removeRowSpan({ rowIndex, columnIndex });
        }
        break;
      case 'Borders':
        if (tableElement) {
          tableElement.setBorders({ rowIndex, columnIndex, borderType: 'borders' });
        }
        break;
      case 'Border Top':
        if (tableElement) {
          tableElement.setBorders({ rowIndex, columnIndex, borderType: 'borderTop' });
          option.iconColor = option.iconColor === '#000000' ? '#BBB' : '#000000';
        }
        break;
      case 'Border Bottom':
        if (tableElement) {
          tableElement.setBorders({ rowIndex, columnIndex, borderType: 'borderBottom' });
          option.iconColor = option.iconColor === '#000000' ? '#BBB' : '#000000';
        }
        break;
      case 'Border Left':
        if (tableElement) {
          tableElement.setBorders({ rowIndex, columnIndex, borderType: 'borderLeft' });
          option.iconColor = option.iconColor === '#000000' ? '#BBB' : '#000000';
        }
        break;
      case 'Border Right':
        if (tableElement) {
          tableElement.setBorders({ rowIndex, columnIndex, borderType: 'borderRight' });
          option.iconColor = option.iconColor === '#000000' ? '#BBB' : '#000000';
        }
        break;
    }
    this.contextMenu.nativeElement.style.display = 'none';
  }

  /**
   * clears object deep array and objects references
   * @param object object to clear references
   * @returns new object
   */
  clearObjectReferences(object: any) {
    object = { ...object };
    Object.keys(object).forEach((key) => {
      if (object[key] !== undefined && object[key] !== null) {
        if (typeof object[key] === 'object') {
          if (Array.isArray(object[key])) {
            object[key] = this.clearArrayReferences(object[key]);
          } else {
            object[key] = this.clearObjectReferences(object[key]);
          }
        }
      }
    });
    return object;
  }

  /**
   * clears array deep array and objects references
   * @param array object to clear references
   * @returns new array
   */
  clearArrayReferences(array: any[]) {
    array = [...array];
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== undefined && array[i] !== null) {
        if (typeof array[i] === 'object') {
          if (Array.isArray(array[i])) {
            array[i] = this.clearArrayReferences(array[i]);
          } else {
            array[i] = this.clearObjectReferences(array[i]);
          }
        }
      }
    }
    return array;
  }

  /**Paste an element from clipboard*/
  pasteElement(event?: MouseEvent) {
    if (this.copiedElement) {
      const copiedElement = { ...this.copiedElement };
      delete copiedElement.documentElementComponent;
      const clone = this.createElement(this.clearObjectReferences(copiedElement), this.copiedElement.type);
      if (clone) {
        clone.name = clone.name.slice(0, 15) + '_copy';
        if (event) {
          clone.x = 0;
          clone.y = this.transformValueInUnitsNumber(event.clientY - this.rectItem.y);
        }
        this.elements.push(clone);
      }
      this.elementsUpdated.emit();
    }
  }

  /**
   * deletes the element from the document
   * @param documentElement element to delete
   */
  deleteDocumentElement(documentElement: DocumentElement) {
    if (this.canDeleteDocumentElement(documentElement)) {
      this.deleteElement.emit(documentElement);
    }
  }

  /**
   * checks if element can be deleted
   * @param documentElement element to be deleted
   * @returns boolean
   */
  canDeleteDocumentElement(documentElement: DocumentElement): boolean {
    return !this.types.some((elementType) => elementType.type === documentElement.type && elementType.disableDelete);
  }

  /**
   * copy element selected
   * @param documentElement element to be copied
   */
  copyDocumentElement(documentElement: DocumentElement) {
    if (this.canCopyDocumentElement(documentElement)) {
      this.copiedElement = this.selectedElement;
    }
  }

  /**
   * checks if element can be copied
   * @param documentElement element to be copied
   * @returns boolean
   */
  canCopyDocumentElement(documentElement: DocumentElement): boolean {
    let canCopy = true;
    const elementType = this.types.find((elementType) => elementType.type === documentElement.type);
    if (elementType) {
      if (elementType.allowedInstances) {
        const instaces = this.elements.filter((element) => element.type === elementType.type);
        if (instaces.length >= elementType.allowedInstances) {
          this.warning.emit({ warning: 'instanceLimit', elementData: { elementType: elementType } });
          canCopy = false;
        }
      }
      if (elementType.disableCopy) {
        canCopy = false;
      }
    } else {
      canCopy = false;
    }
    return canCopy;
  }

  /**
   * Context menu change
   * @param data data
   */
  contextMenuChange(data: {
    open: boolean;
    options?: ContextMenuOption[];
    event: MouseEvent;
    element?: DocumentElement;
    tableData?: TableActionData;
  }) {
    const { open, options, event, element, tableData } = data;
    if (open) {
      if (options) this.contextMenuOptions = options;
      if (element) this.selectedElement = element;
      if (tableData) this.currentTableData = tableData;
      this.showContextMenu(event);
    } else {
      this.hideContextMenu();
    }
  }

  /**
   * Shows context menu
   * @param event mouse event
   */
  showContextMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenu.nativeElement.style.display = 'initial';
    this.contextMenu.nativeElement.style.top = event.clientY - this.rectItem.top + 'px';
    this.contextMenu.nativeElement.style.left = event.clientX - this.rectItem.left + 'px';
  }

  /**
   * Closes context menu
   */
  hideContextMenu() {
    this.contextMenu.nativeElement.style.display = 'none';
    this.contextMenu.nativeElement.style.top = 'none';
    this.contextMenu.nativeElement.style.left = 'none';
  }

  /**Returns the item position*/
  get rectItem() {
    return this.containerElement.nativeElement.getBoundingClientRect();
  }
}
