import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, Input, OnInit, ViewChild } from '@angular/core';
import { ImagineFormGroup } from '../../classes/imagine-forms/imagine-form-group.class';
import { NodeStructure } from '../../interfaces/imagine-node-structure.interface';
import { ImagineInputComponent } from '../../../imagine-input/components/imagine-input/imagine-input.component';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'imagine-node-form',
  templateUrl: './imagine-node-form.component.html',
  styleUrls: ['./imagine-node-form.component.scss'],
})
export class ImagineNodeFormComponent implements AfterViewInit {
  @ViewChild('input') input!: any;
  @Input() form!: ImagineFormGroup;
  @Input() formName?: string;
  @Input() node!: NodeStructure;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.node.inputData && this.input) {
      Object.keys(this.node.inputData).forEach((key) => {
        this.input[key] = (this.node.inputData as any)[key];
      });
    }
    if (this.node.formGroupName) {
      this.formName = this.node.formGroupName;
    }
    this.changeDetectorRef.detectChanges();
  }

  changePasswordType(inputType: { icon: string; type: any }) {
    if (inputType.type === 'password') {
      inputType.icon = 'pi-eye-slash';
      inputType.type = 'text';
    } else {
      inputType.icon = 'pi-eye';
      inputType.type = 'password';
    }
    this.input.type = inputType.type;
  }

  get formControl() {
    return this.node.formControlName ? (this.form.controls[this.node.formControlName] as any as FormControl) : null;
  }

  get conditionToShowExist() {
    return this.node.hasOwnProperty('conditionToShow');
  }

  get conditionToShow() {
    return this.node.conditionToShow();
  }

  get subFormGroup() {
    return this.node.type === 'form' && this.node.formGroupName
      ? (this.form.controls[this.node.formGroupName] as any)
      : this.form;
  }

  ngOnInit(): void {}
}
