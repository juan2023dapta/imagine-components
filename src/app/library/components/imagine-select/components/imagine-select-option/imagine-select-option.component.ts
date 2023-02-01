import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'imagine-select-option',
  templateUrl: './imagine-select-option.component.html',
  styleUrls: ['./imagine-select-option.component.scss'],
})
export class ImagineSelectOptionComponent {
  /** access option container native element*/
  @ViewChild('optionContainer')
  optionContainer!: ElementRef<HTMLParagraphElement>;
  /**tells the parent item was selected */
  @Output() itemSelected = new EventEmitter();
  /**element value */
  @Input() value!: string | null;
  /**sets the option disable */
  @Input() disable = false;
  /**element multiple flag */
  multiple = false;
  /**parent value*/
  valueParent: any | any[];
  /**selected flag*/
  selected!: boolean;
  /**over option flag on keyboard selection*/
  over!: boolean;
  /**hidden flag to hidde option*/
  hidden = false;

  /**
   *
   * @param changeDetectorRef change detector to avoid after view init error
   */
  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  /**
   * text content of option
   */
  get textContentOption() {
    return this.optionContainer.nativeElement.textContent;
  }

  /**
   * tells the parent item was selected
   */
  change() {
    if (!this.disable) {
      this.itemSelected.emit(this.value);
    }
  }
}
