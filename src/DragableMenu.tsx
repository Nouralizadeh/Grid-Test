import cx from 'clsx';
import {useEffect} from 'react'
import { Chip, rem, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classes from './DndList.module.css';
import { IconGripVertical } from '@tabler/icons-react';


interface Props {
    columns:any[];
    setColumnsOrder: (data: any) => void;
    onClick: (col: string) => void;
}

export function DragableList({columns, setColumnsOrder, onClick} : Props) {
  const [state, handlers] = useListState(columns);

  const items = state.map((item, index) => (
    <Draggable key={item.accessor} index={index} draggableId={item.accessor}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div {...provided.dragHandleProps} className={classes.dragHandle}>
            <IconGripVertical style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </div>
          <Chip checked={item.toggled} onChange={() => onClick(item.accessor)}>
              {item.accessor}
              </Chip>
        </div>
      )}
    </Draggable>
  ));

  useEffect(() => {
    setColumnsOrder(state.map(c => c.accessor));

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
