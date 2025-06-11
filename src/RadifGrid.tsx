
import Grid, { GridGeneralProps } from './Grid';
import GridOperation, { Operation } from './GridOperation';
import { ModalsProvider } from '@mantine/modals';
import { TableTd } from '@mantine/core';
import { DragDropContext, Draggable, type DropResult, Droppable } from '@hello-pangea/dnd';
import { DataTableDraggableRow } from 'mantine-datatable';
import { IconGripVertical } from '@tabler/icons-react';
import Column from './Column';

interface RadifProps<T> extends GridGeneralProps<T>, Operation<T> {
  onRowDragging?: (sourceIndex: number, destinationIndex: number) => void; 
} 
function RadifGrid<T>(props: RadifProps<T>) {
  const {
    onRowDragging,
    onRowDuplicated,
    onRowDeleted,
    deleteRowCondition,
    duplicateRowCondition,
    ...rest
  } = props;

  let gridData = props.gridData

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (onRowDragging) onRowDragging(sourceIndex, destinationIndex)
  };

  const droppable = ({ children } : any) => (
    <Droppable droppableId="datatable">
      {(provided: any) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )

  const draggable = ({ record, index, rowProps, children }: any) => (
    <Draggable key={record[props.idAccessor ?? "Id"]} draggableId={`draggable-${record[props.idAccessor ?? "Id"]}`} index={index}>
      {(provided: any, snapshot: any) => {
        return (
          <DataTableDraggableRow style={{ backgroundColor: "red" }} isDragging={snapshot.isDragging} {...rowProps} {...provided.draggableProps}>
            <TableTd {...provided.dragHandleProps} ref={provided.innerRef}>
              <IconGripVertical size={16} />
            </TableTd>
            {children}
          </DataTableDraggableRow>
        );
      }}
    </Draggable>
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ModalsProvider>
        <Grid
          {...rest}
          gridData={gridData}
          tableWrapper={onRowDragging ? droppable : undefined}
          rowFactory={onRowDragging ? draggable : undefined}
        >
          {[
            onRowDragging && <Column accessor={""} hiddenContent={true} width={30} />,
            ...props.children,
            (onRowDeleted || onRowDuplicated) && 
            <Column accessor={"operation"} width={800} 
                    render={GridOperation({ onRowDuplicated,
                                            onRowDeleted, 
                                            deleteRowCondition,
                                            duplicateRowCondition,
                                            records: gridData})} />

          ].filter(Boolean)}
        </Grid>
      </ModalsProvider>
    </DragDropContext >
  );
}

export default RadifGrid