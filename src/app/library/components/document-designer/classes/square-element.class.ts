import { DocumentElement, IDocumentELement } from './document-element.class';

export class SquareElement extends DocumentElement {
  /**square element background color */
  backgroundColor = '#000000';
  /**
   *
   * @param elementData element data to be setted
   */
  constructor(elementData: IDocumentELement) {
    super(elementData);
    const { width, height } = elementData;
    this.type = 'square';
    this.width = width || 30;
    this.height = height || 30;
  }
  /**
   * sets initials values for the drag and drop
   */
  override setValues() {
    if (this.documentElementComponent?.item.nativeElement) {
      this.documentElementComponent.item.nativeElement.style.left = this.x + this.units;
      this.documentElementComponent.item.nativeElement.style.top = this.y + this.units;
      this.documentElementComponent.item.nativeElement.style.width = this.width + this.units;
      this.documentElementComponent.item.nativeElement.style.height = this.height + this.units;
      this.documentElementComponent.item.nativeElement.style.backgroundColor = this.backgroundColor;
    }
  }
  /**
   * sets the new background color of the element
   * @param color new square background color
   */
  setBackground(color: string) {
    if (this.documentElementComponent) {
      this.documentElementComponent.item.nativeElement.style.backgroundColor = color;
      this.backgroundColor = color;
    }
  }
}
