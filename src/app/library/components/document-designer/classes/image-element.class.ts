import { DocumentElement, IDocumentELement } from './document-element.class';

export class ImageElement extends DocumentElement {
  /**image url */
  image?: string;

  /**
   *
   * @param elementData element data to be setted
   */
  constructor(elementData: IImageElement) {
    const { width, height } = elementData;
    super(elementData);
    this.image = elementData.image || '';
    this.type = 'image';
    this.width = width || 65;
    this.height = height || 20;
  }

  /**
   * sets new image
   * @param input file input that contains new image
   */
  setImage(input: any) {
    input.click();
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // compress image
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          this.image = canvas.toDataURL('image/jpeg', 0.5);
        };
      };
    };
  }

  /**
   * sets element coords on check
   * @param size contains the corresponding dimensions of the element
   * @param preventSetRealDimension avoid inifinite bucle
   */
  override setSize(
    size: { width?: number | undefined; height?: number | undefined },
    preventSetRealDimension?: boolean
  ): void {
    // const prevWidth = this.width;
    // const prevHeight = this.height;
    const { width, height } = size;
    if (width && this.documentElementComponent?.item.nativeElement) {
      this.width = Number(Number(width).toFixed(2));
      this.documentElementComponent.item.nativeElement.style.width = width + this.units;
    }
    if (height && this.documentElementComponent?.item.nativeElement) {
      this.height = Number(Number(height).toFixed(2));
      this.documentElementComponent.item.nativeElement.style.height = height + this.units;
    }

    if (!preventSetRealDimension) {
      // this.checkImageRealDimensions(prevWidth, prevHeight);
    }
  }

  /**
   * sets image real dimensions
   * @param prevWidth previous image width
   * @param prevHeight previous image height
   */
  checkImageRealDimensions(prevWidth: number, prevHeight: number) {
    const newHeight = (this.width * prevHeight) / prevWidth;
    this.setSize({ height: newHeight }, true);
  }
}

export interface IImageElement extends IDocumentELement {
  page?: number;
  name: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  image?: string;
}
