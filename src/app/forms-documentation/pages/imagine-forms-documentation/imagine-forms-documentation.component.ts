import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagineFormGroup } from 'src/app/library/classes/imagine-forms/imagine-form-group.class';
import { ImagineFormBuilder } from 'src/app/library/services/imagine-forms/imagine-form-builder.service';

@Component({
  selector: 'app-imagine-forms-documentation',
  templateUrl: './imagine-forms-documentation.component.html',
  styleUrls: ['./imagine-forms-documentation.component.scss'],
})
export class ImagineFormsDocumentationComponent implements OnInit {
  form: ImagineFormGroup = this.imagineFormBuilder.group({
    phone: ['', Validators.required],
  });

  constructor(private imagineFormBuilder: ImagineFormBuilder) {}

  ngOnInit(): void {
    this.form.valueChanges.subscribe((data) => {
      console.log(this.form);
      console.log(this.form.controls['phone'].changed);
    });
  }
}
