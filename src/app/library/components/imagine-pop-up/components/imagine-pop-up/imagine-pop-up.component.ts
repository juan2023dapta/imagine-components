import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { ImaginePopUpDynamicHostDirective } from '../../directives/imagine-pop-up-dynamic-host.directive';
import { PopUpController } from '../../services/imagine-pop-up-controller.service';

@Component({
  selector: 'imagine-pop-up',
  templateUrl: './imagine-pop-up.component.html',
  styleUrls: ['./imagine-pop-up.component.scss'],
})
export class ImaginePopUpComponent implements AfterViewInit {
  /**access host directive */
  @ViewChild(ImaginePopUpDynamicHostDirective)
  hostDirective!: ImaginePopUpDynamicHostDirective;

  /**
   *
   * @param popUpController service to manage the pop up
   * @param changeDetector change detector to avoid after view init errors
   */
  constructor(
    public popUpController: PopUpController,
    private changeDetector: ChangeDetectorRef
  ) {}

  /**
   * after view init
   */
  ngAfterViewInit(): void {
    if (this.popUpController.popUpConfig.component) {
      this.createComponent();
    } else if (this.popUpController.popUpConfig.templateRef) {
      this.createTemplateRef();
    }
  }

  /**
   * creates dynamic component
   */
  createComponent() {
    this.hostDirective.createComponent();
    if (this.popUpController.popUpConfig.componentProps) {
      Object.keys(this.popUpController.popUpConfig.componentProps).forEach(
        (key) => {
          this.hostDirective.componentRef.instance[key] =
            this.popUpController.popUpConfig.componentProps[key];
        }
      );
    }
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
