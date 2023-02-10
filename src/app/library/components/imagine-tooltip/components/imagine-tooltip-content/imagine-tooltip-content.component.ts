import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'imagine-tooltip-content',
  templateUrl: './imagine-tooltip-content.component.html',
  styleUrls: ['./imagine-tooltip-content.component.scss'],
})
export class ImagineTooltipContentComponent {
  /**
   * this component is the content for he tooltip directive
   */
  /**access tooltip container */
  @ViewChild('tooltipContent') tooltipContent!: ElementRef<HTMLElement>;
  /**flag to know if show tooltip */
  showTooltip = false;
  /**tooltip position */
  @Input() moveToBottom = '-10px';
  @Input() moveToLeft = '0px';
  top = '';
  left = '';
  /**tooltip style */
  @Input() width = '150px';
  @Input() showOrigin = true;
  @Input() boxShadow = true;
  @Input() maxHeightContent = '100px';
  @Input() heightContent = 'max-content';

  /**flag to know if tooltip was opened on click */
  openedOnClick = false;
}
