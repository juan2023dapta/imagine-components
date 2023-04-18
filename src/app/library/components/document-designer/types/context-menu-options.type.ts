export type ContextMenuOptions = 'Paste' | 'Copy' | 'Delete';

export type TableContextMenuOptions =
  | 'Borders'
  | 'Border Top'
  | 'Border Right'
  | 'Border Left'
  | 'Border Bottom'
  | 'Column'
  | 'Add Column'
  | 'Delete Column'
  | 'Merge Columns Cells'
  | 'Unmerge Columns Cells'
  | 'Cell'
  | 'Add Cell'
  | 'Delete Cell'
  | 'Row'
  | 'Add Row'
  | 'Delete Row'
  | 'Merge Rows Cells'
  | 'Unmerge Rows Cells'
  | 'Text'
  | 'Edit Text'
  | 'Add Text'
  | 'Remove Text'
  | 'Table'
  | 'Delete Table'
  | 'Copy Table';

export type AllContextMenuOptions = ContextMenuOptions | TableContextMenuOptions;
