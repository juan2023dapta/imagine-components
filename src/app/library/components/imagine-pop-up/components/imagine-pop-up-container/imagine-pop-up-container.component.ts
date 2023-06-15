import { Component, OnInit } from '@angular/core';
import { ImaginePopUpController } from '../../services/imagine-pop-up-controller.service';

@Component({
  selector: 'app-imagine-pop-up-container',
  templateUrl: './imagine-pop-up-container.component.html',
  styleUrls: ['./imagine-pop-up-container.component.scss'],
})
export class ImaginePopUpContainerComponent implements OnInit {
  constructor(private imaginePopUpController: ImaginePopUpController) {}

  ngOnInit(): void {}

  get popUps() {
    return this.imaginePopUpController.popUps;
  }
}
