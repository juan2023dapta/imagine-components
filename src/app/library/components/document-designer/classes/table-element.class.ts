import { DocumentTextVariable } from '../interfaces/document-text-variable.interface';
import { DocumentElement, IDocumentELement } from './document-element.class';

export class TableElement extends DocumentElement {
  /**table rows and columns */
  data: TableCell[][] = [];
  /**
   *
   * @param elementData element data to be setted
   */
  constructor(elementData: ITableElement) {
    super(elementData);
    this.data = elementData.data || [];
    this.type = 'table';
    this.width = elementData.width || 200;
    this.height = elementData.height || 20;
    this.x = elementData.x || 10;
    if (this.data.length === 0) {
      this.addRow({});
      this.addCell({ rowIndex: 0 });
      this.addCell({ rowIndex: 0 });
      this.addRow({ rowIndex: 0, columnIndex: 0 });
    } else {
      this.setResizable();
    }
  }

  /**
   * creates new cell
   */
  get newCell(): TableCell {
    return {
      width: 10,
      height: 10,
      borders: true,
      borderTop: true,
      borderRight: true,
      borderBottom: true,
      borderLeft: true,
      colspan: 1,
      rowspan: 1,
      stack: [],
      ...this.newCellText,
      lineHeight: 0,
    };
  }

  /**
   * creates new cell text
   */
  get newCellText(): CellText {
    return {
      type: 'text',
      text: 'Type Here',
      color: '#000000',
      bold: false,
      italics: false,
      fontSize: 3.5,
      decoration: 'none',
      decorationStyle: 'none',
      alignment: 'center',
      characterSpacing: 0,
      lineHeight: 6,
      fontFamily: 'Arial',
      dateFormat: 'MM-DD-YYYY',
    };
  }

  /**
   * get greater columns value
   */
  get greaterColumnsNumber() {
    let greaterValue = 0;
    for (const row of this.data) {
      if (row.length > greaterValue) {
        greaterValue = row.length;
      }
    }
    return greaterValue;
  }

  /**
   * sets element coords on check
   * @param size contains the corresponding dimensions of the element
   */
  override setSize(size: { width?: number | undefined; height?: number | undefined }): void {
    const { width, height } = size;
    if (width && this.documentElementComponent?.item.nativeElement) {
      this.width = Number(Number(width).toFixed(2));
      this.documentElementComponent.item.nativeElement.style.width = width + this.units;
    }
    if (height && this.documentElementComponent?.item.nativeElement) {
      this.height = Number(Number(height).toFixed(2));
      this.documentElementComponent.item.nativeElement.style.height = height + this.units;
    }
  }

  /**
   * add row to the table
   * @param data contains the index of the row and column to add row
   */
  addRow(data: { rowIndex?: number; columnIndex?: number }) {
    const { rowIndex, columnIndex } = data;
    if (rowIndex?.toString() && columnIndex?.toString()) {
      const newColumns = [];
      for (let i = 0; i < this.greaterColumnsNumber; i++) {
        newColumns.push(this.newCell);
      }
      this.data.splice(rowIndex + this.data[rowIndex][columnIndex].rowspan, 0, newColumns);
    } else {
      this.data.push([this.newCell]);
    }
    this.setSize({ height: this.height + 10 });
    setTimeout(() => {
      this.setRealSizes(this.documentElementComponent?.table.nativeElement);
    }, 0);
    this.setResizable();
  }

  /**
   * method that deletes row
   * @param index row index to be deleted
   */
  deleteRow(index: number) {
    this.data.splice(index, 1);
    setTimeout(() => {
      this.setRealSizes(this.documentElementComponent?.table.nativeElement);
    }, 0);
    this.setResizable();
  }

