import cx from 'clsx';
import { useEffect } from 'react'
import { Chip, rem, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classes from './DndList.module.css';
import { IconGripVertical } from '@tabler/icons-react';


interface Props {
  columns: any[];
  order: any[];
  setOrder: (data: any) => void;
  onClick: (col: string) => void;
}

export function DragableList({ columns, order, setOrder, onClick }: Props) {
  const [state, handlers] = useListState(order);

  const items = state.map((colName, index) => {
    if (colName != "Columns") {
      const col = columns.find(c => c.accessor == colName)
      return (<Draggable key={col.accessor} index={index} draggableId={col.accessor}>
        {(provided, snapshot) => (
          <div
            className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            {col.toggleable && <div {...provided.dragHandleProps} className={classes.dragHandle}>
              <IconGripVertical style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </div>}
            {!col.toggleable && <div >
              <IconGripVertical style={{ width: rem(18), height: rem(18), color: "lightgray" }} stroke={1.5} />
            </div>}
            <Chip disabled={!col.toggleable} checked={col.toggled} onChange={() => onClick(col.accessor)}>
              {col.accessor}
            </Chip>
          </div>
        )}
      </Draggable>)
    }
  }
  );

  useEffect(() => {
    setOrder(state);

  }, [state])


  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
      }
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

// const itemStyle =  {
//   display: "flex",
//   alignItems: "center",
//   backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-5))",
//   marginBottom: "var(--mantine-spacing-sm)",
//   width: "fit-content"
// }

// const itemDragging = {
//   boxShadow: "var(--mantine-shadow-sm)"
// }
