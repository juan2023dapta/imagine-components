import { ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'imagine-segment-button',
  templateUrl: './imagine-segment-button.component.html',
  styleUrls: ['./imagine-segment-button.component.scss'],
})
export class ImagineSegmentButtonComponent {
  /**access template refs to show custom labels */
  @ContentChild(TemplateRef) templateRef!: TemplateRef<any>;
  /**tells teh parent item is selected */
  @Output() itemSelected = new EventEmitter();
  /**segment button value */
  @Input() value!: string | number;
  /**segment label */
  @Input() name!: string | number;
  /**button border */
  @Input() borderButtons = '1px solid';
  /**button border */
  @Input() style = {};
  /**sets segment button style */
  segmentStyle: 'buttons' | 'segment' | 'pill' = 'buttons';
  /**flag to know if is multiple */
  multiple!: boolean;
  /**stores segment buttons value */
  valueParent: any | any[];
  /**flag to know if is selected */
  selected!: boolean;

  /**
   *
   * @param changeDetectorRef change detector to avoid after view init error
   */
  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  /**
   * tells the parent item was selected
   */
  change() {
    this.itemSelected.emit(this.value);
  }

  /**
   * ng style
   */
  get ngStyle() {
    return {
      borderBottom: this.segmentStyle === 'segment' && this.selected ? '2px solid' : '',
      borderColor: this.segmentStyle === 'segment' && this.selected ? 'var(--imagine-primary-color)' : '',
      ...this.style,
    };
  }
}
