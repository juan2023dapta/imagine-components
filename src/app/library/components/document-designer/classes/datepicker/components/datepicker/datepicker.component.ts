import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SkipSelf,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatepickerService } from '../../services/datepicker.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements OnInit, AfterViewInit, OnDestroy {
  /**access input date native element of the date picker */
  @ViewChildren('dateInput') dateInputs!: QueryList<ElementRef<HTMLDetailsElement>>;
  /**access details native element of the date picker */
  @ViewChild('details') details!: ElementRef<HTMLDetailsElement>;
  /**access list container of the date picker */
  @ViewChild('listContainer') listContainer!: ElementRef<HTMLUListElement>;
  /**access list container of the date picker */
  @ViewChild('hours') hoursContainer!: ElementRef<HTMLDivElement>;
  /**access list container of the date picker */
  @ViewChild('minutes') minutesContainer!: ElementRef<HTMLDivElement>;
  /**tells the parent when date change */
  @Output() dateChange = new EventEmitter();
  /**datepicker value */
  @Input() value: any;
  /**flag to know if datepicker is readonly */
  @Input() readonly = false;
  /**sets date picker label */
  @Input() label = '';
  /**sets field name for errors */
  @Input() fieldName = '';
  /**sets error messages */
  @Input() errorMessages: any = {};
  /**shows error messages */
  @Input() showErrorMessages = true;
  /**messages error types */
  @Input() messageErrorsType: 'classic' | 'tooltip' = 'tooltip';
  /**flag to accept range or not*/
  @Input() range = false;
  /**flag to know when date picker is disable or not */
  @Input() disable = false;
  /**datepicker background color*/
  @Input() background = 'light';
  /**flag to know if show toggle icon */
  @Input() showToggleIcon = true;
  /**flag to know if can clear value */
  @Input() canClear = false;
  /** variables to set tooltip error size*/
  @Input() tooltipErrorWidth = '150px';
  /** variable to show tooltip error origin*/
  @Input() tooltipErrorShowOrigin = true;
  /**Min Date */
  @Input() minDate: Date | null = null;
  /**Max Date */
  @Input() maxDate: Date | null = null;
  /**form control name to associate it with forms */
  @Input() formControlName = '';
  /**date format */
  @Input() dateFormat = 'MM/DD/YYYY';
  /**date format */
  splittedFormat: string[] = [];
  /**upper formats to check in date formatter */
  upperFormats: string[] = [];
  /**date format */
  separators: any[] = [];
  /**separator pattern */
  separatorPatter = /[:\s\-,/]/;
  separatorPatterGlobal = /[:\s\-,/]/g;
  /**range clicked count to know how many dates been selected */
  rangeClickedCount = 0;
  /**Flag to know if select is focused */
  focused = false;
  /**form errors */
  errors: any[] = [];
  controlErrors!: ValidationErrors;

  /**form subscriptions */
  valueSub: Subscription | undefined = new Subscription();
  statusSub: Subscription | undefined = new Subscription();
  /**children subscriptions */
  inputSub = new Subscription();
  /**flag to know if show calendar */
  showCalendar = false;
  /**calendar arrays */
  calendarData: {
    days: any[];
    months: string[];
    years: number[];
  } = {
    days: [],
    months: [],
    years: [],
  };

  /**currentView */
  currentView: 'time' | 'days' | 'month' | 'year' = 'days';

  /**current date attributes */
  currentDate = {
    period: 'AM',
    seconds: 0,
    minute: 0,
    hour: 1,
    day: 0,
    month: 0,
    year: 0,
  };
  /**initial year selected */
  initialYear!: number;
  /**selected month */
  selectedMonth!: string;
  /**flag to know if end content has been clciked */
  endContentClicked = false;
  /**to konw how many days are in current month */
  daysInMonth = 0;

  /**
   *
   * @param controlContainer service to access form control
   * @param changeDetectroRef changeDetector to avoid after view init errors
   * @param elementRef access native element ref component
   */
  constructor(
    @Optional() @Host() @SkipSelf() public controlContainer: ControlContainer,
    public datepickerService: DatepickerService,
    private elementRef: ElementRef
  ) {
    this.calendarData.months = this.datepickerService.months;
  }

  /**
   * returns true if calendar just allows year
   */
  get yearPicker() {
    return this.upperFormats.length === 1 && this.upperFormats[0].includes('Y');
  }
  /**
   * returns true if calendar just allows months
   */
  get monthPicker() {
    return this.upperFormats.length === 1 && this.upperFormats[0].includes('M');
  }
  /**
   * returns true if calendar just allows year
   */
  get monthYearPicker() {
    return (
      this.upperFormats.length === 2 &&
      (this.upperFormats[0].includes('Y') || this.upperFormats[0].includes('M')) &&
      (this.upperFormats[1].includes('Y') || this.upperFormats[1].includes('M'))
    );
  }
  /**
   * returns true if calendar just allows time
   */
  get timePicker() {
    return (
      this.upperFormats.length === 2 &&
      (this.upperFormats[0].includes('H') || this.upperFormats[0].includes('m')) &&
      (this.upperFormats[1].includes('H') || this.upperFormats[1].includes('m'))
    );
  }
  /**
   * returns true if calendar allows time
   */
  get datetimePicker() {
    return this.upperFormats.length > 5 && this.upperFormats.includes('HH') && this.upperFormats.includes('mm');
  }

  /**
   * returns the distance to bottom from the component
   */
  get distanceToBottom() {
    const rect = this.details.nativeElement.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    return bodyRect.bottom - rect.bottom;
  }

  /**
   * retuns if the form value is invalid
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
   * returns if value is array
   */
  get valueIsArray() {
    return Array.isArray(this.value);
  }

  /**
   *
   * @param event on mouse down event
   */
  @HostListener('document:mousedown', ['$event'])
  click(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.details.nativeElement.removeAttribute('open');
      if (this.focused) {
        this.onTouch();
        this.focused = false;
      }
    } else {
      if (!this.disable && !this.readonly) {
        this.focused = true;
      }
    }
  }

  /**
   * toggles add event listeners
   * @param action tells to add or remove
   */
  toggleListeners(action: 'add' | 'remove') {
    this.toggleWheelListener(action);
    this.toggleTouchListener(action);
  }

  /**
   * Touch listener add to hide the picker or remove for better performance
   * @param action add or remove on touch listener
   */
  toggleTouchListener(action: 'add' | 'remove') {
    if (action === 'add') {
      document.addEventListener('touchstart', this.onTouchListener);
    } else {
      document.removeEventListener('touchstart', this.onTouchListener);
    }
  }

  /**
   * on date picker touch
   * @param event touch event
   */
  onTouchListener = (event: any) => {
    if (this.listContainer) {
      if (!this.listContainer.nativeElement.contains(event.target)) {
        this.showCalendar = false;
        this.details.nativeElement.removeAttribute('open');
        this.toggleTouchListener('remove');
      }
    }
  };
  /**
   * Wheel listener add to hide the picker or remove for better performance
   * @param action add or remove on Wheel listener
   */
  toggleWheelListener(action: 'add' | 'remove') {
    if (action === 'add') {
      document.addEventListener('wheel', this.onWheelListener);
    } else {
      document.removeEventListener('wheel', this.onWheelListener);
    }
  }
  /**
   * on document wheel
   * @param event wheel event
   */
  onWheelListener = (event: any) => {
    if (this.listContainer) {
      if (!this.listContainer.nativeElement.contains(event.target)) {
        this.showCalendar = false;
        this.details.nativeElement.removeAttribute('open');
        this.toggleWheelListener('remove');
      }
    }
  };

  /**
   * on component initialization
   */
  ngOnInit() {
    this.setSelectedMonth(new Date());
    this.initialYear = this.currentDate.year;
    this.setAmountYears();
  }
  /**
   * after view init
   */
  ngAfterViewInit() {
    this.configureFormat();
    this.configureErrorMessages();
  }

  /**
   * configures format
   */
  configureFormat() {
    this.splittedFormat = this.dateFormat.split(this.separatorPatter);
    this.separators = [...this.dateFormat.matchAll(this.separatorPatterGlobal)].map((separator) => separator[0]);
    this.upperFormats = this.splittedFormat.map((format, index) => {
      if (
        this.splittedFormat[index - 1] &&
        this.splittedFormat[index - 1].includes('H') &&
        format.toLowerCase().includes('m')
      ) {
        //lower case minutes format
        return format.toLowerCase();
      }
      return format.toUpperCase();
    });
    if (this.yearPicker || this.monthYearPicker) {
      this.currentView = 'year';
    } else if (this.monthPicker) {
      this.currentView = 'month';
    } else {
      if (this.timePicker) {
        this.currentView = 'time';
      }
      if (!this.range) this.configureInputs();
    }
  }

  /**
   * configure inputs
   */
  configureInputs() {
    this.setInputEventListeners();
    this.inputSub = this.dateInputs.changes.subscribe(() => {
      this.setInputEventListeners();
    });
  }

  /**
   * set inputs event listeners
   */

  setInputEventListeners() {
    this.dateInputs.forEach((input, i) => {
      input.nativeElement.setAttribute('index', i.toString());
      input.nativeElement.setAttribute('contenteditable', 'true');
      input.nativeElement.setAttribute('inputmode', 'decimal');
      input.nativeElement.addEventListener('input', this.inputChangeListener.bind(this));
      input.nativeElement.addEventListener('keypress', this.inputkeyPressListener.bind(this));
      input.nativeElement.addEventListener('keydown', this.inputkeyDownListener.bind(this));
    });
  }

  /**
   * on input change
   * @param event input event
   */
  inputChangeListener(event: any) {
    const index = Number(event.target.getAttribute('index'));
    const format = this.upperFormats[index];

    const max = this.getMaxValue(format);

    if (max && Number(event.target.innerText) > max) {
      event.target.innerText = max.toString();
    }

    let date = new Date();

    if (this.yearPicker) {
      date.setFullYear(Number(event.target.parentElement.innerText));
      date.setMonth(0);
      date.setDate(1);
    } else if (this.monthPicker) {
      date.setMonth(Number(event.target.parentElement.innerText) - 1);
      date.setDate(1);
    } else if (this.monthYearPicker) {
      date = new Date(event.target.parentElement.innerText);
      date.setDate(1);
    } else {
      date = new Date(event.target.parentElement.innerText);
    }

    if (date instanceof Date && !isNaN(date.getTime())) {
      setTimeout(() => {
        const dateValue: string[] = event.target.parentElement.innerText.split(this.separatorPatter);
        let validLength = true;
        dateValue.forEach((value, i) => {
          if (value.length < this.upperFormats[i].length) {
            validLength = false;
          }
          if (value === 'may' && this.upperFormats[i].length > 2) {
            validLength = true;
          }
        });
        if (validLength) {
          this.selectDate({ date });
          this.setSelectedMonth(this.value);
          this.initialYear = date.getFullYear();
          this.setAmountYears();
        }
      }, 0);
    }
  }

  /**
   * on input key press
   * @param event key event
   */
  inputkeyPressListener(event: any) {
    const index = Number(event.target.getAttribute('index'));
    const format = this.upperFormats[index];
    let formatLength = format.length;
    if (format.includes('M')) {
      formatLength = 2;
    }
    if (
      event.target.innerText.toLowerCase() === format.toLowerCase() ||
      event.target.innerText.length + 1 > formatLength
    ) {
      event.target.innerText = '';
      return;
    }

    if (!event.key.match(/^[0-9]/g) && event.keyCode !== 8 && event.keyCode !== 46) {
      event.preventDefault();
    }

    setTimeout(() => {
      if (event.target.innerText.length >= formatLength) {
        if (format.includes('M')) {
          event.target.innerText = this.datepickerService.dateFormat(event.target.innerText, format);
        }
        const nextInput = this.dateInputs.toArray()[index + 1];
        if (nextInput) nextInput.nativeElement.focus();
      }
    }, 0);
  }

  /**
   * gets max valu depending on year and month
   * @param format string
   * @returns max number
   */
  getMaxValue(format: string) {
    let max = 0;
    if (format.includes('M')) {
      max = 12;
    } else if (format.includes('D')) {
      max = 31;
    } else if (format.includes('H')) {
      max = 23;
    } else if (format.includes('m')) {
      max = 59;
    } else if (format.includes('S')) {
      max = 59;
    }
    return max;
  }

  /**
   * on input key press
   * @param event key event
   */
  inputkeyDownListener(event: any) {
    if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
      const selection = document.getSelection();
      if (selection) {
        const index = Number(event.target.getAttribute('index'));
        event.target.setAttribute('lastAnchorOffset', JSON.stringify(selection.anchorOffset));
        const lastAnchorOffset = event.target.getAttribute('lastAnchorOffset');
        if (
          (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37) &&
          selection.anchorOffset === 0 &&
          selection.anchorOffset.toString() === lastAnchorOffset
        ) {
          const lastInput = this.dateInputs.toArray()[index - 1];
          if (lastInput) lastInput.nativeElement.focus();
          return;
        }
        if (
          event.keyCode === 39 &&
          selection.anchorOffset === event.target.innerText.length &&
          lastAnchorOffset === selection.anchorOffset.toString()
        ) {
          const nextInput = this.dateInputs.toArray()[index + 1];
          if (nextInput) nextInput.nativeElement.focus();
          return;
        }
      }
    }
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
   * sets error messages
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

  /**
   * on date picker open and close
   * @param event details native element event
   * @param details native element
   */
  onToggle(event: any, details: any) {
    if (this.readonly || this.disable || this.endContentClicked) {
      this.endContentClicked = false;
      details.removeAttribute('open');
      return;
    }
    this.focused = true;
    if (event.target.open) {
      this.showCalendar = true;
      if (this.valueIsArray) {
        this.setSelectedMonth(this.value[0] ? this.value[0] : new Date());
      } else {
        this.setSelectedMonth(this.value ? this.value : new Date());
      }
      this.toggleListeners('add');
    } else {
      this.showCalendar = false;
      this.toggleListeners('remove');
    }
  }

  /**
   * control value accessor methods for forms
   */
  writeValue(value: any) {
    if (!this.range) {
      this.value = value;
      if (this.value) {
        this.value = new Date(value);
        this.setSelectedMonth(this.value);
      }
    } else {
      this.value = value;
      if (this.value && this.value[0] && this.value[1]) {
        this.value = [new Date(this.value[0]), new Date(this.value[1])];
      } else {
        this.value = [];
        this.rangeClickedCount = 0;
      }
      this.setSelectedMonth(this.value[0] ? this.value[0] : new Date());
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {
    // not implemented
  };
  onTouch: any = () => {
    // not implemented
  };
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /**
   * set the month selected by the user
   */
  setSelectedMonth(date: Date) {
    this.currentDate.day = date.getDate();
    this.currentDate.month = date.getMonth();
    this.currentDate.year = date.getFullYear();

    this.selectedMonth = this.calendarData.months[this.currentDate.month] + ' ' + this.currentDate.year.toString();
    this.setAmountDays();
  }

  /**
   * sets the amount of days for the calendar
   */
  setAmountDays() {
    this.daysInMonth = new Date(this.currentDate.year, this.currentDate.month + 1, 0).getDate();
    this.calendarData.days = new Array(this.daysInMonth);
    for (let i = 0; i < this.calendarData.days.length; i++) {
      this.calendarData.days[i] = i + 1;
    }

    const ofssetDays = new Date(this.currentDate.year, this.currentDate.month, 1).getDay();
    for (let i = 0; i < ofssetDays; i++) {
      this.calendarData.days.unshift('');
    }
  }

  /**
   * sets the amount of years in the calendar
   */
  setAmountYears() {
    const years = [];
    for (let index = 0; index < 12; index++) {
      years.push(this.initialYear + index);
    }
    this.calendarData.years = years;
  }

  /**
   * go to previous month or year in the calendar
   */
  goPrev() {
    if (this.currentView === 'days') {
      this.goToPrevMonth();
    } else {
      this.goToPrevYears();
    }
  }
  /**
   * go to next month or year in the calendar
   */
  goNext() {
    if (this.currentView === 'days') {
      this.goToNextMonth();
    } else {
      this.goToNextYears();
    }
  }
  /**
   * go to previous 10 years in the calendar
   */
  goToPrevYears() {
    this.initialYear -= 10;
    this.setAmountYears();
  }
  /**
   * go to next 10 years in the calendar
   */
  goToNextYears() {
    this.initialYear += 10;
    this.setAmountYears();
  }
  /**
   * go to previous month in the calendar
   */
  goToPrevMonth() {
    this.currentDate.month--;
    if (this.currentDate.month < 0) {
      this.currentDate.month = 11;
      this.currentDate.year--;
    }
    this.selectedMonth = this.calendarData.months[this.currentDate.month] + ' ' + this.currentDate.year;
    this.setAmountDays();
  }
  /**
   * go to next month in the calendar
   */
  goToNextMonth() {
    this.currentDate.month++;
    if (this.currentDate.month > 11) {
      this.currentDate.month = 0;
      this.currentDate.year++;
    }
    this.selectedMonth = this.calendarData.months[this.currentDate.month] + ' ' + this.currentDate.year;
    this.setAmountDays();
  }

  /**
   * on day selected
   */
  selectDate(data: { day?: any; details?: any; reset?: boolean; date?: Date }) {
    const { details, reset, date } = data;
    let { day } = data;
    let month = this.currentDate.month;
    let year = this.currentDate.year;
    let hour = 0;
    let minute = 0;
    let sec = 0;
    if (date) {
      day = date.getDate();
      month = date.getMonth();
      year = date.getFullYear();
      hour = date.getHours();
      minute = date.getMinutes();
      sec = date.getSeconds();
    } else {
      if (this.range) {
        hour = this.value ? this.value[this.rangeClickedCount]?.getHours() || 0 : 0;
        minute = this.value ? this.value[this.rangeClickedCount]?.getMinutes() || 0 : 0;
        sec = this.value ? this.value[this.rangeClickedCount]?.getSeconds() || 0 : 0;
      } else {
        hour = this.value?.getHours() || 0;
        minute = this.value?.getMinutes() || 0;
        sec = this.value?.getSeconds() || 0;
      }
    }
    if (reset) {
      this.value = null;
      this.onTouch();
      this.onChange(this.value);
      this.dateChange.emit(this.value);
      return;
    }
    if (day === '') {
      return;
    }
    if (!this.range) {
      if (details) details.removeAttribute('open');
      this.value = new Date(year, month, day, hour, minute, sec, 0);
      this.onTouch();
      this.onChange(this.value);
      this.dateChange.emit(this.value);
    } else {
      if (!this.value) {
        this.value = new Array(2);
      }
      const newValue = new Date(year, month, day, hour, minute, sec, 0);
      this.value[this.rangeClickedCount] = newValue;
      if (this.rangeClickedCount < 1) {
        this.rangeClickedCount++;
        if (this.value[1]) {
          this.value[1] = null;
        }
      } else {
        this.rangeClickedCount = 0;
        if (this.value[1] < this.value[0]) {
          this.value[1] = null;
          this.rangeClickedCount = 1;
        }
        if (details) details.removeAttribute('open');
      }
      this.onTouch();
      this.onChange(this.value);
      this.dateChange.emit(this.value);
    }
  }

  /**select year */
  selectYear(yearItem: number) {
    this.currentDate.year = yearItem;
    this.currentView = 'month';
    if (this.yearPicker) {
      this.currentDate.month = 0;
      this.selectDate({ day: 1 });
      this.currentView = 'year';
    }
    this.setSelectedMonth(new Date(this.currentDate.year, this.currentDate.month, this.currentDate.day));
  }

  /**select month */
  selectDay(data: { day: any; details?: any }) {
    const { day, details } = data;
    this.currentDate.day = day;
    if (this.datetimePicker) {
      this.currentView = 'time';
      setTimeout(() => {
        if (this.hoursContainer.nativeElement && this.minutesContainer) {
          const selectedHours = this.hoursContainer.nativeElement.querySelector('.selected-item');
          const selectedMinutes = this.minutesContainer.nativeElement.querySelector('.selected-item');
          if (selectedHours) selectedHours.scrollIntoView();
          if (selectedMinutes) selectedMinutes.scrollIntoView();
        }
      }, 0);
    } else {
      this.selectDate({ day, details });
    }
  }
  /**select month */
  selectMonth(index: number) {
    this.currentDate.month = index;
    this.currentView = 'days';
    if (this.monthPicker) {
      this.selectDate({ day: 1 });
      this.currentView = 'month';
    } else if (this.monthYearPicker) {
      this.selectDate({ day: 1 });
      this.currentView = 'year';
    }
    this.setSelectedMonth(new Date(this.currentDate.year, this.currentDate.month, this.currentDate.day));
  }

  /**select time */
  selectTime(details: HTMLDetailsElement) {
    let hour = this.currentDate.hour;
    if (
      (this.currentDate.hour === 12 && this.currentDate.period === 'AM') ||
      (this.currentDate.hour !== 12 && this.currentDate.period === 'PM')
    ) {
      hour += 12;
    }
    const date = new Date(
      this.currentDate.year,
      this.currentDate.month,
      this.currentDate.day,
      hour,
      this.currentDate.minute
    );
    this.selectDate({ date, details });
    if (this.datetimePicker) {
      this.currentView = 'days';
    }
  }

  /**
   * Scroll the containers of hours
   * */
  scrollTime(container: HTMLDivElement, value: number) {
    container.scrollTop += value;
  }
  /**
   * on components destroy
   */
  ngOnDestroy(): void {
    this.inputSub.unsubscribe();
    if (this.valueSub) {
      this.valueSub.unsubscribe();
    }
    if (this.statusSub) {
      this.statusSub.unsubscribe();
    }

    this.dateInputs.forEach((input) => {
      input.nativeElement.removeEventListener('input', this.inputChangeListener.bind(this));
      input.nativeElement.removeEventListener('keypress', this.inputkeyPressListener.bind(this));
    });
  }
}
