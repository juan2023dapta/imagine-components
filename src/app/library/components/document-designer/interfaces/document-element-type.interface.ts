import { TemplateRef } from '@angular/core';

export interface DocumentElementType {
  type: string;
  class: any;
  disableCopy?: boolean;
  disableDelete?: boolean;
  disableResize?: boolean;
  allowedInstances?: number;
  blockMoveYPosition?: boolean;
  blockMoveXPosition?: boolean;
  style?: any;
  elementTemplate?: TemplateRef<any>;
}