  /**
   * add new cell to the table
   * @param data contains the index of the row and column to add cell
   */
  addCell(data: { rowIndex: number; columnIndex?: number }) {
    const { rowIndex, columnIndex } = data;
    const newColumn: TableCell = this.newCell;
    if (columnIndex && this.data[rowIndex][columnIndex]) {
      this.data[rowIndex].splice(columnIndex + this.data[rowIndex][columnIndex].colspan, 0, newColumn);
    } else {
      this.data[rowIndex].push(newColumn);
    }
    setTimeout(() => {
      this.setRealSizes(this.documentElementComponent?.table.nativeElement);
    }, 0);
    this.setResizable();
  }
  /**
   * delete cell
   * @param data contains the index of the row and column to delete cell
   */
  deleteCell(data: { rowIndex: number; columnIndex: number }): void {
    const { rowIndex, columnIndex } = data;
    this.data[rowIndex].splice(columnIndex, 1);
    setTimeout(() => {
      this.setRealSizes(this.documentElementComponent?.table.nativeElement);
    }, 0);
    this.setResizable();
  }
  /**
   * add column to table
   * @param data contains the index of the row and column to add column
   */
  addColumn(data: { rowIndex: number; columnIndex?: number }) {
    const { rowIndex, columnIndex } = data;
    const newColumn: TableCell = this.newCell;
    if (columnIndex && this.data[rowIndex][columnIndex]) {
      this.data.forEach((row) => {
        row.splice(columnIndex + this.data[rowIndex][columnIndex].colspan, 0, { ...newColumn });
      });
    } else {
      this.data.forEach((row) => {
        row.push({ ...newColumn });
      });
    }
    setTimeout(() => {
      this.setRealSizes(this.documentElementComponent?.table.nativeElement);
    }, 0);
    this.setResizable();
  }
  /**
   * delete column
   * @param data contains the index of the column to delete
   */
  deleteColumn(data: { columnIndex: number }): void {
    const { columnIndex } = data;
    this.data.forEach((row) => {
      row.splice(columnIndex, 1);
    });
    setTimeout(() => {
      this.setRealSizes(this.documentElementComponent?.table.nativeElement);
    }, 0);
    this.setResizable();
  }
  /**
   * add colspan to cell
   * @param data contains the index of the row and column to add colspan
   */
  addColSpan(data: { rowIndex: number; columnIndex: number }) {
    const { rowIndex, columnIndex } = data;
    const colSpan = this.data[rowIndex][columnIndex].colspan;
    this.data[rowIndex][columnIndex + colSpan].hidden = true;
    this.data[rowIndex][columnIndex].colspan++;
    setTimeout(() => {
      this.setRealSizes(this.documentElementComponent?.table.nativeElement);
    }, 0);
  }
  /**
   * remove colspan of cell
   * @param data contains the index of the row and column to remove colspan
   */
  removeColSpan(data: { rowIndex: number; columnIndex: number }) {
    const { rowIndex, columnIndex } = data;
    this.data[rowIndex][columnIndex].colspan--;
    const colspan = this.data[rowIndex][columnIndex].colspan;
    this.data[rowIndex][columnIndex + colspan].hidden = false;
    setTimeout(() => {
      this.setRealSizes(this.documentElementComponent?.table.nativeElement);
    }, 0);
  }
  /**
   * add rowspan to cell
   * @param data contains the index of the row and column to add rowspan
   */
  addRowSpan(data: { rowIndex: number; columnIndex: number }) {
    const { rowIndex, columnIndex } = data;
    const rowspan = this.data[rowIndex][columnIndex].rowspan;
    this.data[rowIndex + rowspan][columnIndex].hidden = true;
    this.data[rowIndex][columnIndex].rowspan++;
    setTimeout(() => {
      this.setRealSizes(this.documentElementComponent?.table.nativeElement);
    }, 0);
  }
  /**
   * remove rowspan of cell
   * @param data contains the index of the row and column to remove rowspan
   */
  removeRowSpan(data: { rowIndex: number; columnIndex: number }) {
    const { rowIndex, columnIndex } = data;
    this.data[rowIndex][columnIndex].rowspan--;
    const rowspan = this.data[rowIndex][columnIndex].rowspan;
    this.data[rowIndex + rowspan][columnIndex].hidden = false;
    setTimeout(() => {
      this.setRealSizes(this.documentElementComponent?.table.nativeElement);
    }, 0);
  }
  /**
   * add cell stack to cell
   * @param data contains the index of the stack, row and column to add stack
   */
  addCellStack(data: { rowIndex: number; columnIndex: number; stackIndex: number }) {
    const { rowIndex, columnIndex, stackIndex } = data;
    if (!this.data[rowIndex][columnIndex].stack) {
      this.data[rowIndex][columnIndex].stack = [];
    }
    if (stackIndex > -1) {
      this.data[rowIndex][columnIndex].stack.splice(stackIndex, 0, this.newCellText);
    } else {
      if (!this.data[rowIndex][columnIndex].stack.length) {
        this.data[rowIndex][columnIndex].stack.push(this.cellToText(this.data[rowIndex][columnIndex]));
        this.clearCell(this.data[rowIndex][columnIndex]);
        this.data[rowIndex][columnIndex].stack.push(this.newCellText);
      } else {
        this.data[rowIndex][columnIndex].stack.push(this.newCellText);
      }
    }
  }
  /**
   * remove cell stack of cell
   * @param data contains the index of the stack, row and column to remove stack
   */
  removeCellStack(data: { rowIndex: number; columnIndex: number; stackIndex: number }) {
    const { rowIndex, columnIndex, stackIndex } = data;
    this.data[rowIndex][columnIndex].stack.splice(stackIndex, 1);
    if (this.data[rowIndex][columnIndex].stack.length === 1) {
      this.data[rowIndex][columnIndex] = this.textToCell(
        this.data[rowIndex][columnIndex].stack[0],
        this.data[rowIndex][columnIndex]
      );
      this.data[rowIndex][columnIndex].stack = [];
    }
  }

