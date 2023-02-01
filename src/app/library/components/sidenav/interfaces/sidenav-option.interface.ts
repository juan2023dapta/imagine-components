export interface SidenavRoute {
  link: string;
  name: string;
  checked?: boolean | null;
  touched?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  subRoutes?: any[];
}
