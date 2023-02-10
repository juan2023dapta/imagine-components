import { ChangeDetectorRef, Component } from '@angular/core';
import { ImagineAlertController } from './library/components/imagine-alert/services/imagine-alert-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'imagine-lib';

  constructor(public alertController: ImagineAlertController, private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
}
