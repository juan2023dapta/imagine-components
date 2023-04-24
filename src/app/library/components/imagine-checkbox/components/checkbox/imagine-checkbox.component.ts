import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'imagine-checkbox',
  templateUrl: './imagine-checkbox.component.html',
  styleUrls: ['./imagine-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagineCheckboxComponent),
      multi: true,
    },
  ],
})
export class ImagineCheckboxComponent {
  /**access checkbox native element */
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLElement>;
  /**tells the parent when checkbox change */
  @Output() valueChange = new EventEmitter();
  /**checkbox value */
  @Input() value = false;
  /**flag to know when checkbox is disabled */
  @Input() disable = false;
  /**flag to know when checkbox is readonly */
  @Input() readonly = false;
  /**checkbox id to associate it with label */
  @Input() checkboxId = '';

  /**
   * control value accesor methods
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {
    //not implemented
  };
  onTouch: any = () => {
    //not implemented
  };

  writeValue(value: any) {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /**
   * Select an item an emit the value to the parent
   */
  toggleCheckbox() {
    if (this.disable) {
      return;
    }
    if (this.value) {
      this.value = false;
    } else {
      this.value = true;
    }
    this.onTouch();
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }
}
