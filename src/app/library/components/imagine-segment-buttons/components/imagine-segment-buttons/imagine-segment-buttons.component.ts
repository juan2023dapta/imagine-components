import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
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
  /**access segment buttons childs */
  @ContentChildren(ImagineSegmentButtonComponent) content!: QueryList<ImagineSegmentButtonComponent>;
  /**tells the parent segment changed */
  @Output() segmentChange = new EventEmitter();
  /**semgment buttons value */
  @Input() value: any | any[];
  /**semgment buttons multiple flag */
  @Input() multiple = false;
  /*Change the select style*/
  @Input() segmentStyle: 'buttons' | 'segment' | 'pill' = 'buttons';
  /**flag to know if show border */
  @Input() showBorderForSegment = true;
  /**flag to know if select first option automatic */
  @Input() selectFirstItemAuto = false;
  /**container styles */
  @Input() styles = {};
  /**form control name of control container */
  @Input() formControlName = '';
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

  /**
   *
   * @param changeDetectorRef change detector to avoid after view init error
   */
  constructor(private changeDetectroRef: ChangeDetectorRef) {}

  /**
   * get the complete style for container
   */
  get ngStyles() {
    return {
      display: 'flex',
      gap: '10px',
      ...this.styles,
    };
  }

  /**
   * after view init configuration for the component
   */
  ngAfterViewInit() {
    this.configureSegment();
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
      this.content.forEach((element) => {
        element.multiple = this.multiple;
        element.segmentStyle = this.segmentStyle;
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
      }, 0);
    }
    this.changeDetectroRef.detectChanges();
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
