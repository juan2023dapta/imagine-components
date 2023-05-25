import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { ControlContainer, FormControl, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImagineSegmentButtonComponent } from '../imagine-segment-button/imagine-segment-button.component';

@Component({
  selector: 'imagine-segment-buttons',
  templateUrl: './imagine-segment-buttons.component.html',
  styleUrls: ['./imagine-segment-buttons.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagineSegmentButtonsComponent),
      multi: true,
    },
  ],
})
export class ImagineSegmentButtonsComponent implements OnDestroy {
  @ViewChild('buttonsContainer') buttonsContainer!: ElementRef<HTMLDivElement>;
  /**access segment buttons childs */
  @ContentChildren(ImagineSegmentButtonComponent) content!: QueryList<ImagineSegmentButtonComponent>;
  /**tells the parent segment changed */
  @Output() segmentChange = new EventEmitter();
  /**semgment buttons value */
  @Input() value: any | any[];
  /**semgment buttons multiple flag */
  @Input() multiple = false;
  /*Change the select style*/
  @Input() segmentStyle: 'buttons' | 'segment' | 'pill' | 'step' = 'buttons';
  /**flag to know if show border */
  @Input() showBorderForSegment = true;
  /**flag to know if select first option automatic */
  @Input() selectFirstItemAuto = false;
  /**container class */
  @Input() containerClass = '';
  /**container styles */
  @Input() containerStyle = {};
  /**form control name of control container */
  @Input() formControlName = '';
  /**Gets form control in case the form group will not be used*/
  @Input() formControl!: FormControl;
  /**Sets custom error messages for reactive forms validators */
  @Input() errorMessages: any = {};
  /**Flag to know if shoe or hide component error messages to set them outisde component */
  @Input() showErrorMessages = true;
  /**Sets errors of reactive forms*/
  @Input() errors: any[] = [];
  /**Sets input field name to reactive forms errors */
  @Input() fieldName = '';
  /**Lines width for step buttons */
  @Input() linesWidth = '200px';
  /**general buttons style */
  @Input() buttonsStyle = {};
  /**flag to know if is disable */
  isDisabled = false;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {
    //not implemented
  };
  onTouch: any = () => {
    //not implemented
  };

  /**stores subscription on content changed */
  segmentOptionChangesSub = new Subscription();
  /**stores subscription on item selected */
  itemsSelectedSub: Subscription[] = [];
  /**flag to know if there are no items */
  noItems = false;
  /**Reactive form control errors to show them in the input*/
  controlErrors!: ValidationErrors;
  /**Reactive form control value sub */
  valueSub: Subscription | undefined = new Subscription();
  /**Reactive form control status sub */
  statusSub: Subscription | undefined = new Subscription();
  /**
   *
   * @param changeDetectorRef change detector to avoid after view init error
   */
  constructor(
    private changeDetectroRef: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() public controlContainer: ControlContainer
  ) {}

  /**
   * get the complete style for container
   */
  get ngStyles() {
    return {
      ...this.containerStyle,
    };
  }

  /**
   * access form control
   */
  get inputFormControl() {
    return this.controlContainer ? this.controlContainer?.control?.get(this.formControlName) : this.formControl;
  }

  /**
   * Form control invalid state
   */
  get invalid() {
    return (
      this.showErrorMessages &&
      this.errors.length > 0 &&
      this.inputFormControl?.invalid &&
      this.inputFormControl?.touched
    );
  }

  /**
   * after view init configuration for the component
   */
  ngAfterViewInit() {
    this.configureErrorMessages();
    this.configureSegment();
    // this.drawLinesBetweenButtons();
    this.segmentOptionChangesSub = this.content.changes.subscribe(() => {
      this.configureSegment();
    });
  }

