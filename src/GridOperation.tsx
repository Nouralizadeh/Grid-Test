import { ActionIcon, Group, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCopy, IconTrash } from '@tabler/icons-react';
import { CellProps } from './Cell';


export interface Operation<T> {
  onRowDuplicated?: (recordIndex: number) => void;
  duplicateRowCondition?: (record: T) => boolean;
  onRowDeleted?: (recordIndex: number) => void;
  deleteRowCondition?: (record: T) => boolean;
}

interface OperationProps<T> extends Operation<T>  {
  records : T[] 
}


export default function GridOperation<T>({ onRowDuplicated, onRowDeleted, duplicateRowCondition, deleteRowCondition, records}: OperationProps<T>) {

  const openDeleteModal = (recordIndex: number) => {
    modals.openConfirmModal({
      title: "حذف ردیف",
      centered: true,
      children: <Text size="sm">آیا از حذف سطر اطمینان دارید؟</Text>,
      labels: { cancel: "انصراف", confirm: "بله" },
      confirmProps: { color: "red" },
      onConfirm: () => { if (onRowDeleted) onRowDeleted(recordIndex)}
    });
  }   

  const duplicateRow = (recordIndex: number) => (
    <Tooltip label = "Duplicate record">
      <ActionIcon
        size="sm"
        variant="subtle"
        color="green"
        onClick={(e) => { e.stopPropagation(); 
                          if(onRowDuplicated) onRowDuplicated(recordIndex)}}
      >
        <IconCopy size={64} />
      </ActionIcon>
    </Tooltip>);

  const deleteRow = (recordIndex: number) => (
    <Tooltip label = "Delete record">
      <ActionIcon
      size="sm"
      variant="subtle"
      color="red"
      onClick={(e) => { e.stopPropagation(); openDeleteModal(recordIndex); }}
      >
        <IconTrash size={64} />
      </ActionIcon>
    </Tooltip>
  );

  const checkCondition =  (record: T, op: any, condition?: (record: T) => boolean) => {
    return ((condition && condition(record)) ||
           (!condition)) &&
           op
           }

  return (({record, index}: CellProps<T>) => {
    return (
      <Group gap={4} justify="center" wrap="nowrap">
        {checkCondition(record, onRowDuplicated, duplicateRowCondition) && duplicateRow(index)}
        {checkCondition(record, onRowDeleted, deleteRowCondition) && deleteRow(index)}
      </Group>
    );
  })

}
