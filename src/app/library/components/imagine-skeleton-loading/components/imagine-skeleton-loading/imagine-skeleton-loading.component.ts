import { Component, Input } from '@angular/core';

@Component({
  selector: 'imagine-skeleton-loading',
  templateUrl: './imagine-skeleton-loading.component.html',
  styleUrls: ['./imagine-skeleton-loading.component.scss'],
})
export class ImagineSkeletonLoadingComponent {
  /**style attributes */
  @Input() width = '150px';
  @Input() height = '19px';
  @Input() borderRadius = '10px';
}
