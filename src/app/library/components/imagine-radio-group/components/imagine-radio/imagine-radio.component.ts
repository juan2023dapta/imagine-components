import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'imagine-radio',
  templateUrl: './imagine-radio.component.html',
  styleUrls: ['./imagine-radio.component.scss'],
})
export class ImagineRadioComponent {
  /**tells the radio group that item was selected */
  @Output() itemSelected = new EventEmitter();
  /**radio option value */
  @Input() value = '';
  /**radio option label */
  @Input() name = '';
  /**flag to know if item is selected */
  selected = false;
  /**radio Id to connect with label */
  radioId = '';
  /**
   *
   * @param changeDetectorRef change detector reference to avoid after view init error
   */
  constructor(public changeDetectorRef: ChangeDetectorRef) {
    // sets radioId
    this.radioId = this.value + Math.random().toString(16).slice(2);
  }

  /**
   * Select an item an emit the value to the parent
   */
  selectItem() {
    this.itemSelected.emit(this.value);
  }
}
