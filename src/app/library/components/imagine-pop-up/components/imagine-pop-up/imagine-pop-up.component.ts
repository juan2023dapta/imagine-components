import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { ImaginePopUpDynamicHostDirective } from '../../directives/imagine-pop-up-dynamic-host.directive';
import { ImaginePopUpController } from '../../services/imagine-pop-up-controller.service';
import { ImaginePopUpConfig, ImaginePopUpInternalConfig } from '../../interfaces/imagine-pop-up.interfaces';

@Component({
  selector: 'imagine-pop-up',
  templateUrl: './imagine-pop-up.component.html',
  styleUrls: ['./imagine-pop-up.component.scss'],
})
export class ImaginePopUpComponent implements AfterViewInit {
  /**access host directive */
  @ViewChild(ImaginePopUpDynamicHostDirective)
  hostDirective!: ImaginePopUpDynamicHostDirective;

  @Input() wrapper = false;
  @Input() popUpConfiguration: ImaginePopUpInternalConfig = {};
  @Input() hidden = false;
  @Input() animation = 'popUpFadeIn';

  /**
   *
   * @param popUpController service to manage the pop up
   * @param changeDetector change detector to avoid after view init errors
   */
  constructor(public popUpController: ImaginePopUpController, private changeDetector: ChangeDetectorRef) {}

  get animationPopUp() {
    return this.wrapper ? this.animation : this.popUpConfiguration.animation;
  }

  /**
   * after view init
   */
  ngAfterViewInit(): void {
    if (!this.wrapper) {
      if (this.popUpConfiguration.component) {
        this.createComponent();
      } else if (this.popUpConfiguration.templateRef) {
        this.createTemplateRef();
      }
    }
  }

  /**
   * creates dynamic component
   */
  createComponent() {
    const componentRef = this.hostDirective.createComponent();
    if (this.popUpConfiguration.componentProps) {
      Object.keys(this.popUpConfiguration.componentProps).forEach((key) => {
        this.hostDirective.componentRef.instance[key] = this.popUpConfiguration.componentProps[key];
      });
    }
    this.popUpController.componentCreated.emit(componentRef);
    this.changeDetector.detectChanges();
  }
  /**
   * projects the template in pop up
   */
  createTemplateRef() {
    this.hostDirective.createView();
    this.changeDetector.detectChanges();
  }
}
