import { memo } from "react";

export type CellProps<T> = {
  value: any,
  onChange?: (a: number | string) => void,
  record: T;
  index: number;
}
type MemoizedCellProps<T> = {
  render: (cellProps: CellProps<T>) => React.ReactNode;
} & CellProps<T>

const Cell = <T,>({ render, ...rest }: MemoizedCellProps<T>) => {
  return render(rest);
};

export default memo(Cell) as <T>(props: MemoizedCellProps<T>) => JSX.Element;