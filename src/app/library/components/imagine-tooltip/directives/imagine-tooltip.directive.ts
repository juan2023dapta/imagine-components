import {
  AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ImagineTooltipContentComponent } from '../components/imagine-tooltip-content/imagine-tooltip-content.component';

@Directive({
  selector: '[imagineTooltip]',
})
export class ImagineTooltipDirective implements OnInit, AfterViewInit, OnDestroy {
  /**access tooltip content component child element */
  @ContentChild(ImagineTooltipContentComponent)
  tooltipContentComponent!: ImagineTooltipContentComponent;

  /**flag to know if just open tooltip on click */
  @Input() openOnClick = false;

  /**tooltip content inserted by input */
  @Input() tooltipContentFromParent!: ImagineTooltipContentComponent;

  /**
   *
   * @param elementRef native element reference
   */
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  /**
   * on component init
   */
  ngOnInit(): void {
    this.elementRef.nativeElement.style.cursor = 'pointer';
  }

  /**
   * after component view init
   */
  ngAfterViewInit(): void {
    if (!this.tooltipContentComponent && this.tooltipContentFromParent) {
      this.tooltipContentComponent = this.tooltipContentFromParent;
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
   * on touch outside
   * @param event touch event
   */
  onTouchListener = (event: any) => {
    if (this.tooltipContentComponent && this.tooltipContentComponent.tooltipContent) {
      if (!this.tooltipContentComponent.tooltipContent.nativeElement.contains(event.target)) {
        this.tooltipContentComponent.showTooltip = false;
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
   * on wheel document
   * @param event wheel event
   */
  onWheelListener = (event: any) => {
    if (this.tooltipContentComponent && this.tooltipContentComponent.tooltipContent) {
      if (!this.tooltipContentComponent.tooltipContent.nativeElement.contains(event.target)) {
        this.tooltipContentComponent.showTooltip = false;
        this.toggleWheelListener('remove');
      }
    }
  };

  /**
   * on mouse down
   * @param event mouse event
   */
  @HostListener('document:mousedown', ['$event'])
  click(event: any) {
    if (!this.tooltipContentComponent) {
      return;
    }
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.tooltipContentComponent.openedOnClick = false;
      this.tooltipContentComponent.showTooltip = false;
      this.toggleListeners('remove');
    } else {
      this.tooltipContentComponent.openedOnClick = true;
      this.showTooltip();
    }
  }

  /**
   * on mouse enter
   */
  @HostListener('mouseenter') onMouseEnter(): void {
    if (this.openOnClick || !this.tooltipContentComponent) {
      return;
    }
    this.tooltipContentComponent.openedOnClick = false;
    this.showTooltip();
  }

  /**
   * on mouse leave
   */
  @HostListener('mouseleave') onMouseOut(): void {
    this.hideTooltip();
  }

  /**
   * shows tooltip
   */
  showTooltip() {
    if (!this.tooltipContentComponent || this.tooltipContentComponent?.showTooltip) {
      return;
    }
    this.toggleListeners('add');
    this.tooltipContentComponent.showTooltip = true;
    setTimeout(() => {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      this.tooltipContentComponent.top =
        rect.top +
        parseInt(this.tooltipContentComponent.moveToBottom) -
        this.tooltipContentComponent.tooltipContent?.nativeElement.clientHeight +
        'px';
      this.tooltipContentComponent.left =
        rect.left +
        parseInt(this.tooltipContentComponent.moveToLeft) -
        this.tooltipContentComponent.tooltipContent?.nativeElement.clientWidth / 2 +
        this.elementRef.nativeElement.clientWidth / 2 +
        'px';
    }, 0);
  }

  /**
   * hiddes the tooltip
   * @param data force hide on other components
   */
  hideTooltip(data?: { forceHide: boolean }) {
    if (!this.tooltipContentComponent || (!data?.forceHide && this.tooltipContentComponent?.openedOnClick)) {
      return;
    }
    this.toggleListeners('remove');
    this.tooltipContentComponent.showTooltip = false;
  }

  /**
   * on component destroy
   */
  ngOnDestroy(): void {
    this.toggleListeners('remove');
  }
}
