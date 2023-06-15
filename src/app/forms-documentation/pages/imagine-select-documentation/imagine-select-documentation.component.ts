import { Component, OnInit } from '@angular/core';
import { countries } from '../../data/country';

@Component({
  selector: 'imagine-imagine-select-documentation',
  templateUrl: './imagine-select-documentation.component.html',
  styleUrls: ['./imagine-select-documentation.component.scss'],
})
export class ImagineSelectDocumentationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  get countries() {
    return countries;
  }
}