  /**
   * converts the cell to stack and then add new text stacks
   * @param cell cell to convert
   * @returns text stack
   */
  cellToText(cell: TableCell) {
    const text: any = { ...cell };
    delete text.width;
    delete text.height;
    delete text.borders;
    delete text.colspan;
    delete text.rowspan;
    delete text.stack;
    text.lineHeight = 6;
    return text;
  }

  /**
   * converts the stack to cell and then let just one text
   * @param text stack to convert to cell
   * @param cell data to combine
   * @returns cell
   */
  textToCell(text: CellText, cell: TableCell) {
    return {
      ...cell,
      ...text,
      lineHeight: 0,
    };
  }

  /**
   * clears redundat cell attributes when stack is added
   * @param cell to be cleared
   */
  clearCell(cell: TableCell) {
    delete cell.type;
    delete cell.text;
    delete cell.color;
    delete cell.bold;
    delete cell.italics;
    delete cell.fontSize;
    delete cell.decoration;
    delete cell.decorationStyle;
    delete cell.alignment;
    delete cell.characterSpacing;
    delete cell.lineHeight;
  }

  /**
   * sets table real height
   * @param table native table
   */
  setRealHeight(table: HTMLTableElement | undefined) {
    if (table) {
      table.querySelectorAll('tr').forEach((tr) => {
        const tableHeight = window.getComputedStyle(table).height;
        const rowHeight = window.getComputedStyle(tr).height;
        tr.style.height = (parseFloat(rowHeight) / parseFloat(tableHeight)) * 100 + '%';
      });
    }
  }

