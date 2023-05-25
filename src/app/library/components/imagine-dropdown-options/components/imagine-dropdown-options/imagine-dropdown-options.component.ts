import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ImagineDropDownOption } from '../../interfaces/imagine-dropdown-options.interface';

@Component({
  selector: 'imagine-dropdown-options',
  templateUrl: './imagine-dropdown-options.component.html',
  styleUrls: ['./imagine-dropdown-options.component.scss'],
})
export class ImagineDropdownOptionsComponent {
  /**option Selected */
  @Output() optionSelected = new EventEmitter();
  /**To open the dropdown from the parent component */
  @Input() options: ImagineDropDownOption[] = [];
  @Input() isOpen = false;

  /**
   *
   * @param eRef element reference of this component
   */
  constructor(private eRef: ElementRef) {}

  /**
   *Checks when it's clicked outside this component to close it
   */
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  /**
   *If its open the dropdown its close and if its close the dropdown its open
   */
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
