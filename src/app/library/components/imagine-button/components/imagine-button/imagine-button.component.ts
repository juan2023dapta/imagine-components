import { Component, Input } from '@angular/core';

@Component({
  selector: 'imagine-button',
  templateUrl: './imagine-button.component.html',
  styleUrls: ['./imagine-button.component.scss'],
})
export class ImagineButtonComponent {
  /**button attributes */
  @Input() width = '100%';
  @Input() disable = false;
  @Input() useDisableClass = true;
  @Input() buttonHover = true;
  /**button style from outside */
  @Input() buttonStyle = {};
  /**button style from outside */
  @Input() buttonClass = '';
  /**background */
  @Input() background = 'primary';
  /**background */
  @Input() textColor = '';

  /**background class */
  get backgroundClass() {
    return `imagine-button--${this.background}`;
  }
  /**text class */
  get textColorClass() {
    return this.textColor ? `imagine-button--${this.textColor}-text` : '';
  }

  /**
   * onclick event
   * @param event click event
   */
  onClick(event: Event) {
    if (this.disable) {
      event.stopPropagation();
    }
  }
}
