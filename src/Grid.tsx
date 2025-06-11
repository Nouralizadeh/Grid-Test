import { DataTable, DataTableColumn, DataTableSortStatus } from "mantine-datatable";
import React, { ReactElement, useEffect, useMemo, useRef } from "react";
import {isEqual} from 'lodash';
import Column, {ColumnProps} from "./Column";
import { Checkbox, TableTrProps, useDirection } from "@mantine/core";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";
import "@mantine/notifications/styles.css";
import "./RTL.css"
import checkRecordsSelection from "./CheckRecordsSelection"
import Cell, { CellProps } from "./Cell";
import FilterStrategy from "./FilterStrategy";


export type Pagination = {
  totalRecords?: number;
  page: number;
  pageSize: number;
  pageSizes?: never
  onPageChange: (a: number) => void;
  onPageSizeChange?: never;
} |
{
  totalRecords?: number;
  page: number;
  pageSize: number;
  pageSizes: number[];
  onPageChange: (a: number) => void;
  onPageSizeChange: (a: number) => void;
} ;

export interface GridGeneralProps<T> {
  children: ReactElement<typeof Column>[];
  gridData: T[];
  pagination?: Pagination;
  selectedRecords?: T[];
  onSelectedChange?: React.Dispatch<React.SetStateAction<T[]>> | ((selectedRecords: T[]) => void);
  onKeyup?: (e : T) => void,
  idAccessor?: string;
  height? : number;
  onRowDoubleClick?: (e : T) => void,
  onRowClick?: (e : T) => void;
  sortStatus?: DataTableSortStatus<T>;
  onSortStatusChange?: ((sortStatus: DataTableSortStatus<T>) => void);
}

interface GridProps<T> extends GridGeneralProps<T> {
  tableWrapper?: ({ children }: {
    children: React.ReactNode;
  }) => React.ReactNode;
  rowFactory?: (props: {
    record: T;
    index: number;
    children: React.ReactNode;
    rowProps: TableTrProps;
    expandedElement?: React.ReactNode;
  }) => React.ReactNode;
  highlightedRecord?: T;
}

