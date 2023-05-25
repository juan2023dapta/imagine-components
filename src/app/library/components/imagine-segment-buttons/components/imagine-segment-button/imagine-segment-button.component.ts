import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

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
  /**button style */
  @Input() buttonComponentStyle = {};
  /**button style */
  @Input() buttonStyle = {};
  /**general buttons style */
  buttonsStyle = {};
  /**button Class */
  @Input() buttonClass = '';
  /**button disabled */
  @Input() disable = false;
  /**Lines width for step buttons */
  linesWidth = '200px';
  /**sets segment button style */
  segmentStyle: 'buttons' | 'segment' | 'pill' | 'step' = 'buttons';
  /**flag to know if is multiple */
  multiple!: boolean;
  /**stores segment buttons value */
  valueParent: any | any[];
  /**flag to know if is selected */
  selected!: boolean;
  /**index */
  index = 0;
  /**
   *
   * @param changeDetectorRef change detector to avoid after view init error
   */
  constructor(public changeDetectorRef: ChangeDetectorRef, public elementRef: ElementRef) {}

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
    let style: any;
    if (this.segmentStyle === 'segment') {
      style = {
        borderBottom: this.selected ? '2px solid' : '2px solid',
        borderColor: this.selected ? 'var(--imagine-primary-color)' : 'var(--imagine-grey-color)',
        color: this.selected ? 'var(--imagine-primary-color)' : '#6C757D',
      };
    } else if (this.segmentStyle === 'buttons') {
      style = {
        color: this.selected ? 'var(--imagine-primary-color)' : 'var(--imagine-text-color)',
        borderRadius: '5px',
        border: '1px solid',
        borderColor: this.selected ? 'var(--imagine-primary-color)' : 'var(--imagine-border-secondary-color)',
        boxShadow: this.selected ? '0px 0px 4px 0px var(--imagine-primary-color)' : '',
      };
    } else if (this.segmentStyle === 'step') {
      style = {
        borderColor: this.selected ? 'var(--imagine-primary-color)' : 'var(--imagine-border-secondary-color)',
        backgroundColor: this.selected ? 'var(--imagine-primary-color)' : 'var(--imagine-background-color)',
        color: this.selected ? 'var(--imagine-light-color)' : 'var(--imagine-border-secondary-color)',
        borderRadius: '50px',
        border: '1px solid',
        boxShadow: this.selected ? '0px 0px 4px 0px var(--imagine-primary-color)' : '',
      };
    }
    return {
      borderRadius: '0',
      marginBottom: '-2px',
      boxShadow: 'none',
      ...style,
      ...this.buttonsStyle,
      ...this.buttonStyle,
    };
  }
}
