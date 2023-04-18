import { DocumentElementComponent } from '../components/document-element/document-element.component';
import * as uuid from 'uuid';
export class DocumentElement {
  /**document element id */
  id: string;
  /**document element page */
  page: number;
  /**document element name */
  name: string;
  /**document element type */
  type: string;
  /** document element width */
  width: number;
  /** document element height */
  height: number;
  /** document element coordinates */
  x: number;
  y: number;
  /**document element units */
  units: 'px' | 'mm' = 'mm';
  /**document element component (drag and drop element) */
  documentElementComponent?: DocumentElementComponent;
  /**
   *
   * @param elementData element data to be setted
   */
  constructor(elementData: IDocumentELement) {
    const { page, name, width, height, x, y, type } = elementData;
    this.type = type || '';
    this.id = uuid.v4();
    this.page = page || 1;
    this.name = name;
    this.width = width || 30;
    this.height = height || 30;
    this.x = x || 75;
    this.y = y || 10;
  }
  /**
   * sets initials values for the drag and drop
   */
  setValues() {
    if (this.documentElementComponent?.item.nativeElement) {
      this.documentElementComponent.item.nativeElement.style.left = this.x + this.units;
      this.documentElementComponent.item.nativeElement.style.top = this.y + this.units;
      this.documentElementComponent.item.nativeElement.style.width = this.width + this.units;
      this.documentElementComponent.item.nativeElement.style.height = this.height + this.units;
    }
  }
  /**
   * sets element coords on check
   * @param coords contains the corresponding coordinates
   */
  setCoords(coords: { x?: number; y?: number }) {
    const { x, y } = coords;
    if (x || x === 0) {
      this.x = Number(Number(x).toFixed(2));
    }
    if (y || y === 0) {
      this.y = Number(Number(y).toFixed(2));
    }
  }
  /**
   * sets element coords on check
   * @param size contains the corresponding dimensions of the element
   */
  setSize(size: { width?: number; height?: number }) {
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
   * returns the object data needed to be painted
   * @returns
   */
  getValue() {
    const value = { ...this } as any;
    delete value.documentElementComponent;
    delete value.id;
    delete value.units;
    return value;
  }

  /**
   * trasnforms string into number
   * @param value string value
   * @param object object to set value
   * @param field field to set number value
   */
  setNumberField(value: string, object: any, field: string) {
    object[field] = Number(value);
  }
}

export interface IDocumentELement {
  page?: number;
  name: string;
  type?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}
