import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'imagine-accordion',
  templateUrl: './imagine-accordion.component.html',
  styleUrls: ['./imagine-accordion.component.scss'],
})
export class ImagineAccordionComponent implements OnInit, OnDestroy {
  /**access accordion container */
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  /**access accordion icon template */
  @ViewChild('iconTemplate') iconTemplate!: TemplateRef<any>;
  /**access accordion content div */
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;
  /**tells the parent when accordion is open or closed */
  @Output() accordionChange = new EventEmitter();
  /**when accordion is open or closed*/
  @Input() open = false;
  /**accordion type to know which content show */
  @Input() accordionType: 'normal' | 'floating' | 'hidden' = 'normal';
  /**accordion container style */
  @Input() accordionStyle = {};
  /**accordion inner content style */
  @Input() innerContentStyle = {};
  /**accordion container class */
  @Input() accordionClass = '';
  /**accordion inner content class */
  @Input() innerContentClass = '';
  /**move content in case is accordion type floating */
  @Input() contentMoveInX = '8px';
  @Input() contentMoveInY = '8px';
  /**show toggle icon */
  @Input() showAccordionIcon = true;
  /**block click */
  @Input() blockClick = false;

  /**
   *
   * @param eRef nativeElement ref of component
   */
  constructor(private eRef: ElementRef) {}

  /**
   * on component initialization
   */
  ngOnInit(): void {
    if (this.accordionType === 'floating') {
      document.addEventListener('mousedown', this.clickOutside);
    }
  }

  /**
   * checks when user clicks outside accordion
   * @param event click event
   */
  clickOutside = (event: any) => {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.open = false;
      this.accordionChange.emit(this.open);
    }
  };

  /**
   * changes accordion open or close
   */
  toggleAccordion() {
    setTimeout(() => {
      this.open = !this.open;
      this.accordionChange.emit(this.open);
      if (this.accordionType === 'floating') {
        if (this.open) {
          this.toggleTouchListener('add');
          this.toggleWheelListener('add');
        } else {
          this.toggleTouchListener('remove');
          this.toggleWheelListener('remove');
        }
      }
    }, 0);
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
   * when the accordion is touched
   * @param event touch event
   */
  onTouchListener = (event: any) => {
    if (this.container) {
      if (!this.container.nativeElement.contains(event.target)) {
        this.open = false;
        this.accordionChange.emit(this.open);
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
   * when document is on wheel
   * @param event wheel event
   */
  onWheelListener = (event: any) => {
    if (this.container) {
      if (!this.container.nativeElement.contains(event.target)) {
        this.open = false;
        this.accordionChange.emit(this.open);
        this.toggleWheelListener('remove');
      }
    }
  };

  /**
   * content style
   */
  get contentNgStyle() {
    return {
      height:
        this.accordionType === 'floating' ? this.content?.nativeElement.getBoundingClientRect().height + 'px' : '',
      top:
        this.accordionType === 'floating'
          ? this.distanceToBottom <= this.content?.nativeElement.getBoundingClientRect().height
            ? this.container?.nativeElement.getBoundingClientRect().top -
              parseInt(this.contentMoveInY) -
              this.content?.nativeElement.getBoundingClientRect().height +
              'px'
            : this.container?.nativeElement.getBoundingClientRect().top +
              parseInt(this.contentMoveInY) +
              this.container?.nativeElement.getBoundingClientRect().height +
              'px'
          : '',
      left:
        this.accordionType === 'floating'
          ? this.container?.nativeElement.getBoundingClientRect().left - parseFloat(this.contentMoveInX) + 'px'
          : '',
      width:
        this.accordionType === 'floating' ? this.container?.nativeElement.getBoundingClientRect().width + 'px' : '',
      ...this.innerContentStyle,
    };
  }

  /**
   * get distance of the select to screen bottom
   */
  get distanceToBottom() {
    const rect = this.container?.nativeElement.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    return bodyRect.bottom - rect?.bottom;
  }

  /**
   * on components destroy
   */
  ngOnDestroy(): void {
    document.removeEventListener('mousedown', this.clickOutside);
  }
}
