import { DocumentElement, IDocumentELement } from './document-element.class';

export class LineElement extends DocumentElement {
  /**line element background color */
  backgroundColor = '#000000';
  /**line element orientation */
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  /**
   *
   * @param elementData element data to be setted
   */
  constructor(elementData: ILineElement) {
    super(elementData);
    const { width, height, backgroundColor, orientation } = elementData;
    this.type = 'line';
    this.width = width || 30;
    this.height = height || 0.45;
    this.orientation = orientation || 'horizontal';
    this.backgroundColor = backgroundColor || '#000000';
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
      if (this.orientation === 'horizontal') {
        this.documentElementComponent.blockResizeHeight = true;
        this.documentElementComponent.blockResizeWidth = false;
      } else {
        this.documentElementComponent.blockResizeHeight = false;
        this.documentElementComponent.blockResizeWidth = true;
      }
    }
  }
  /**
   * sets line orientation
   * @param orientation new line orientation
   */
  setOrientation(orientation: 'horizontal' | 'vertical') {
    const currentWidth = this.width;
    const currentHeight = this.height;
    this.setSize({ width: currentHeight, height: currentWidth });
    this.orientation = orientation;
    if (this.documentElementComponent) {
      if (this.orientation === 'horizontal') {
        this.documentElementComponent.blockResizeHeight = true;
        this.documentElementComponent.blockResizeWidth = false;
      } else {
        this.documentElementComponent.blockResizeHeight = false;
        this.documentElementComponent.blockResizeWidth = true;
      }
    }
  }

  /**
   * sets the new background color of the element
   * @param color new line background color
   */
  setBackground(color: string) {
    if (this.documentElementComponent) {
      this.documentElementComponent.item.nativeElement.style.backgroundColor = color;
      this.backgroundColor = color;
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
  backgroundColor?: string;
  orientation?: 'horizontal' | 'vertical';
}
