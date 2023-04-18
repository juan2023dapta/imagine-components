import { DocumentTextVariable } from '../interfaces/document-text-variable.interface';
import { DocumentElement, IDocumentELement } from './document-element.class';

export class TextElement extends DocumentElement {
  /**text element text */
  text: string;
  /**text element text color */
  color: string;
  /**text element bold style flag */
  bold: boolean;
  /**text element italics style flag */
  italics: boolean;
  /**text element font size */
  fontSize: number;
  /**text element font family */
  fontFamily: string;
  /**text element decoration */
  decoration: 'underline' | 'lineThrough' | 'overline' | null;
  /**text element decoration style */
  decorationStyle: 'dashed' | 'dotted' | 'double' | 'wavy' | null;
  /**text element alignment */
  alignment: 'right' | 'center' | 'left';
  /**text element character spacing */
  characterSpacing: number;
  /**text element preview label */
  previewLabel?: string;
  /**text element date format */
  dateFormat: string;
  /**text element currency format */
  currencyType: 'Currency' | 'Currency Code' | 'None';

  transitSeparator: '/' | '-' | '.' | ',' | null;

  /**
   *
   * @param elementData element data to be setted
   */

  constructor(elementData: ITextElement) {
    super(elementData);
    this.type = 'text';
    this.color = elementData.color || '#000000';
    this.bold = elementData.bold || false;
    this.italics = elementData.italics || false;
    this.decoration = elementData.decoration || null;
    this.decorationStyle = elementData.decorationStyle || null;
    this.text = elementData.text || 'Type Here';
    this.fontSize = elementData.fontSize || 3.5;
    this.fontFamily = elementData.fontFamily || 'Arial';
    this.alignment = elementData.alignment || 'left';
    this.characterSpacing = elementData.characterSpacing || 0;
    this.width = elementData.width || 20;
    this.height = elementData.height || 6;
    this.previewLabel = elementData.previewLabel || '';
    this.dateFormat = elementData.dateFormat || 'MM-DD-YYYY';
    this.currencyType = elementData.currencyType || 'None';
    this.transitSeparator = elementData.transitSeparator || '-';
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
   * sets text
   */
  setText(text: string, textVariables?: DocumentTextVariable[]) {
    this.previewLabel = '';
    this.text = text;
    if (textVariables) {
      const textVariable = textVariables.find((variable) => variable.value === text);
      if (textVariable && textVariable.previewLabel) {
        this.previewLabel = textVariable.previewLabel;
      }
    }
  }

  /**
   * sets font size
   */
  setFontSize(fontSize: string) {
    this.fontSize = Number(fontSize);
  }

  /**
   * sets text character spacing
   */
  setCharacterSpacing(characterSpacing: string) {
    this.characterSpacing = Number(characterSpacing);
  }

  /**
   * sets text alignment
   */
  setAlignment(alignment: 'left' | 'center' | 'right') {
    this.alignment = alignment;
  }

  /**
   * sets text color
   */
  setTextColor(color: string) {
    this.color = color;
  }

  /**
   * sets text bold style
   */
  setBold(bold: boolean) {
    this.bold = bold;
  }

  /**
   * sets text italics style
   */
  setItalics(italics: boolean) {
    this.italics = italics;
  }

  /**
   * sets text decoration
   */
  setDecoration(decoration: 'underline' | 'lineThrough' | 'overline' | null) {
    this.decoration = decoration;
  }

  /**
   * sets text decoration style
   */
  setDecorationStyle(decorationStyle: 'dashed' | 'dotted' | 'double' | 'wavy' | null) {
    this.decorationStyle = decorationStyle;
  }
}

export interface ITextElement extends IDocumentELement {
  page?: number;
  name: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  text?: string;
  color?: string;
  bold?: boolean;
  italics?: boolean;
  fontSize?: number;
  fontFamily?: string;
  decoration?: 'underline' | 'lineThrough' | 'overline' | null;
  decorationStyle?: 'dashed' | 'dotted' | 'double' | 'wavy' | null;
  alignment?: 'right' | 'center' | 'left';
  characterSpacing?: number;
  previewLabel?: string;
  dateFormat: string;
  currencyType: 'Currency' | 'Currency Code' | 'None';
  transitSeparator: '/' | '-' | '.' | ',' | null;
}
