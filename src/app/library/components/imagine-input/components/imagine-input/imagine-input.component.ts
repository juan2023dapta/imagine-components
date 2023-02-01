import { CurrencyPipe, DecimalPipe } from '@angular/common';
import {
  Component,
  Host,
  Input,
  Optional,
  SkipSelf,
  AfterViewInit,
  OnDestroy,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
  forwardRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ValidationErrors,
  ControlValueAccessor,
  ControlContainer,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'imagine-input',
  templateUrl: './imagine-input.component.html',
  styleUrls: ['./imagine-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagineInputComponent),
      multi: true,
    },
    CurrencyPipe,
    DecimalPipe,
  ],
})
export class ImagineInputComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  /**Access to native input element */
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  /**Access to the label content container of the input like icons or images */
  @ViewChild('labelContent') labelContent!: ElementRef<HTMLElement>;
  /**Access to the start content container of the input like icons or images */
  @ViewChild('startContent') startContent!: ElementRef<HTMLElement>;
  /**Access to the end content container of the input like icons or images */
  @ViewChild('endContent') endContent!: ElementRef<HTMLElement>;
  /**Tells parent when value changes */
  @Output() valueChange = new EventEmitter();
  /**Sends parent on input event */
  @Output() inputChange = new EventEmitter();
  /**Sends parent on key down pressed event */
  @Output() keyDown = new EventEmitter();
  /**Sends parent on key up pressed event */
  @Output() keyUp = new EventEmitter();
  /**Sends parent on focus event */
  @Output() focus = new EventEmitter();
  /**Sends parent on blur event */
  @Output() blur = new EventEmitter();

  /**Sets input background */
  @Input() background = 'light';
  /**Gets form control in case the form group will not be used*/
  @Input() formControl!: FormControl;
  /**Sets input type */
  @Input() type = 'text';
  /**Sets input label */
  @Input() label = '';
  /**Sets floating label */
  @Input() labelType: 'normal' | 'floating' | 'fixed' = 'normal';
  /**Sets input placeholder */
  @Input() placeholder: string | number = '';
  /**Sets input value */
  @Input() value = '';
  /**Sets input readonly attribute */
  @Input() readonly = false;
  /**Sets input name attribute */
  @Input() name = '';
  /**Sets input disabled attribute */
  @Input() disable = false;
  /**Sets input width */
  @Input() width = '100%';
  /**Sets input fontSize */
  @Input() fontSize = '16px';
  /**Sets input formControlName to reactive forms errors */
  @Input() formControlName = '';
  /**Sets input field name to reactive forms errors */
  @Input() fieldName = '';
  /**Sets custom error messages for reactive forms validators */
  @Input() errorMessages: any = {};
  /**Flag to know if shoe or hide component error messages to set them outisde component */
  @Input() showErrorMessages = true;
  /**Sets errors of reactive forms*/
  @Input() errors: any[] = [];
  /** to know if auto complete parent its invalid */
  @Input() invalidParent: boolean | undefined = false;
  /** to know if show errors under input or in a tooltip*/
  @Input() messageErrorsType: 'classic' | 'tooltip' = 'tooltip';
  /** variables to set tooltip error size*/
  @Input() tooltipErrorWidth = '150px';
  /** variable to show tooltip error origin*/
  @Input() tooltipErrorShowOrigin = true;
  /**Variable to know if when input is type number, show spin button ro increase or decrease value */
  @Input() spinButton = false;
  /**Sets browser autocomplete */
  @Input() autocomplete: 'on' | 'off' = 'on';
  /**Sets number format */
  @Input() locale = 'en-US';
  /**Sets input currency symbol to format */
  @Input() currencySymbol = '$';
  /**Sets currency display */
  @Input() currencyDisplay:
    | 'code'
    | 'symbol'
    | 'symbol-narrow'
    | string
    | boolean = 'symbol';
  /**Sets country calling code to phone format */
  @Input() countryCallingCode = '';
  /**Sets maxLength to input type text */
  @Input() maxLength = '';
  /**Sets max and min to input type number */
  @Input() min!: number;
  @Input() max!: number;
  /**Sets a pattern to match value while the user is writting */
  @Input() pattern = '';
  /**Decimal places for number type */
  @Input() decimalSpots = 0;
  /**container class */
  @Input() containerClass = '';

  /**Reactive form control errors to show them in the input*/
  controlErrors!: ValidationErrors;
  /**Reactive form control value sub */
  valueSub: Subscription | undefined = new Subscription();
  /**Reactive form control status sub */
  statusSub: Subscription | undefined = new Subscription();
  /**Flag to know if input is focused */
  isFocused = false;
  /**Stores current key pressed */
  currentKeyPressed = '';
  /**Stores current caret position */
  caretPosition = 0;
  /**excluded types */
  excludedTypes = ['number', 'date'];
  /**outline class active */
  outlineClassActive = '';
  /**
   *
   * @param controlContainer access control container reactive form
   */
  constructor(
    @Optional() @Host() @SkipSelf() public controlContainer: ControlContainer,
    private changeDetector: ChangeDetectorRef
  ) {}

  /**
   * After component inits
   */
  ngAfterViewInit(): void {
    this.configureErrorMessages();
    this.changeDetector.detectChanges();
  }

  /**
   * Detect when input is invalid
   */
  get invalid() {
    return (
      (this.showErrorMessages &&
        this.errors.length > 0 &&
        this.inputFormControl?.invalid &&
        this.inputFormControl?.touched) ||
      this.invalidParent
    );
  }

  /**
   * access form control
   */
  get inputFormControl() {
    return this.controlContainer
      ? this.controlContainer?.control?.get(this.formControlName)
      : this.formControl;
  }

  /**
   * Detect if input has star content like icons or images
   */
  get labelContentExist() {
    return this.labelContent?.nativeElement.children.length > 0;
  }

  /**
   * Detect if input has star content like icons or images
   */
  get startContentExist() {
    return this.startContent?.nativeElement.children.length > 0;
  }

  /**
   * Detect if input has end content like icons or images
   */
  get endContentExist() {
    return this.endContent?.nativeElement.children.length > 0;
  }

  /**
   * Set error messages when value changes or status changes
   */
  configureErrorMessages() {
    if (this.fieldName === '') {
      this.fieldName = this.label;
    }
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
   * Methods of value accessor interface
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {
    //not implemented
  };
  onTouch: any = () => {
    //not implemented
  };
  writeValue(value: any): void {
    this.value = value?.toString() || '';
    this.verifyNumberFormat();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /**
   * Executes on blur
   * @param event blur event
   */
  onBlur(event: any) {
    this.blur.emit(event);
    this.isFocused = false;
    this.onTouch();
    this.verifyNumberFormat();
  }

  /**
   * Executes on focus
   * @param event focus event
   */
  onFocus(event: any) {
    this.isFocused = true;
    this.focus.emit(event);
  }

  /**
   *  Executes on key down
   * @param event key down event
   */
  onKeyDown(event: any) {
    this.currentKeyPressed = event.key;
    this.caretPosition = event.target.selectionStart;
    this.keyDown.emit(event);
  }

  /**
   *  Executes on key up
   * @param event key up event
   */
  onKeyUp(event: any) {
    this.keyUp.emit(event);
  }

  /**
   * Executes on input
   * @param event input event
   */
  onInput(event: any) {
    this.onTouch();
    const currentValue = this.value;
    if (this.maxLength && event.target.value.length > Number(this.maxLength)) {
      event.target.value = currentValue;
    }
    if (this.pattern !== '') {
      this.regexValidator(event, currentValue, this.pattern);
    }
    if (this.type === 'number') {
      const reg = new RegExp(/^\d*\.?\d*$/);
      if (
        (event.target.value !== '' && !reg.test(event.target.value)) ||
        (!this.decimalSpots && event.target.value.includes('.'))
      ) {
        event.target.value = currentValue;
      }
    }
    if (this.type === 'positiveNumber') {
      this.formatPositiveNumber(event, currentValue);
    }
    if (this.type === 'currency' || this.type === 'groupNumber') {
      this.formatDecimalNumber(event, currentValue);
    }
    if (this.type === 'phone') {
      this.formatPhone(event);
    }
    this.value = event.target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.inputChange.emit(event);
  }

  /**
   * Regex validator format on input
   * @param event  on input event that contains the value to be verified
   * @param currentValue value before formated
   */
  regexValidator(event: any, currentValue: any, pattern: any) {
    const reg = new RegExp(pattern);
    if (event.target.value !== '' && !reg.test(event.target.value)) {
      event.target.value = currentValue;
    }
  }

  /**
   * Positive number format on input
   * @param event on input event that contains the value to be formated
   * @param currentValue value before formated
   */
  numberFormat(event: any, currentValue: any) {
    const reg = new RegExp(/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/);
    if (
      (event.target.value !== '' && !reg.test(event.target.value)) ||
      Number(event.target.value) < this.min ||
      Number(event.target.value) > this.max
    ) {
      event.target.value = currentValue;
    }

    if (this.decimalSpots || this.decimalSpots === 0) {
      if (this.decimalSpots === 0 && event.target.value.includes('.')) {
        event.target.value = currentValue;
      } else {
        if (
          event.target.value.split('.')[1] &&
          event.target.value.split('.')[1].length > this.decimalSpots
        ) {
          event.target.value = currentValue;
        }
      }
    }
  }

  /**
   * Positive number format on input
   * @param event on input event that contains the value to be formated
   * @param currentValue value before formated
   */
  formatPositiveNumber(event: any, currentValue: any) {
    const reg = new RegExp('^(0|[1-9][0-9]*)$');
    if (
      (event.target.value !== '' && !reg.test(event.target.value)) ||
      Number(event.target.value) < this.min ||
      Number(event.target.value) > this.max
    ) {
      event.target.value = currentValue;
    }
  }

  /**
   *
   * @param event on input event that contains the value to be formatted
   * @param currentValue value before formatted
   */
  formatDecimalNumber(event: any, currentValue: any) {
    if (this.min || this.min === 0) {
      if (Number(event.target.value.replace(/[^0-9.-]+/g, '')) < this.min) {
        event.target.value = currentValue;
      }
    }

    if (Number(event.target.value.replace(/[^0-9.-]+/g, '')) > this.max) {
      event.target.value = currentValue;
    }

    this.groupNumber(event);

    const lengthDifference = event.target.value.length - this.value.length;

    this.input.nativeElement.setSelectionRange(
      this.caretPosition + lengthDifference,
      this.caretPosition + lengthDifference
    );
  }

  /**
   * group number
   */
  groupNumber(event: any) {
    if (event.target.value.indexOf('.') >= 0) {
      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      let decimal_pos = event.target.value.indexOf('.');

      // split number by decimal point
      let left_side = event.target.value.substring(0, decimal_pos);
      let right_side = event.target.value.substring(decimal_pos);

      // add commas to left side of number
      left_side = this.formatNumber(left_side);

      // validate right side
      right_side = this.formatNumber(right_side);

      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);

      // join number by .
      if (this.type === 'currency') {
        event.target.value = this.currencySymbol + left_side + '.' + right_side;
      } else {
        event.target.value = left_side + '.' + right_side;
      }
    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      event.target.value = this.formatNumber(event.target.value);
      if (this.type === 'currency') {
        event.target.value = this.currencySymbol + event.target.value;
      }
    }
    return event.target.value;
  }

  /**
   * Formats the number value into a phone number value
   * @param event on input event that contains the value to be formatted
   */
  formatPhone(event: any) {
    event.target.value = event.target.value.replace(
      this.countryCallingCode + ' ',
      ''
    );
    if (event.target.value !== '') {
      event.target.value = event.target.value
        .replace(/\D+/g, '')
        .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      event.target.value = this.countryCallingCode
        ? this.countryCallingCode + ' ' + event.target.value
        : event.target.value;
    }
  }

  /**
   * Formats the number in decimals with or without currency
   * @param value Value to be formatted
   * @param digitsInfo decimal places info
   * @returns formatted value
   */
  formatNumber(value: string) {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Sometimes the value is NaN because of currencies, these methods checks if the value is NaN
   * @param value value to be verified
   * @returns boolean if value is NaN
   */
  currencyIsNaN(value: string): boolean {
    return isNaN(Number(value.toString().replace(/[^0-9.-]+/g, '')));
  }

  /**
   * Formats the number on write value or on blur
   */
  verifyNumberFormat() {
    if (this.value) {
      if (
        this.type === 'currency' ||
        this.type === 'groupNumber' ||
        this.type === 'number'
      ) {
        if (this.type === 'currency' || this.type === 'groupNumber') {
          this.value = this.groupNumber({ target: { value: this.value } });
          if (!this.value.includes('.')) {
            this.value = this.value + '.00';
          }
          if (this.value[this.value.length - 1] === '.') {
            this.value = this.value + '00';
          }
        } else {
          this.value = Number(this.value).toFixed(this.decimalSpots);
        }
      }
    }
  }
  /**
   * converts date to real date
   * @param date date to convert
   * @returns real date
   */
  convertDateToUTC(date: Date) {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
  }

  /**
   * Unsubscribes
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
