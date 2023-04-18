import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({ selector: '[imagineCellTemplate]' })
export class ImagineCellTemplateDirective {
  /**cell template name to identify template */
  @Input('imagineCellTemplate') templateName!: string;
  /**
   *
   * @param template template ref to be painted
   */
  constructor(public readonly template: TemplateRef<any>) {}
}
