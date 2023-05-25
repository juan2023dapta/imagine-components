import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ImagineFormGroup } from '../../classes/imagine-forms/imagine-form-group.class';
import { NodeStructure } from '../../interfaces/imagine-node-structure.interface';

@Component({
  selector: 'imagine-form-creator',
  templateUrl: './imagine-form-creator.component.html',
  styleUrls: ['./imagine-form-creator.component.scss'],
})
export class ImagineFormCreatorComponent implements OnInit {
  @Input() form!: ImagineFormGroup;
  @Input() formName?: string;
  @Input() childNodes: NodeStructure[] = [];
  @Input() className = '';
  constructor() {}

  get nodesStructure() {
    return this.childNodes.length ? this.childNodes : this.form.nodesStructure;
  }

  changePasswordType(inputType: { icon: string; type: any }) {
    if (inputType.type === 'password') {
      inputType.icon = 'pi-eye-slash';
      inputType.type = 'text';
    } else {
      inputType.icon = 'pi-eye';
      inputType.type = 'password';
    }
  }

  ngOnInit(): void {}
}
