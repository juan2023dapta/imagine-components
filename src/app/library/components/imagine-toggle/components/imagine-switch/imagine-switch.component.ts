import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf,
  forwardRef,
} from '@angular/core';
import { AbstractControl, ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'imagine-switch',
  templateUrl: './imagine-switch.component.html',
  styleUrls: ['./imagine-switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagineSwitchComponent),
      multi: true,
    },
  ],
})
export class ImagineSwitchComponent {
  /**tells the parent valu changed */
  @Output() valueChange = new EventEmitter();
  /**toggle label */
  @Input() label = '';
  /**toggle value */
  @Input() value = false;
  /**toggle disable flag */
  @Input() disable = false;
  @Input() formControlName = '';
  /**toggle style */
  toggleStyle: 'ios' | 'md' = 'md';

  /**formc control */
  private control!: AbstractControl | null | undefined;

  /**
   *
   * @param controlContainer access to the control container
   * @param changeDetectroRef change detection reference to avoid after view init error
   */
  constructor(
    @Optional() @Host() @SkipSelf() private controlContainer: ControlContainer,
    private changeDetectroRef: ChangeDetectorRef
  ) {}

  /**
   * after view init
   */
  ngAfterViewInit() {
    this.configureForms();
  }

  /**
   * configure toggle forms
   */
  configureForms() {
    if (this.controlContainer) {
      if (this.formControlName) {
        this.control = this.controlContainer.control?.get(this.formControlName);
        this.value = this.control?.value;
        this.changeDetectroRef.detectChanges();
      }
    }
  }

  /**
   * Select an item an emit the value to the parent
   */
  toggle() {
    if (this.disable) {
      return;
    }
    this.value = !this.value;
    this.valueChange.emit(this.value);
    this.onTouch();
    this.onChange(this.value);
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {
    //not implemented
  };

  onTouch = () => {
    //not implemented
  };
}
