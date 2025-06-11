import React from 'react'
import { CellProps } from "./Cell";
import { DataTableColumn } from 'mantine-datatable';
import { FilterStrategyType } from './FilterStrategy';

export type ColumnProps<T> = DataTableColumn<T> & {
  key?: string;
  render?: (cellProps: CellProps<T>) =>  JSX.Element
  onClickHandler?: (e?: any) => void;
  onDblClickHandler?: (e?: any) => void;
  onDrag?: (e?: any) => void;
  onDrop?: (e?: any) => void;
  type?: string;
  filterState?: FilterStrategyType;
}
function Column<T> (props: ColumnProps<T>) {
  return (
    <div>Column</div>
  )
}

export default Column