  /**
   * sets table real sizes on pixels
   * @param table native table element
   */
  setRealSizes(table: HTMLDivElement | undefined) {
    if (table) {
      const hiddenRow = table.querySelector('#hidden-row');
      if (hiddenRow) {
        table.querySelectorAll('tr').forEach((tr, trIndex) => {
          hiddenRow.querySelectorAll('th').forEach((th, thIndex) => {
            const realWidth = window.getComputedStyle(th).width;
            const realHeight = window.getComputedStyle(tr).height;
            if (this.documentElementComponent) {
              this.data[trIndex][thIndex].width = this.documentElementComponent.transformValueInUnitsNumber(
                parseFloat(realWidth)
              );
              this.data[trIndex][thIndex].height = this.documentElementComponent.transformValueInUnitsNumber(
                parseFloat(realHeight)
              );
            }
          });
        });
      }
    }
  }

  /**
   * enables the resizers on table
   */
  setResizable() {
    setTimeout(() => {
      this.documentElementComponent?.cellResizers.forEach((cellResizer) => cellResizer.setResizable());
    }, 0);
  }

  /**
   * sets cell text
   * @param data cell data to be setted
   */
  setCellText(data: { text: string; cell: CellText; textVariables: DocumentTextVariable[] }) {
    const { cell, text, textVariables } = data;
    cell.previewLabel = '';
    cell.text = text;
    if (textVariables) {
      const textVariable = textVariables.find((variable) => variable.value === text);
      if (textVariable && textVariable.previewLabel) {
        cell.previewLabel = textVariable.previewLabel;
      }
    }
  }

  /**
   * sets table borders
   * @param data to know which borders to set or unset
   */
  setBorders(data: {
    columnIndex: number;
    rowIndex: number;
    borderType: 'borders' | 'borderTop' | 'borderRight' | 'borderBottom' | 'borderLeft';
  }) {
    const { rowIndex, columnIndex, borderType } = data;
    if (borderType === 'borders') {
      this.data[rowIndex][columnIndex].borders = !this.data[rowIndex][columnIndex].borders;
      this.data[rowIndex][columnIndex].borderTop = this.data[rowIndex][columnIndex].borders;
      this.data[rowIndex][columnIndex].borderRight = this.data[rowIndex][columnIndex].borders;
      this.data[rowIndex][columnIndex].borderBottom = this.data[rowIndex][columnIndex].borders;
      this.data[rowIndex][columnIndex].borderLeft = this.data[rowIndex][columnIndex].borders;
    } else {
      this.data[rowIndex][columnIndex][borderType] = !this.data[rowIndex][columnIndex][borderType];
    }
  }
}
export class InvoicesTableElement extends TableElement {
  constructor(elementData: ITableElement) {
    super(elementData);
    this.type = 'invoicesTable';
  }
}

export interface TableCell {
  type?: string;
  text?: string;
  color?: string;
  bold?: boolean;
  italics?: boolean;
  fontSize?: number;
  fontFamily?: string;
  decoration?: 'underline' | 'lineThrough' | 'overline' | 'none';
  decorationStyle?: 'dashed' | 'dotted' | 'double' | 'wavy' | 'none';
  alignment?: 'right' | 'center' | 'left';
  characterSpacing?: number;
  lineHeight?: number;
  dateFormat?: string;
  width: number;
  height: number;
  borders: boolean;
  borderTop: boolean;
  borderRight: boolean;
  borderBottom: boolean;
  borderLeft: boolean;
  colspan: number;
  rowspan: number;
  hidden?: boolean;
  stack: CellText[];
  previewLabel?: string;
}

export interface CellText {
  type: string;
  text: string;
  color: string;
  bold: boolean;
  italics: boolean;
  fontSize: number;
  fontFamily: string;
  decoration: 'underline' | 'lineThrough' | 'overline' | 'none';
  decorationStyle: 'dashed' | 'dotted' | 'double' | 'wavy' | 'none';
  alignment: 'right' | 'center' | 'left';
  characterSpacing: number;
  lineHeight: number;
  previewLabel?: string;
  dateFormat: string;
}

export interface ITableElement extends IDocumentELement {
  page?: number;
  name: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  data?: TableCell[][];
}
