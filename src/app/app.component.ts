import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController } from './library/components/alert/services/alert-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'imagine-lib';

  constructor(
    public alertController: AlertController,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
}