function Grid<T>(props: GridProps<T>) {
  const {
    children,
    gridData,
    pagination,
    selectedRecords,
    onSelectedChange,
    onKeyup,
    idAccessor = "Id",
    height = calculateGridHeight(gridData.length),
    onRowDoubleClick,
    onRowClick,
    tableWrapper,
    rowFactory,
    highlightedRecord,
    sortStatus,
    onSortStatusChange
  } = props;

  const getColmnAccessor =(column: ReactElement<ColumnProps<T>>) =>   column.props.accessor? column.props.accessor.toString(): (column.key?? "");
  const getSortStatus = (cols : ReactElement<ColumnProps<T>>[]) =>
  {
    const col =  cols.find(col => col.props.sortable)
    if (!sortStatus && onSortStatusChange && col)
    {
      const columnId = getColmnAccessor(col)
      onSortStatusChange({columnAccessor:columnId, direction:"asc"})
    }

  }
  const {dir} = useDirection();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => getSortStatus(children), []);

  const perPageCalculator = (): number => {
    if (height) {
      const perPage: number = Math.floor(height / 45)
      if(pagination && pagination.pageSize && perPage < pagination.pageSize)
        return perPage
      else if(pagination)
        return pagination.pageSize
    }
    return pagination && pagination.pageSize? pagination.pageSize :gridData.length
  }
  
  useEffect(() => {
    if(pagination )
      pagination.onPageChange(1)
  }, [pagination?.pageSize])

  let paginationProps = {}
  if (pagination) {
    paginationProps = {
      page: pagination.page,
      onPageChange: pagination.onPageChange,
      onRecordsPerPageChange: pagination.onPageSizeChange,
      recordsPerPageOptions: pagination.pageSizes,
      totalRecords: pagination.totalRecords ?? gridData.length,
      recordsPerPage: pagination.pageSize,
    };
  }

  useEffect(() => {
    if(pagination && pagination.onPageSizeChange)
      pagination.onPageSizeChange(perPageCalculator())
  }, [height])

  let records: T[] = useMemo(() => gridData, [gridData]);

  const { allSelected, someSelected } = checkRecordsSelection(
    records,
    selectedRecords ?? [],
    (a: any, b: any) => a[idAccessor] === b[idAccessor]
  )
  const selectionColumn =
    <Column
      accessor={"select"}
      cellsClassName={"mantine-datatable-row-selector-cell"}
      titleClassName={"mantine-datatable-header-selector-cell"}
      title={(
        <Checkbox
          disabled={onSelectedChange == undefined}
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onClick={(e) => { e.stopPropagation() }}
          onChange={(e) => {
            if (e.target.checked && onSelectedChange) {
              onSelectedChange([...records]);
            } else if (onSelectedChange) {
              onSelectedChange([]);
            }
          }}
        />
      )}
      render={({ record, index }) =>
        <Cell render={({ record }: CellProps<T>) =>
          <Checkbox disabled={onSelectedChange == undefined}
            checked={selectedRecords?.includes(record)}
            onClick={(e) => { e.stopPropagation() }}
            onChange={(e) => {
              if (e.target.checked && selectedRecords && onSelectedChange) {
                onSelectedChange([...selectedRecords, record]);
              } else if (selectedRecords && onSelectedChange) {
                onSelectedChange(selectedRecords.filter((r) => r !== record));
              }
            }}
          />
        }
          value={""}
          record={record}
          index={index} />}

    />
  const getColumns = ():DataTableColumn<T>[] => {
    let cols: any[] = [];
    let userDefiendColumns = [...children]
    if (selectedRecords)
      userDefiendColumns.splice(children[0].props.hiddenContent ? 1 : 0, 0, selectionColumn) 
    React.Children.forEach(userDefiendColumns, (child) => {
      if (React.isValidElement<ColumnProps<T>>(child)) {
        const columnId: keyof T = (child.props.accessor? child.props.accessor.toString(): (child.key? child.key.toString() : "")) as string & keyof T;
        const columnFilter = child.props.filterState? FilterStrategy(child.props.filterState) : undefined
        cols.push(
          child.props.hiddenContent ?
          { accessor: '', hiddenContent: true, width: 30 }:
          {
          width: "800",
          title: child.props.title,
          accessor: columnId,
          render: child.props.render != undefined?
                  ((record: T, index: number) => <Cell record={record} value={record[columnId]} index={index} render={child.props.render}/>)
                  : undefined,
          sortable: child.props.sortable,
          cellsStyle: () => child.props.render && columnId != "operation" && columnId != "select" ? { padding: 0 } : child.props.cellsStyle,
          noWrap: true,
          resizable: child.props.resizable,
          toggleable: child.props.toggleable,
          draggable: child.props.draggable,
          cellsClassName: child.props.cellsClassName,
          titleClassName: child.props.titleClassName,
          filter: child.props.filter?? (columnFilter? columnFilter.filter: undefined),
          filtering: child.props.filtering?? (columnFilter && columnFilter.filtering? true : false)
        });
      }
    });
    return cols;
  }
  const columns = getColumns()

  const onRowClickHandler =( record: T) =>{
    if(onRowClick)
      onRowClick(record)
  }

  const shouldBeHighlighted = (record: T): boolean => (selectedRecords != undefined && selectedRecords.indexOf(record) != -1) ||
                                                      (highlightedRecord != undefined && isEqual(highlightedRecord, record))

  return (
    <div style={{ padding: 50 }}>
      <DataTable
        onRowDoubleClick= {({ record }) => {if(onRowDoubleClick) onRowDoubleClick(record)}}
        verticalSpacing={9.5}
        tabIndex={0}
        onKeyUpCapture={onKeyup ? (e: any) => onKeyup(e) : undefined}
        onKeyDown={onKeyup ? (e: any) => onKeyup(e) : undefined}
        highlightOnHover
        highlightOnHoverColor="lightgray"
        withTableBorder
        withColumnBorders
        storeColumnsKey={idAccessor}
        columns={columns}
        records={records}
        height={pagination? undefined: height}
        scrollViewportRef={pagination? undefined: scrollViewportRef}
        customRowAttributes={(record: T) => shouldBeHighlighted(record) ? { "data-selected": "true" } : {}}
        onRowClick={({ record }) => onRowClickHandler(record)}
        {...paginationProps}
        paginationText= {dir== "rtl"? (({ from, to, totalRecords }: any) =>
          `رکوردهای ${from} - ${to} از ${totalRecords}`) : undefined}
        sortStatus={sortStatus}
        onSortStatusChange={onSortStatusChange}
        idAccessor={idAccessor}
        tableWrapper={tableWrapper}
        rowFactory={rowFactory}
      />
    </div>
  );
}

const calculateGridHeight = (gridLength : number) => (gridLength + 1) * 42.5 < (window.innerHeight - 150)? undefined :(window.innerHeight - 150)
export default Grid;
