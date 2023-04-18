import { AllContextMenuOptions } from '../types/context-menu-options.type';

export interface ContextMenuOption {
  option: AllContextMenuOptions;
  icon?: string;
  iconColor?: string;
  subOptions?: ContextMenuOption[];
  showSubOptions?: boolean;
}
