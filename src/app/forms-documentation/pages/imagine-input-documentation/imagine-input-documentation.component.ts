import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-imagine-input-documentation',
  templateUrl: './imagine-input-documentation.component.html',
  styleUrls: ['./imagine-input-documentation.component.scss'],
})
export class ImagineInputDocumentationComponent implements OnInit {
  formControlExample = new FormControl('', Validators.required);
  formGroupExample = this.formBuilder.group({
    formControlNameExample: ['', Validators.required],
    customName: ['', Validators.required],
    customErrorMessage: [10000000, Validators.required],
    mask: ['', Validators.required],
    date: ['2023-02-16T10:56:33.249Z'],
  });
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}
}
