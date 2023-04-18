export interface ImaginePaginationConfig {
  currentPage: number;
  results: number;
  lastPage: number;
  paginationSize: number;
  localPagination: boolean;
}

export interface ImagineTableConfig {
  editAction?: boolean;
  deleteAction?: boolean;
  paginationConfig?: any;
  actionsTitle?: string | null;
  colDefs: ImagineTableColDef[];
  hideHeader?: boolean;
  hideRowPointer?: boolean;
}
export interface ImagineTableLoadingConfig {
  loadingData: boolean;
  rowsNumber?: number;
  skeletonHeight?: string;
}

export interface ImagineTableColDef {
  name: string;
  displayName: string;
  headerTemplateName?: string;
  columnFunctionFormat?: any;
  columnTemplateName?: string;
  stopClickPropagation?: boolean;
  columnStyle?: any;
  headerStyle?: any;
}
