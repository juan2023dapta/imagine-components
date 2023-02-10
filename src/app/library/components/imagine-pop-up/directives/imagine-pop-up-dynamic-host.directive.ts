import {
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[ImaginePopUpDynamicHost]',
})
export class ImaginePopUpDynamicHostDirective {
  /*** component to be injected*/
  @Input() dynamicComponent!: Type<any>;
  componentRef!: ComponentRef<any>;
  /*** template to be injected*/
  @Input() dynamicTemplate!: TemplateRef<any>;
  templateRef!: EmbeddedViewRef<any>;
  /**
   *
   * @param viewContainerRef service to inject components and templates
   */
  constructor(public viewContainerRef: ViewContainerRef) {}
  /**
   * creates dynamic component
   */
  createComponent(): void {
    this.componentRef = this.viewContainerRef.createComponent(
      this.dynamicComponent
    );
  }
  /**
   * projects the template in pop up
   */
  createView() {
    this.templateRef = this.viewContainerRef.createEmbeddedView(
      this.dynamicTemplate
    );
  }
}
