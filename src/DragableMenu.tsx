import cx from 'clsx';
import {useEffect} from 'react'
import { Chip, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classes from './DndList.module.css';


interface Props {
    data:any[];
    setData: (data: any) => void;
    onClick: (col: string) => void;
}

export function DragableList({data, setData, onClick} : Props) {
  const [state, handlers] = useListState(data);

  const items = state.map((item, index) => (
    <Draggable key={item.accessor} index={index} draggableId={item.accessor}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div>
          <Chip checked={item.visible} onChange={() => onClick(item.accessor)}>
              {item.accessor}
              </Chip>
          </div>
        </div>
      )}
    </Draggable>
  ));

  useEffect(() => {
    setData(state);

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
