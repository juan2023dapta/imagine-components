import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
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
  HostListener,
} from '@angular/core';
import {
  ValidationErrors,
  ControlValueAccessor,
  ControlContainer,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { GroupData } from '../../interfaces/group-data.interface';
import { ImagineInputType } from '../../types/input.type';

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
    TitleCasePipe,
  ],
})
export class ImagineInputComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /**Access to native input element */
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  /**Access to native autocompleteContainer element */
  @ViewChild('autocompleteContainer') autocompleteContainer!: ElementRef<HTMLDivElement>;
  /**Access to the label content container of the input like icons or images */
  @ViewChild('labelContent') labelContent!: ElementRef<HTMLElement>;
  /**Access to the start content container of the input like icons or images */
  @ViewChild('startContent') startContent!: ElementRef<HTMLElement>;
  /**Access to the end content container of the input like icons or images */
  @ViewChild('endContent') endContent!: ElementRef<HTMLElement>;
  /**Tells parent when value changes */
  @Output() valueChange = new EventEmitter();
  /**Sends parent on input event */
  @Output() input = new EventEmitter();
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
  @Input() type: ImagineInputType = 'text';
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
  /**error messages class */
  @Input() errorMessagesClass = '';
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
  @Input() currencyDisplay: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol';
  /**Sets country calling code to phone format */
  @Input() countryCallingCode = '';
  /**Sets maxLength to input type text */
  @Input() maxLength = '';
  /**Sets max and min to input type number */
  @Input() min!: number;
  @Input() max!: number;
  /**Sets a pattern to match value while the user is writting */
  @Input() pattern = '';
  /**Sets a mask to format value while the user is writting */
  @Input() mask = '';
  /**Sets a mask to format value while the user is writting */
  @Input() groupData!: GroupData;
  /**Decimal places for number type */
  @Input() decimalSpots = 0;
  /**container class */
  @Input() containerClass = '';
  /**container style */
  @Input() containerStyle = {};
  /**autocomplete list */
  @Input() list = '';
  /**autocomplete variables list */
  @Input() variablesList: string[] = [];

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
  /**Stores current key pressed */
  lastKeyPressed = '';
  /**Stores current caret position */
  caretPosition = 0;
  /**excluded types */
  excludedTypes = ['number', 'date'];
  /**box types */
  boxTypes: ImagineInputType[] = ['variables', 'chip', 'code'];
  /**outline class active */
  outlineClassActive = '';
  /**autocomplete box top, left */
  autocompleteConfig = {
    x: 0,
    y: 0,
    show: false,
  };

  /**last caret position */
  lastCaretPosition = 0;

  /**
   * input count lines code editir
   */
  inputLines = 1;

  /**
   *
   * @param controlContainer access control container reactive form
   */
  constructor(
    @Optional() @Host() @SkipSelf() public controlContainer: ControlContainer,
    private changeDetector: ChangeDetectorRef,
    private titleCasePipe: TitleCasePipe
  ) {}

  /**
   * After component inits
   */
  ngAfterViewInit(): void {
    this.configureErrorMessages();
    this.changeDetector.detectChanges();
  }

  /**
   * input target used on input event (chip type)
   */
  get inputTarget() {
    return { target: { ...this.inputElement, value: this.inputElement.nativeElement.textContent } };
  }

  /**
   * get input box height is bigger than normal height to apply padding
   */
  get inputBoxBigger() {
    if (this.inputElement && this.inputElement.nativeElement && this.inputElement.nativeElement.parentElement) {
      const height = parseInt(this.inputElement.nativeElement.parentElement.getBoundingClientRect().height + '');
      const minHeight = parseInt(getComputedStyle(this.inputElement.nativeElement.parentElement).minHeight);
      const padding = parseInt(getComputedStyle(this.inputElement.nativeElement).paddingTop);
      return height - padding * 2 > minHeight;
    }
    return false;
  }
  /**
   * Detect when input is invalid
   */
  get invalid() {
    return (
      (this.errors.length > 0 && this.inputFormControl?.invalid && this.inputFormControl?.touched) || this.invalidParent
    );
  }

  /**
   * access form control
   */
  get inputFormControl() {
    return this.controlContainer ? this.controlContainer?.control?.get(this.formControlName) : this.formControl;
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
   * input clienhte rect
   */
  get clientRectInput() {
    return this.inputElement?.nativeElement.getBoundingClientRect();
  }

  /**
   * input lines
   */
  get inputLinesCount() {
    return Math.floor(this.clientRectInput?.height || 1 / 19) || 1;
  }

  get currentLine() {
    const sel = document.getSelection();
    if (!sel) {
      return 1;
    }
    const nd = sel.anchorNode;
    if (!nd) {
      return 1;
    }
    const text = nd.textContent!.slice(0, sel.focusOffset);

    return text.split('\n').length;
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
    if (this.boxTypes.includes(this.type)) {
      setTimeout(() => {
        this.inputElement.nativeElement.innerText = this.value;
      }, 0);
    }
    this.verifyFormat();
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
    this.verifyFormat();
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
    if (this.boxTypes.includes(this.type) && event.which === 13 && this.type !== 'code') {
      event.preventDefault();
    }
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
    if (this.type === 'mask') {
      this.formatMask(event, currentValue);
    }
    if (this.type === 'chip') {
      this.chipFormat(event);
    }
    if (this.type === 'variables') {
      this.variableFormat(event);
    }
    if (this.type === 'title') {
      this.titlecaseFormat(event);
    }
    if (this.type === 'code') {
      this.lastCaretPosition = this.getContentEditableCaretposition();
      this.codeFormat();
    }

    this.lastKeyPressed = this.currentKeyPressed;
    this.value = event.target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.input.emit(event);
  }

  codeFormat() {
    this.inputElement.nativeElement.innerHTML = this.inputElement.nativeElement.innerHTML.replace(
      /if/g,
      '<span style="color:#C189B5;">if</span>'
    );
    this.inputElement.nativeElement.innerHTML = this.inputElement.nativeElement.innerHTML.replace(
      /\(/g,
      '<span style="color:#4C89E3;">(</span>'
    );
    this.inputElement.nativeElement.innerHTML = this.inputElement.nativeElement.innerHTML.replace(
      /\)/g,
      '<span style="color:#4C89E3;">)</span>'
    );
    this.inputElement.nativeElement.innerHTML = this.inputElement.nativeElement.innerHTML.replace(
      /\{/g,
      '<span style="color:#4C89E3;">{</span>'
    );
    this.inputElement.nativeElement.innerHTML = this.inputElement.nativeElement.innerHTML.replace(
      /\}/g,
      '<span style="color:#4C89E3;">}</span>'
    );
    this.setCaretPosition(this.inputElement.nativeElement, this.lastCaretPosition);
    this.inputElement.nativeElement.focus();
  }

  // Move caret to a specific point in a DOM element
  setCaretPosition(el: any, pos: any) {
    // Loop through all child nodes
    for (var node of el.childNodes) {
      if (node.nodeType == 3) {
        // we have a text node
        if (node.length >= pos) {
          console.log(pos);
          // finally add our range
          var range = document.createRange(),
            sel = window.getSelection();
          range.setStart(node, pos);
          range.collapse(true);
          sel!.removeAllRanges();
          sel!.addRange(range);
          return -1; // we are done
        } else {
          pos -= node.length;
        }
      } else {
        pos = this.setCaretPosition(node, pos);
        if (pos == -1) {
          return -1; // no need to finish the for loop
        }
      }
    }
    return pos; // needed because of recursion stuff
  }
  /**
   * titlecase format
   */
  titlecaseFormat(event: any) {
    event.target.value = this.titleCasePipe.transform(event.target.value);
  }

  /**variable format */
  variableFormat(event: any) {
    if (!event.target.value) {
      return;
    }
    let caretPosition = this.getContentEditableCaretposition();
    this.lastCaretPosition = caretPosition;
    const value = event.target.value.split('');
    if (
      (value[caretPosition - 1] &&
        value[caretPosition - 1].includes('{') &&
        value[caretPosition] &&
        value[caretPosition].includes('{')) ||
      (value[caretPosition - 1] &&
        value[caretPosition - 1].includes('{') &&
        value[caretPosition - 2] &&
        value[caretPosition - 2].includes('{'))
    ) {
      const selection = window.getSelection(),
        range = selection!.getRangeAt(0),
        rect = range.getClientRects()[0];

      this.autocompleteConfig.x = rect.x;
      this.autocompleteConfig.y = rect.y;
      this.autocompleteConfig.show = true;
    } else {
      this.autocompleteConfig.show = false;
    }
  }

  insertText(option: string) {
    let value = this.value;
    if (this.lastCaretPosition >= value.length) {
      value = value + option + '}}';
      this.onInput({ target: { value } });
      this.inputElement.nativeElement.innerText = value;
    } else {
      const valueArray = value.split('');
      valueArray.splice(this.lastCaretPosition, 0, option + '}}');
      value = valueArray.join('');
      this.onInput({ target: { value } });
      this.inputElement.nativeElement.innerText = value;
    }
  }
  /**chip format */
  chipFormat(event: any) {
    if (this.currentKeyPressed === 'Backspace') {
      setTimeout(() => {
        this.inputElement.nativeElement.querySelectorAll('span').forEach((span) => {
          if (!span.textContent?.includes(' ')) {
            span.innerHTML = '&nbsp;';
            span.setAttribute('style', '');
            setTimeout(() => {
              this.placeCaretAtEndContentEditable(this.inputElement.nativeElement);
            }, 0);
          }
        });
      }, 0);
    }
    if (this.currentKeyPressed === ' ') {
      const display = 'display:inline-block;';
      const style = `
      border: 1px solid var(--imagine-primary-color);
      border-radius: 5px;
      margin-left: 4px;
      margin-top:4px;
      padding:2px;
      background-color: var(--imagine-input-box-shadow-focus);
      width: min-content; ${display}`;
      const value = event.target.value.split(' ');
      let content = '';
      value.forEach((item: string) => {
        content += `<div style="${style}">${item} </div>`;
      });
      content += `<div style="${display}">&nbsp;</div>`;
      this.inputElement.nativeElement.innerHTML = content;
      this.placeCaretAtEndContentEditable(this.inputElement.nativeElement);
    }
  }

  /**
   * get content editable caret position
   */
  getContentEditableCaretposition(node: any = this.inputElement.nativeElement) {
    let position = 0;
    const isSupported = typeof window.getSelection !== 'undefined';
    if (isSupported) {
      const selection = window.getSelection();
      // Check if there is a selection (i.e. cursor in place)
      if (selection!.rangeCount !== 0) {
        // Store the original range
        const range = window.getSelection()!.getRangeAt(0);
        // Clone the range
        const preCaretRange = range.cloneRange();
        // Select all textual contents from the contenteditable element
        preCaretRange.selectNodeContents(node);
        // And set the range end to the original clicked position
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        // Return the text length from contenteditable start to the range end
        position = preCaretRange.toString().length;
      }
    }
    return position;
  }

  /**
   * place carte position at last element on chip write
   * @param el element to place caret position
   */
  placeCaretAtEndContentEditable(el: HTMLElement) {
    el.focus();
    if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } else if (typeof (document.body as any).createTextRange != 'undefined') {
      var textRange = (document.body as any).createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
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
        if (event.target.value.split('.')[1] && event.target.value.split('.')[1].length > this.decimalSpots) {
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

    //place cursor
    const lengthDifference = event.target.value.length - this.value.length;

    this.inputElement.nativeElement.setSelectionRange(
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
    event.target.value = event.target.value.replace(this.countryCallingCode + ' ', '');
    if (event.target.value !== '') {
      event.target.value = event.target.value.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      event.target.value = this.countryCallingCode
        ? this.countryCallingCode + ' ' + event.target.value
        : event.target.value;
    }
  }

  /**
   * Formats the value into a mask specified
   * @param event on input event that contains the value to be formatted
   */
  formatMask(event: any, currentValue = '') {
    const indexesUnreplaceable = this.mask.split('').map((l) => {
      if (l === '_') {
        return 'notreplaceable';
      } else {
        return l;
      }
    });
    const pattern = this.mask.replace(/n|l|c/g, '_');

    const cleanValue: string = event.target.value
      .split('')
      .filter((char: string) => !pattern.includes(char))
      .join('');

    const cleanValueMask: string = this.mask
      .split('')
      .filter((char: string) => !pattern.includes(char))
      .join('');

    if (!this.checkTypesOnMaskPattern(cleanValue, cleanValueMask)) {
      event.target.value = currentValue;
      return event.target.value;
    }

    const maskCharsToReplace: number[] = [];

    pattern.split('').forEach((char, i) => {
      if (char === '_' && indexesUnreplaceable[i] !== 'notreplaceable') {
        maskCharsToReplace.push(i);
      }
    });

    const newValue = pattern.split('');

    cleanValue.split('').forEach((char, i) => {
      newValue[maskCharsToReplace[i]] = char;
    });

    event.target.value = newValue.join('');

    let position = 0;
    if (event.inputType == 'deleteContentBackward') {
      if (this.caretPosition === 1) {
        position = this.caretPosition;
      } else {
        position = this.caretPosition - 1;
      }
    } else if (event.inputType == 'insertText') {
      let lastNormalCharIndex = 0;
      for (let index = 0; index < newValue.length; index++) {
        if (cleanValue.includes(newValue[index])) {
          lastNormalCharIndex = index;
        }
      }

      if (this.caretPosition >= lastNormalCharIndex) {
        position = lastNormalCharIndex + 1;
      } else {
        if (pattern.includes(newValue[this.caretPosition])) {
          let nextNormalCharIndex = 0;
          for (let index = this.caretPosition; index < newValue.length; index++) {
            if (cleanValue.includes(newValue[index])) {
              nextNormalCharIndex = index;
              break;
            }
          }
          position = nextNormalCharIndex + 1;
        } else {
          position = this.caretPosition + 1;
        }
      }
    }

    this.inputElement?.nativeElement.setSelectionRange(position, position);

    return event.target.value;
  }

  /**
   * validates types on mask pattern
   * @param value value to validate
   * @return valid if value is valid of type
   */

  checkTypesOnMaskPattern(value: string, cleanValueMask: string) {
    if (value === '') {
      return true;
    }
    let valid = false;
    const type = this.detectTypesOnMaskPattern();
    if (type === 'alpha' && /^[a-zA-Z]+$/.test(value)) {
      valid = true;
    } else if (type === 'numeric' && /^\d+$/.test(value)) {
      valid = true;
    } else if (type === 'alphanumeric') {
      let validChar = true;
      for (let i = 0; i < value.split('').length; i++) {
        if (cleanValueMask[i] === 'l' && !/^[a-zA-Z]+$/.test(value[i])) {
          validChar = false;
        } else if (cleanValueMask[i] === 'n' && !/^\d+$/.test(value[i])) {
          validChar = false;
        }
        if (!validChar) {
          break;
        }
      }
      valid = validChar;
    }
    return valid;
  }

  /**
   * detect mask types
   * @returns type of mask to know which values accept
   */
  detectTypesOnMaskPattern() {
    let type: 'alpha' | 'numeric' | 'alphanumeric' | '' = '';
    if (this.mask.match(/n/g)) {
      type = 'numeric';
    }
    if (this.mask.match(/l/g)) {
      type = 'alpha';
    }
    if (this.mask.match(/n/g) && this.mask.match(/l/g)) {
      type = 'alphanumeric';
    }
    return type;
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
   * verify format depending on type
   */
  verifyFormat() {
    if (this.type === 'currency' || this.type === 'groupNumber' || this.type === 'number') {
      this.verifyNumberFormat();
    }
    if (this.type === 'mask') {
      this.verifyMask();
    }
  }

  /**
   * Formats the number on write value or on blur
   */
  verifyNumberFormat() {
    if (this.value) {
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

  /**
   * Verify mask if input type is mask
   */
  verifyMask() {
    this.value = this.formatMask({ target: { value: this.value } });
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

  /**
   *
   * @param event on mouse down event
   */
  @HostListener('document:mousedown', ['$event'])
  clickoutAutoComplete(event: any) {
    if (
      !this.inputElement.nativeElement.contains(event.target) &&
      !this.autocompleteContainer?.nativeElement.contains(event.target)
    ) {
      this.autocompleteConfig.show = false;
    }
  }
}
