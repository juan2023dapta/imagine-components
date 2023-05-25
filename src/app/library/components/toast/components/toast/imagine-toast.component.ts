import { Component } from '@angular/core';
import { ImagineToastController } from '../../services/imagine-toast-controller.service';

@Component({
  selector: 'imagine-toast',
  templateUrl: './imagine-toast.component.html',
  styleUrls: ['./imagine-toast.component.scss'],
})
export class ImagineToastComponent {
  /**
   *
   * @param imagineToastController service to manage toasts
   */
  constructor(public imagineToastController: ImagineToastController) {}
}
