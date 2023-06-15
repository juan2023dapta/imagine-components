import { Component, OnInit } from '@angular/core';
import { ImaginePopUpController } from 'src/app/library/components/imagine-pop-up/services/imagine-pop-up-controller.service';

@Component({
  selector: 'app-imagine-pop-up-documentation',
  templateUrl: './imagine-pop-up-documentation.component.html',
  styleUrls: ['./imagine-pop-up-documentation.component.scss'],
})
export class ImaginePopUpDocumentationComponent implements OnInit {
  constructor(private imaginePopUpController: ImaginePopUpController) {}

  ngOnInit(): void {}

  openSimplePopUp() {
    this.imaginePopUpController.openPopUp({
      component: ImaginePopUpDocumentationComponent,
    });
  }
}
