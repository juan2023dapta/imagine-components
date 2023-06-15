export interface ImaginePopUpConfig {
  component?: any;
  templateRef?: any;
  componentProps?: any;
  styles?: any;
  containerStyles?: any;
}

export interface ImaginePopUpInternalConfig extends ImaginePopUpConfig {
  animation?: string;
  showingPopUp?: boolean;
}
