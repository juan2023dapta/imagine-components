import {
  AfterViewInit,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  Output,
  QueryList,
  EventEmitter,
  ViewChild,
  ElementRef,
  Optional,
  Host,
  SkipSelf,
  ChangeDetectorRef,
  OnDestroy,
  HostListener,
  OnInit,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { ImagineSelectOptionComponent } from '../imagine-select-option/imagine-select-option.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'imagine-select',
  templateUrl: './imagine-select.component.html',
  styleUrls: ['./imagine-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagineSelectComponent),
      multi: true,
    },
  ],
})
export class ImagineSelectComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  /**Access the select option components*/
  @ContentChildren(ImagineSelectOptionComponent)
  content!: QueryList<ImagineSelectOptionComponent>;

  /**Access the details html native element*/
  @ViewChild('details') details!: ElementRef<HTMLDetailsElement>;
  /**Access the list container that has select options components*/
  @ViewChild('listContainer') listContainer!: ElementRef<HTMLUListElement>;
  /**Access to the label content container of the input like icons or images */
  @ViewChild('labelContent') labelContent!: ElementRef<HTMLElement>;
  /**Access to the filter content container of the select*/
  @ViewChild('filterContent') filterContent!: ElementRef<HTMLElement>;

  /**Tells the parent when value changes */
  @Output() valueChange = new EventEmitter();
  /**Tells the parent when toggle changes */
  @Output() toggleChange = new EventEmitter();

  /**Sets the placeholder of the select */
  @Input('placeholder') selectTextContent = 'Select';
  /**Stores the initial placeholder */
  defaultPlaceholder = '';
  /**Sets the label of the select */
  @Input() label = '';
  /**Set the form field name of the select to show in errors messages */
  @Input() fieldName = '';
  /**Detect when value is changed in input */
  @Input('value') set valueHandler(value: any | any[]) {
    this.value = value;
    this.updateValueInChilds();
  }
  /**Select value */
  value: any | any[];
  /**Sets if the select is going to be of multiple selection */
  @Input() multiple = false;
  /**Sets the select readonly attribute */
  @Input() readonly = false;
  /**Sets to disable readonly attribute */
  @Input() disable = false;
  /**Flag to know if the user can clear selected item */
  @Input() canClearSelection = false;
  /** to know if show errors under select or in a tooltip*/
  @Input() messageErrorsType: 'classic' | 'tooltip' = 'tooltip';
  /** variables to set tooltip error size*/
  @Input() tooltipErrorWidth = '150px';
  /** variable to show tooltip error origin*/
  @Input() tooltipErrorShowOrigin = true;
  /** variables to set tooltip items size*/
  @Input() tooltipItemsWidth = '250px';
  @Input() tooltipItemsMaxHeightContent = '250px';
  /** flag to show tooltip items selected*/
  @Input() showTooltipItems = false;
  /** variable to show tooltip items origin*/
  @Input() tooltipItemsShowOrigin = false;
  /**Sets the background of the select */
  @Input() background = 'light';
  /**Variable to show or hide select arrow icon */
  @Input() showToggleIcon = true;
  /**Flag to know if show items selected count */
  @Input() showItemsCount = false;
  /**Flag to know if select its using pagination */
  @Input() usingPagination = false;
  /**Items name */
  @Input() itemsName = 'item';
  /**Reactive form control name */
  @Input() formControlName = '';
  /**Reactive form control name */
  @Input() formControl?: FormControl;
  /**Custom error messages to reactive forms validators */
  @Input() errorMessages: any = {};
  /**Flag to know if show error message inside component */
  @Input() showErrorMessages = true;
  /**Stores errors of reactive form */
  @Input() errors: any[] = [];
  /**ng styles */
  @Input() containerClass = '';
  @Input() summaryStyles = {};
  @Input() detailsStyles = {};
  @Input() optionsStyles = {};
  /**Variable to show or hide select options from parent */
  @Input() hideOptions = false;
  /**error messages class */
  @Input() errorMessagesClass = '';
  /**Variable to show or hide select options */
  showOptions = false;
  /**Flag to set if there are items in the select or not */
  noItems = false;
  /**Stores the selected items */
  selectedItems: any[] = [];
  /**Subscriptions */
  selectOptionChangesSub = new Subscription();
  itemsSelectedSub: Subscription[] = [];
  /**Reactive form control errors to show them in the select*/
  controlErrors!: ValidationErrors;
  /**Reactive form control value sub */
  valueSub: Subscription | undefined = new Subscription();
  /**Reactive form control status sub */
  statusSub: Subscription | undefined = new Subscription();
  /**To positional in item when navigating with keys */
  indexItemSelected = -1;
  /**Flag to know if select is focused */
  focused = false;
  /**Flag to know if end content was clicked */
  endContentClicked = false;
  /**Flag to know if current item exist in list */
  itemSelectedDontExist = false;
  /**last value selected */
  lastValue = '';
  /**no results on filter */
  noResults = false;

  /**
   *
   * @param controlContainer Reactive form control container
   * @param changeDetectroRef change detector service
   * @param eRef native element ref
   */
  constructor(
    @Optional() @Host() @SkipSelf() public controlContainer: ControlContainer,
    private changeDetectroRef: ChangeDetectorRef,
    private eRef: ElementRef
  ) {}

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
   * Detect if select has filter content
   */
  get filterContentExist() {
    return this.filterContent?.nativeElement.children.length > 0;
  }

  get _detailsStyles() {
    return {
      'margin-top': this.label ? '10px' : '0',
      background: 'var(--app-' + this.background + '-color)',
      ...this.detailsStyles,
    };
  }

  optionsContainerSize = {
    width: '0px',
  };

  optionsContainerStyle = {
    top: '0px',
    opacity: '0',
    ...this.optionsContainerSize,
    ...this.optionsStyles,
  };

  /**
   * get distance of the select to screen bottom
   */
  get distanceToBottom() {
    const rect = this.details.nativeElement.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    return bodyRect.bottom - rect.bottom;
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
   * On init component
   */
  ngOnInit(): void {
    this.defaultPlaceholder = this.selectTextContent;
  }

  /**
   * toggles add event listeners
   * @param action tells to add or remove
   */
  toggleListeners(action: 'add' | 'remove') {
    this.toggleNavigateItemsListener(action);
    this.toggleWheelListener(action);
    this.toggleTouchListener(action);
  }

  /**
   *
   * @param event on mouse down event
   */
  @HostListener('document:mousedown', ['$event'])
  click(event: any) {
    if (this.hideOptions) {
      return;
    }
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showOptions = false;
      this.closeDetails();
      if (this.focused) {
        this.onTouch();
        this.focused = false;
      }
    } else {
      if (!this.disable && !this.readonly) {
        this.showOptions = true;
        this.focused = true;
      }
    }
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

  onTouchListener = (event: any) => {
    if (this.listContainer) {
      if (!this.listContainer.nativeElement.contains(event.target)) {
        this.showOptions = false;
        this.closeDetails();
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

  onWheelListener = (event: any) => {
    if (this.listContainer) {
      if (!this.listContainer.nativeElement.contains(event.target)) {
        this.showOptions = false;
        this.closeDetails();
        this.toggleWheelListener('remove');
      }
    }
  };

  /**
   * Keydown listener add to navigate between options or remove for better performance
   * @param action add or remove on Keydown listener
   */
  toggleNavigateItemsListener(action: 'add' | 'remove') {
    if (action === 'add') {
      this.details.nativeElement.addEventListener('keydown', this.onNavigate);
    } else {
      this.details.nativeElement.removeEventListener('keydown', this.onNavigate);
    }
  }

  onNavigate = (event: KeyboardEvent) => {
    if (this.details.nativeElement.open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
        if (event.key === 'ArrowDown') {
          this.arrowDownPressedOnNavigate();
        } else if (event.key === 'ArrowUp') {
          this.arrowUpPressedOnNavigate();
        } else if (event.key === 'Enter') {
          this.content.forEach((item) => {
            if (item.over) {
              item.change();
            }
          });
        }
        event.preventDefault();
      }
    }
  };
  /**
   * Executes when the user is navigating with the keys
   */
  arrowDownPressedOnNavigate() {
    if (this.indexItemSelected + 1 < this.content.length) {
      this.indexItemSelected++;
    } else {
      this.indexItemSelected = 0;
    }
    this.content.forEach((item, i) => {
      if (i === this.indexItemSelected) {
        item.over = true;
        this.listContainer.nativeElement.scrollTop = 39 * i;
      } else {
        item.over = false;
      }
    });
  }

  /**
   * Executes when the user is navigating with the keys
   */
  arrowUpPressedOnNavigate() {
    if (this.indexItemSelected > 0) {
      this.indexItemSelected--;
    } else {
      this.indexItemSelected = this.content.length - 1;
    }

    this.content.forEach((item, i) => {
      if (i === this.indexItemSelected) {
        item.over = true;
        this.listContainer.nativeElement.scrollTop = 39 * i;
      } else {
        item.over = false;
      }
    });
  }

  /**
   * Control value accesor interface methods
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {
    //not implemented
  };
  onTouch: any = () => {
    //not implemented
  };

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

  /**
   * After component init
   */
  ngAfterViewInit() {
    this.configureSelect();
    this.selectOptionChangesSub = this.content.changes.subscribe(() => {
      this.itemsSelectedSub.forEach((sub) => {
        sub.unsubscribe();
      });
      this.itemsSelectedSub = [];
      this.configureSelect();
      this.updateValueInChilds();
    });
    this.configureErrorMessages();
  }

  /**
   * Configure error messages of the component
   */
  configureErrorMessages() {
    if (this.fieldName === '') {
      this.fieldName = this.label;
    }
    if (this.controlContainer) {
      this.setErrors();

      this.valueSub = this.controlContainer.control?.get(this.formControlName)?.valueChanges.subscribe(() => {
        this.setErrors();
      });

      this.statusSub = this.controlContainer.control?.get(this.formControlName)?.statusChanges.subscribe(() => {
        this.setErrors();
      });
    }
  }

  /**
   * Set errors of the reactive form
   */
  setErrors() {
    this.controlErrors = this.controlContainer.control?.get(this.formControlName)?.errors as any;
    if (!this.controlErrors) {
      if (this.value && this.itemSelectedDontExist) {
        this.controlContainer.control?.get(this.formControlName)?.setErrors({ required: true });
        this.controlErrors = this.controlContainer.control?.get(this.formControlName)?.errors as any;
      }
    }
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
   * Basic configuration for select
   */
  configureSelect() {
    if (this.content.length === 0) {
      this.noItems = true;
    } else {
      this.noItems = false;
      let contentHasValue = false;
      this.content.forEach((element) => {
        if (element.value === this.value) {
          contentHasValue = true;
        }
        element.multiple = this.multiple;
        const subscription = element.itemSelected.subscribe(() => {
          this.selectItem({ item: element, itemClicked: true });
        });
        this.itemsSelectedSub.push(subscription);
      });
      if (contentHasValue) {
        this.selectItemByValue(this.value);
      } else {
        this.selectItem({ item: null, preventOnTouch: true });
      }
    }
    this.changeDetectroRef.detectChanges();
  }

  /**
   * Select an item an emit the value to the parent
   */
  selectItem(data: { item: any; itemClicked?: boolean; preventOnChange?: boolean; preventOnTouch?: boolean }) {
    const { item, itemClicked, preventOnChange, preventOnTouch } = data;
    if (itemClicked && item && item.value === this.value) {
      return;
    }
    if (!this.multiple) {
      if (!item) {
        this.selectTextContent = this.defaultPlaceholder;
        this.value = null;
        if (!preventOnTouch) {
          this.onTouch();
        }
        if (!preventOnChange) {
          this.onChange(null);
          this.valueChange.emit(null);
        }
        if (this.details && !this.usingPagination) {
          this.closeDetails();
        }
        this.updateValueInChilds();
        return;
      }
      this.value = item.value;
      this.lastValue = this.value;
      if (this.details) {
        this.closeDetails();
      }
      if (itemClicked) {
        this.showOptions = false;
      }
      this.updateValueInChilds();
      if (!preventOnTouch) {
        this.onTouch();
      }
      if (!preventOnChange) {
        this.onChange(this.value);
        this.valueChange.emit(this.value);
      }
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

      this.updateValueInChilds();
      if (!preventOnTouch) {
        this.onTouch();
      }
      if (!preventOnChange) {
        this.onChange(this.value);
        this.valueChange.emit(this.value);
      }
    }

    if (this.focused) {
      this.onTouch();
    }
  }

  /**
   * Unselects the item we want
   * @param item item to be unselected
   */
  unSelectItem(item: any) {
    this.selectItem({ item });
  }

  /**
   * Select item by value
   * @param value new value to be selected
   */
  selectItemByValue(value: string) {
    if (!this.multiple) {
      const item = this.content.find((itemObject) => value === itemObject.value);
      if (item) {
        if (this.lastValue && this.lastValue === item.value) {
          return;
        }
        this.selectItem({ item, preventOnTouch: true });
      }
    } else {
      this.updateValueInChilds();
      this.valueChange.emit(this.value);
      this.onChange(this.value);
    }
  }
  /**
   * On toggle details element
   * @param event details toggle event
   * @returns
   */
  onToggle(event: any) {
    this.optionsContainerStyle.opacity = '0';
    if (this.readonly || this.disable || this.endContentClicked) {
      this.showOptions = false;
      this.closeDetails();
      this.endContentClicked = false;
      return;
    }
    this.focused = true;
    this.content.forEach((item, i) => {
      if (item.selected) {
        if (this.listContainer) this.listContainer.nativeElement.scrollTop = i * 39;
        this.indexItemSelected = i;
      }
    });
    if (event.target.open) {
      this.showOptions = true;
      this.toggleListeners('add');
      setTimeout(() => {
        this.setOptionsContainerStyle();
      }, 0);
    } else {
      this.showOptions = false;
      this.toggleListeners('remove');
    }
    this.toggleChange.emit(this.showOptions);
  }

  /**
   * set options container style
   */
  setOptionsContainerStyle() {
    this.optionsContainerSize.width = this.details.nativeElement.getBoundingClientRect().width + 'px';
    this.optionsContainerStyle = {
      top:
        this.distanceToBottom <= 200
          ? this.details.nativeElement.getBoundingClientRect().top -
              this.listContainer.nativeElement.getBoundingClientRect().height >
            0
            ? this.details.nativeElement.getBoundingClientRect().top -
              this.listContainer.nativeElement.getBoundingClientRect().height +
              'px'
            : this.details.nativeElement.getBoundingClientRect().top -
              this.listContainer.nativeElement.getBoundingClientRect().height +
              this.listContainer.nativeElement.getBoundingClientRect().height / 2 +
              'px'
          : this.details.nativeElement.getBoundingClientRect().top +
            this.details.nativeElement.getBoundingClientRect().height +
            8 +
            'px',
      opacity: '1',
      ...this.optionsContainerSize,
      ...this.optionsStyles,
    };
  }

  /**
   * Resets the value
   */
  reset() {
    this.value = null;
    this.selectTextContent = this.defaultPlaceholder;
    this.updateValueInChilds();
    this.valueChange.emit(this.value);
    this.onChange(this.value);
  }

  /**
   * Updates the selection
   * @param data to know if excute on change value
   */
  updateValueInChilds() {
    if (this.multiple) {
      this.updateOptionsSelectionMultiple();
    } else {
      this.updateOptionSelected();
    }
  }

  /**
   * Update the selected options when is multiple
   */
  updateOptionsSelectionMultiple() {
    this.content?.forEach((element) => {
      if (this.multiple) {
        const index = this.selectedItems.findIndex((item) => item.value === element.value);
        if (this.value && this.value.includes(element.value)) {
          element.selected = true;
          if (index === -1) {
            this.selectedItems.push(element);
          }
        } else {
          element.selected = false;
          if (index !== -1) {
            this.selectedItems.splice(index, 1);
          }
        }
        if (this.selectedItems.length === 0) {
          this.selectTextContent = this.defaultPlaceholder;
        } else {
          if (!this.showItemsCount) {
            this.selectTextContent = this.selectedItems.map((item) => item.textContentOption).join(', ');
          }
        }
        if (this.showItemsCount && this.value && this.value.length) {
          this.selectTextContent = `${this.value.length} ${this.itemsName}${
            this.value.length === 1 ? '' : 's'
          } selected`;
        }
      }
      element.changeDetectorRef.detectChanges();
    });
  }

  /**
   * Update the selected option
   */
  updateOptionSelected() {
    let selectedItem: any;
    this.content?.forEach((element) => {
      if (this.value && this.value === element.value) {
        element.selected = true;
        selectedItem = element;
        this.selectTextContent = element.textContentOption || '';
      } else {
        element.selected = false;
      }
      if (!selectedItem) {
        this.selectTextContent = this.defaultPlaceholder;
      }
      this.itemSelectedDontExist = !selectedItem;
      element.changeDetectorRef.detectChanges();
    });
  }

  /**close details native element */
  closeDetails() {
    this.details.nativeElement.removeAttribute('open');
  }

  /**
   * Filter picker while writing
   * @param inputValue string value tha emits the input
   */
  filterOptions(inputValue: string) {
    if (this.usingPagination || this.disable || this.readonly) {
      return;
    }
    if (!inputValue || inputValue === '') {
      this.noResults = false;
      for (const option of this.content) {
        option.hidden = false;
      }
    } else {
      let countResults = 0;
      for (const option of this.content) {
        if (option.textContentOption && !option.textContentOption.toLowerCase().includes(inputValue.toLowerCase())) {
          option.hidden = true;
        } else {
          countResults++;
          option.hidden = false;
        }
      }
      if (countResults === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
        const optionMatch = this.content
          .filter((option) => !option.hidden)
          .find(
            (option) => option.textContentOption && option.textContentOption.toLowerCase() === inputValue.toLowerCase()
          );
        if (optionMatch) {
          if (this.multiple) {
            this.selectItem({ item: optionMatch });
          } else {
            this.selectItem({ item: optionMatch });
          }
        }
      }
    }
    this.showOptions = true;
  }

  /**
   * Unsubscribes
   */
  ngOnDestroy(): void {
    this.selectOptionChangesSub.unsubscribe();
    this.itemsSelectedSub.forEach((sub) => {
      sub.unsubscribe();
    });
    if (this.valueSub) {
      this.valueSub.unsubscribe();
    }
    if (this.statusSub) {
      this.statusSub.unsubscribe();
    }
  }
}
