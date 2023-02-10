import { Component } from '@angular/core';
import { ImagineAlertController } from '../../services/imagine-alert-controller.service';

@Component({
  selector: 'imagine-alert-loading',
  templateUrl: './imagine-alert-loading.component.html',
  styleUrls: ['./imagine-alert-loading.component.scss'],
})
export class ImagineAlertLoadingComponent {
  constructor(public alertController: ImagineAlertController) {}
}

export interface CustomMessage {
  msg: string;
  icon: string;
  iconSlot: 'start' | 'end';
  iconColor: string;
}
