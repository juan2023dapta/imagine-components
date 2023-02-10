import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'imagine-tooltip',
  templateUrl: './imagine-tooltip.component.html',
  styleUrls: ['./imagine-tooltip.component.scss'],
})
export class ImagineTooltipComponent {
  /**tells the parent tooltip show changed */
  @Output() toolTipShown = new EventEmitter();
  /**handler to know if show tooltip */
  @Input('showTooltip') set showTooltipHandler(value: boolean) {
    this.fadeIn = value;
    this.showTooltip = value;
  }
  /**flag to know if show tooltip */
  showTooltip = false;
  /**tooltip posiion */
  @Input() left = '10px';
  @Input() bottom = '20px';
  @Input() top = '';
  /**tooltip styles */
  @Input() width = '150px';
  @Input() showOrigin = true;
  @Input() boxShadow = true;
  @Input() maxHeightContent = '95px';
  @Input() heightContent = '';
  /**tooltip animations */
  @Input() fadeOut = false;
  @Input() animationFadeIn = true;
  @Input() fadeIn = false;
  /**flag to know if just open tooltip on click */
  @Input() openOnClick = false;
  /**flag to know if outside was clicked */
  outsideClicked = false;

  /**
   *
   * @param eRef native element reference
   */
  constructor(private eRef: ElementRef) {}

  /**
   * on click out
   * @param event mouse event
   */
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showTooltip = false;
      this.outsideClicked = false;
    }
  }

  /**
   * open the tooltip on click
   * @param event click event
   */
  openOnClicked(event: Event) {
    event.stopPropagation();
    this.outsideClicked = true;
    this.toolTipShown.emit(true);
  }

  /**
   * open on hover
   */
  overToolTip() {
    if (this.openOnClick) {
      return;
    }
    this.toolTipShown.emit(true);
    this.showTooltip = true;
  }

  /**
   * close tooltip
   */
  notOverTooltip() {
    if (this.outsideClicked) {
      return;
    }
    this.showTooltip = false;
  }
}
