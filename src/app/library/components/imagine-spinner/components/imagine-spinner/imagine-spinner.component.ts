import { Component, Input } from '@angular/core';

@Component({
  selector: 'imagine-spinner',
  styleUrls: ['./imagine-spinner.component.scss'],
  template: `
    <div
      class="spinner"
      [style.width]="size"
      [style.height]="size"
      [style.border-left-color]="'var(--imagine-' + color + '-color)'"
      [style.border-width]="borderWidth"
      [style.margin-right]="marginRight"
      [style.margin-left]="marginLeft"
      [style.margin-top]="marginTop"
      [style.margin-bottom]="marginBottom"></div>
  `,
})
export class ImagineSpinnerComponent {
  /** variables to manage the spinner styles */
  @Input() size = '36px';
  @Input() color = 'light';
  @Input() borderWidth = '4px';
  @Input() marginRight = '0';
  @Input() marginLeft = '0';
  @Input() marginTop = '0';
  @Input() marginBottom = '0';
}
