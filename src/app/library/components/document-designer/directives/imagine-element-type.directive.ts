import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({ selector: '[imagineElementType]' })
export class ImagineElementTypeDirective {
  /**element type name */
  @Input('imagineElementType') imagineElementType!: string;
  /**
   *
   * @param template template ref for element
   */
  constructor(public readonly template: TemplateRef<any>) {}
}
