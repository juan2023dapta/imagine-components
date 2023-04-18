import { IDocumentELement } from './document-element.class';
import { ImageElement } from './image-element.class';

export class SignatureElement extends ImageElement {
  /**
   *
   * @param elementData element data to be setted
   */
  constructor(elementData: IDocumentELement) {
    const { width, height } = elementData;
    super(elementData);
    this.type = 'first_signature';
    this.width = width || 65;
    this.height = height || 20;
    this.image = '/assets/images/signature.png';
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
    }
  }
  /**
   * returns the object data needed to be painted
   * @returns
   */
  override getValue() {
    const value = { ...this } as any;
    delete value.documentElementComponent;
    delete value.id;
    delete value.units;
    delete value.image;
    return value;
  }
}
export class SecondSignatureElement extends ImageElement {
  constructor(elementData: IDocumentELement) {
    const { width, height } = elementData;
    super(elementData);
    this.type = 'second_signature';
    this.width = width || 65;
    this.height = height || 20;
    this.image = '/assets/images/signature.png';
  }
  override setValues() {
    if (this.documentElementComponent?.item.nativeElement) {
      this.documentElementComponent.item.nativeElement.style.left = this.x + this.units;
      this.documentElementComponent.item.nativeElement.style.top = this.y + this.units;
      this.documentElementComponent.item.nativeElement.style.width = this.width + this.units;
      this.documentElementComponent.item.nativeElement.style.height = this.height + this.units;
    }
  }

  override getValue() {
    const value = { ...this } as any;
    delete value.documentElementComponent;
    delete value.id;
    delete value.units;
    delete value.image;
    return value;
  }
}
