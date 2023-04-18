import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { ImagineDocumentDesignerComponent } from '../imagine-document-designer/imagine-document-designer.component';
import { ImagineDocumentElementComponent } from '../imagine-document-element/imagine-document-element.component';

@Component({
  selector: 'imagine--document-element-properties',
  templateUrl: './imagine-document-element-properties.component.html',
  styleUrls: ['./imagine-document-element-properties.component.scss'],
})
export class ImagineDocumentElementPropertiesComponent {
  /**content children to read element type directives */
  @ContentChildren(ElementTypeDirective, { read: ElementTypeDirective })
  templates!: QueryList<ElementTypeDirective>;
  /**units of the check */
  @Input() units: 'px' | 'mm' = 'mm';
  /** form templates array */
  formTemplates: any[] = [];
  /**types to dont list */
  @Input() ignoreTypes: string[] = [];
  /**document designer component from parent */
  @Input() set documentDesignerComponent(value: ImagineDocumentDesignerComponent) {
    this._documentDesignerComponent = value;
    if (this._documentDesignerComponent) {
      this._documentDesignerComponent.elementsUpdated.subscribe(() => {
        setTimeout(() => {
          this.documentElementComponents = this._documentDesignerComponent._documentElements
            .toArray()
            .filter((element) => !this.ignoreTypes.includes(element.element.type));
          this.formTemplates = [];
          this.templates.forEach((template) => {
            this.formTemplates.push(template);
          });
        }, 0);
      });
    }
  }
  /**document designer */
  _documentDesignerComponent!: ImagineDocumentDesignerComponent;
  /**document element components */
  documentElementComponents: ImagineDocumentElementComponent[] = [];
}
