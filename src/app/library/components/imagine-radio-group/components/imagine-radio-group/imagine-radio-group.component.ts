import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  Optional,
  Output,
  QueryList,
  SkipSelf,
} from '@angular/core';
import { AbstractControl, ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImagineRadioComponent } from '../imagine-radio/imagine-radio.component';

@Component({
  selector: 'imagine-radio-group',
  templateUrl: './imagine-radio-group.component.html',
  styleUrls: ['./imagine-radio-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagineRadioGroupComponent),
      multi: true,
    },
  ],
})
export class ImagineRadioGroupComponent {
  @ContentChildren(ImagineRadioComponent) content!: QueryList<ImagineRadioComponent>;
  @ContentChild('div') contentDiv!: any;
  @Output() valueChange = new EventEmitter();
  radioButtons: any[] = [];
  @Input() value: any;
  @Input() containerClass = '';
  itemsSelectedSub: Subscription[] = [];

  isDisabled = false;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {
    //not implemented
  };
  onTouch: any = () => {
    //not implemented
  };
  unique = new Date().getTime();

  @Input() formControlName = '';

  private control!: AbstractControl | null | undefined;
  translateOptions!: string;
  showOptions = false;

  constructor(
    @Optional() @Host() @SkipSelf() private controlContainer: ControlContainer,
    private changeDetectroRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.configureRadio();
  }
  configureRadio() {
    if (this.content.length !== 0) {
      this.content.forEach((element) => {
        this.radioButtons.push(element);
        element.changeDetectorRef.detectChanges();
        const subscription = element.itemSelected.subscribe((value: any) => {
          const item = this.radioButtons.find((item) => value === item.value);
          this.selectItem({ item });
        });
        this.itemsSelectedSub.push(subscription);
      });
      if (this.value) {
        const item = this.radioButtons.find((item) => this.value === item.value);
        this.selectItem({ item, preventOnTouch: true });
      }
    }
    this.changeDetectroRef.detectChanges();
  }

  updateValueInChilds() {
    this.content?.forEach((element) => {
      if (this.value === element.value) {
        element.selected = true;
      } else {
        element.selected = false;
      }
      element.changeDetectorRef.detectChanges();
    });
  }

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
  selectItem(data: { item: { name: string; value: string }; preventOnTouch?: boolean }) {
    this.value = data.item?.value;
    this.updateValueInChilds();
    this.valueChange.emit(this.value);
    if (!data.preventOnTouch) {
      this.onTouch();
    }
    this.onChange(this.value);
  }
}
