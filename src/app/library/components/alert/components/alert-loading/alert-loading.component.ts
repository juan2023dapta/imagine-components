import { Component } from '@angular/core';
import { AlertController } from '../../services/alert-controller.service';

@Component({
  selector: 'app-alert-loading',
  templateUrl: './alert-loading.component.html',
  styleUrls: ['./alert-loading.component.scss'],
})
export class AlertLoadingComponent {
  constructor(public alertController: AlertController) {}
}

export interface CustomMessage {
  msg: string;
  icon: string;
  iconSlot: 'start' | 'end';
  iconColor: string;
}
