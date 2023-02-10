import { Component } from '@angular/core';
import { ImagineAlertController } from '../../services/imagine-alert-controller.service';

@Component({
  selector: 'imagine-alert',
  templateUrl: './imagine-alert.component.html',
  styleUrls: ['./imagine-alert.component.scss'],
})
export class ImagineAlertComponent {
  constructor(public alertController: ImagineAlertController) {}
}

export interface AlertInfo {
  title?: string;
  msg?: string;
  msgList?: CustomMessage;
  showIcon?: boolean;
  iconName?: string;
  color?: 'primary' | 'danger' | 'success' | 'white';
  buttons?: ButtonAlert[];
}

export interface ButtonAlert {
  buttonText: string;
  buttonHandler: any;
  buttonColor: 'primary' | 'danger' | 'success' | 'white' | 'dark';
  buttonIcon?: string;
}

export interface CustomMessage {
  msg: string;
  icon: string;
  iconSlot: string;
}