  /**
   * configures the segment component
   */
  configureSegment() {
    if (this.content.length === 0) {
      this.noItems = true;
    } else {
      this.noItems = false;
      this.content.forEach((element, i) => {
        element.index = i;
        element.linesWidth = this.linesWidth;
        element.multiple = this.multiple;
        element.segmentStyle = this.segmentStyle;
        element.buttonsStyle = this.buttonsStyle;
        element.changeDetectorRef.detectChanges();
        const subscription = element.itemSelected.subscribe(() => {
          this.selectItem({ item: element, itemClicked: true });
        });
        this.itemsSelectedSub.push(subscription);
      });
      setTimeout(() => {
        const item = this.content.find((item) => this.value === item.value);
        if (item) {
          this.selectItem({ item, preventOnTouch: true, preventOnChange: true });
        } else {
          if (this.selectFirstItemAuto && !this.multiple && this.content.length > 0) {
            this.selectItem({ item: this.content.get(0), preventOnTouch: true });
          }
        }
        this.updateValueInChilds();
      }, 0);
    }
    this.changeDetectroRef.detectChanges();
    if (this.segmentStyle === 'step') this.drawLinesBetweenButtons();
  }

  /**
   * Set error messages when value changes or status changes
   */
  configureErrorMessages() {
    if (this.inputFormControl) {
      this.setErrors();
      this.valueSub = this.inputFormControl?.valueChanges.subscribe(() => {
        this.setErrors();
      });
      this.statusSub = this.inputFormControl?.statusChanges.subscribe(() => {
        this.setErrors();
      });
    }
  }

  /**
   * Store error messages in variable
   */
  setErrors() {
    this.controlErrors = this.inputFormControl?.errors as any;
    if (this.controlErrors) {
      const errors: any[] = [];
      Object.keys(this.controlErrors).forEach((key) => {
        if (this.controlErrors[key]) {
          errors.push(key);
        }
      });
      this.errors = errors;
    } else {
      this.errors = [];
    }
  }

  /**
   * updates the value in child elements
   */
  updateValueInChilds() {
    this.content?.forEach((element) => {
      if (this.multiple) {
        element.selected = !!this.value.includes(element.value);
      } else {
        element.selected = this.value === element.value;
      }
      element.changeDetectorRef.detectChanges();
    });
  }

  /**
   * control value accesor methods
   */
  writeValue(value: any) {
    this.value = value;
    this.updateValueInChilds();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Select an item an emit the value to the parent
   */
  selectItem(data: { item: any; itemClicked?: boolean; preventOnTouch?: boolean; preventOnChange?: boolean }) {
    const { item, itemClicked, preventOnTouch, preventOnChange } = data;
    if (itemClicked && item && item.value === this.value) {
      return;
    }
    if (!this.multiple) {
      if (!item) {
        this.value = null;
        if (!preventOnChange) {
          this.onChange(null);
          this.segmentChange.emit(null);
        }
        if (!preventOnTouch) {
          this.onTouch();
        }
        this.updateValueInChilds();
        return;
      }
      this.value = item.value;
      if (!preventOnTouch) {
        this.onTouch();
      }
      if (!preventOnChange) {
        this.onChange(this.value);
        this.segmentChange.emit(this.value);
      }
      this.updateValueInChilds();
    } else {
      if (item) {
        if (!this.value) {
          this.value = [];
        }
        if (this.value.length === 0) {
          this.value.push(item.value);
        } else {
          const index = this.value.indexOf(item.value);
          if (index === -1) {
            this.value.push(item.value);
          } else {
            this.value.splice(index, 1);
          }
        }
      }

      if (!preventOnTouch) {
        this.onTouch();
      }
      if (!preventOnChange) {
        this.segmentChange.emit(this.value);
        this.onChange(this.value);
      }
      this.updateValueInChilds();
    }
  }

  drawLinesBetweenButtons() {
    this.buttonsContainer.nativeElement.querySelectorAll('.segmentLine').forEach((item) => {
      item.remove();
    });
    this.content.forEach((node, i) => {
      if (i > 0) {
        const line = document.createElement('div');
        line.style.width = '100%';
        line.style.borderBottom = '1px solid var(--imagine-border-secondary-color)';
        line.classList.add('segmentLine');
        node.elementRef.nativeElement.insertAdjacentElement('beforebegin', line);
      }
    });
  }

  /**
   * on component destroy
   */
  ngOnDestroy(): void {
    this.segmentOptionChangesSub.unsubscribe();
    this.itemsSelectedSub.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
