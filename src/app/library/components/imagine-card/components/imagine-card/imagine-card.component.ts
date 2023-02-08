import { Component, Input } from '@angular/core';

@Component({
  selector: 'imagine-card',
  templateUrl: './imagine-card.component.html',
  styleUrls: ['./imagine-card.component.scss'],
})
export class ImagineCardComponent {
  /**container class to be accesed from outside */
  @Input() containerClass = '';
  /**card style from outside */
  @Input() style = {};
  /**
   * sets ng style of the card
   */
  get ngStyle() {
    return this.style;
  }
}
