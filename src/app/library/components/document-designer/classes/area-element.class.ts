import { DocumentElement, IDocumentELement } from './document-element.class';

export class AreaElement extends DocumentElement {
  /**
   *
   * @param elementData element data to be setted
   */
  constructor(elementData: IDocumentELement) {
    super(elementData);
    this.type = 'area';
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
}
export class CheckAreaElement extends AreaElement {
  /**tells if the check number*/
  checkAreaNumber: number;
  /**tells if the check number*/
  micrLineCoords: { x: number; y: number };
  /**
   *
   * @param elementData element data to be setted
   */
  constructor(elementData: ICheckAreaElement) {
    super(elementData);
    this.type = 'checkArea';
    this.width = 215.9;
    this.height = 88.9;
    this.x = elementData.x || 0;
    this.y = elementData.y || 0;
    this.micrLineCoords = elementData.micrLineCoords || { x: 50, y: 4.5 };
    if (elementData.checkAreaNumber) {
      this.checkAreaNumber = elementData.checkAreaNumber;
    } else {
      this.checkAreaNumber = 1;
      this.getCheckAreaNumber().then((checkAreaNumber) => {
        this.checkAreaNumber = checkAreaNumber;
      });
    }
  }

  /**get check area number if is not setted */
  getCheckAreaNumber(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.documentElementComponent) {
          const checkAreas: CheckAreaElement[] =
            this.documentElementComponent.documentDesignerComponent.elements.filter(
              (element) => element.type === 'checkArea'
            ) as CheckAreaElement[];
          const index = checkAreas.indexOf(this);
          resolve(index + 1);
        } else {
          resolve(1);
        }
      }, 0);
    });
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
      //block the resize because check area cant be resized
      this.documentElementComponent.blockResizeHeight = true;
      this.documentElementComponent.blockResizeWidth = true;
    }
  }

  /**
   * sets element coords on check
   * @param coords contains the corresponding coordinates
   */
  override setCoords(coords: { x?: number; y?: number }) {
    const { x, y } = coords;
    const diffX = Number(x) - this.x;
    const diffY = Number(y) - this.y;
    if (this.documentElementComponent) {
      for (const element of this.documentElementComponent.elementsSelected) {
        const coords = { x: element.element.x + diffX, y: element.element.y + diffY };
        element.element.setCoords(coords);
      }
    }
    if (x || x === 0) {
      this.x = Number(Number(x).toFixed(2));
    }
    if (y || y === 0) {
      this.y = Number(Number(y).toFixed(2));
    }
  }
}

export interface ICheckAreaElement extends IDocumentELement {
  page?: number;
  name: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  checkAreaNumber?: number;
  micrLineCoords?: { x: number; y: number };
}
