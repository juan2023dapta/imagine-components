import { DocumentElement, IDocumentELement } from './document-element.class';

export class MicrLineElement extends DocumentElement {
  /**
   *
   * @param elementData element data to be setted
   */
  constructor(elementData: IDocumentELement) {
    const { height, x, y } = elementData;
    super(elementData);
    this.type = 'micr_line';
    this.height = height || 20;
    this.x = x || 0;
    this.y = y || 0;
  }
  /**
   * sets initials values for the drag and drop
   */
  override setValues() {
    if (this.documentElementComponent?.item.nativeElement) {
      this.documentElementComponent.item.nativeElement.style.left = this.x + this.units;
      this.documentElementComponent.item.nativeElement.style.top = this.y + this.units;
      this.documentElementComponent.item.nativeElement.style.width = '100%';
      this.documentElementComponent.item.nativeElement.style.height = this.height + this.units;
      this.documentElementComponent.blockResizeHeight = true;
      this.documentElementComponent.blockResizeWidth = true;
      this.documentElementComponent.blockMoveXPosition = true;
    }
  }
}

export interface ILineElement extends IDocumentELement {
  page?: number;
  name: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}
