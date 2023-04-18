import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnDestroy,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
})
export class TextAreaComponent implements AfterViewInit, OnDestroy {
  /**tells the parent that value changed*/
  @Output() valueChange = new EventEmitter();
  /**text area background */
  @Input() background = 'light';
  /**text area height */
  @Input() height = '';
  /**text area type */
  @Input() type = 'text';
  /**text area label */
  @Input() label = '';
  /**text area name */
  @Input() name = '';
  /**text area field name for form errors */
  @Input() fieldName = '';
  /**text area placholder*/
  @Input() placeholder = '';
  /**text area value*/
  @Input() value = '';
  /**text area readonly flag*/
  @Input() readonly = false;
  /**form control name to access form control */
  @Input() formControlName = '';
  /**error messages */
  @Input() errorMessages: any = {};
  /**show error messages flag on invalid form */
  @Input() showErrorMessages = true;
  /** error messages type */
  @Input() messageErrorsType: 'classic' | 'tooltip' = 'tooltip';
  /** variables to set tooltip error size*/
  @Input() tooltipErrorWidth = '150px';
  /** variable to show tooltip error origin*/
  @Input() tooltipErrorShowOrigin = true;
  /**disable flag */
  @Input() disable = false;

  /**errors to be shown */
  errors: any[] = [];
  /**form errors */
  controlErrors!: ValidationErrors;
  /**form subscriptions */
  valueSub: Subscription | undefined = new Subscription();
  statusSub: Subscription | undefined = new Subscription();
  /** is disable flag for control value accessor */
  isDisabled = false;

  /**
   *
   * @param controlContainer access form group parent
   */
  constructor(@Optional() @Host() @SkipSelf() public controlContainer: ControlContainer) {}

  /**
   * after view initialization
   */
  ngAfterViewInit(): void {
    this.configureErrorMessages();
  }

  /**
   * returns if component is invalid
   */
  get invalid() {
    return (
      this.showErrorMessages &&
      this.errors.length > 0 &&
      this.controlContainer.control?.get(this.formControlName)?.invalid &&
      this.controlContainer.control?.get(this.formControlName)?.touched
    );
  }

  /**
   * configures error messages
   */
  configureErrorMessages() {
    if (this.fieldName === '') {
      this.fieldName = this.label;
    }
    if (this.controlContainer) {
      if (this.controlContainer.control?.get(this.formControlName)?.status === 'INVALID') {
        this.setErrors();
      }
      this.valueSub = this.controlContainer.control?.get(this.formControlName)?.valueChanges.subscribe(() => {
        this.setErrors();
      });
      this.statusSub = this.controlContainer.control?.get(this.formControlName)?.statusChanges.subscribe(() => {
        this.setErrors();
      });
    }
  }

  /**
   * sets the error messages
   */
  setErrors() {
    this.controlErrors = this.controlContainer.control?.get(this.formControlName)?.errors as any;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {
    //not implemented
  };
  onTouch: any = () => {
    //not implemented
  };

  /**
   * on input event
   * @param event input event
   */
  onInput(event: any) {
    this.onTouch();
    const value = event.target.value;
    this.value = value;
    this.valueChange.emit(value);
    this.onChange(this.value);
  }

  /**
   * control value accessor methods
   */
  writeValue(value: any): void {
    if (value) {
      this.value = value || '';
    } else {
      this.value = '';
    }
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
   * on components destroy
   */
  ngOnDestroy(): void {
    if (this.valueSub) {
      this.valueSub.unsubscribe();
    }
    if (this.statusSub) {
      this.statusSub.unsubscribe();
    }
  }
}
