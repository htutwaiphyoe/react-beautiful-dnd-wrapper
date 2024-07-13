import React, { PropsWithChildren } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function orderList<T>({
  list,
  sourceIndex,
  destinationIndex,
}: {
  list: T[];
  sourceIndex: number;
  destinationIndex: number;
}) {
  const orderedItems = reorder<T>(list, sourceIndex, destinationIndex);
  return orderedItems;
}

function orderDifferentList<T extends { id: string; items: I[] }, I>({
  list,
  sourceIndex,
  sourceParentId,
  destinationIndex,
  destinationParentId,
}: {
  list: T[];
  sourceIndex: number;
  sourceParentId: string;
  destinationIndex: number;
  destinationParentId: string;
}): { sourceItems: I[]; destinationItems: I[] } {
  const sourceCategory = list.find((item) => item.id === sourceParentId) as T;
  const destCategory = list.find(
    (item) => item.id === destinationParentId
  ) as T;

  let newSourceCategoryPackages = [...sourceCategory.items];
  const [draggedItem] = newSourceCategoryPackages.splice(sourceIndex, 1);

  let newDestCategoryPackages = [...destCategory.items];
  newDestCategoryPackages.splice(destinationIndex, 0, draggedItem);

  newSourceCategoryPackages = newSourceCategoryPackages.map((item, i) => ({
    ...item,
    orderNo: i + 1,
  }));
  newDestCategoryPackages = newDestCategoryPackages.map((item, i) => ({
    ...item,
    orderNo: i + 1,
  }));

  return {
    sourceItems: newSourceCategoryPackages,
    destinationItems: newDestCategoryPackages,
  };
}

type DragAndDropContextProps = PropsWithChildren & {
  onDragEnd: (result: DropResult) => void;
};

function DragAndDropContext({ onDragEnd, children }: DragAndDropContextProps) {
  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
}

type DroppableWrapperProps<T extends { id: string }> = {
  list: T[];
  className?: string;
  droppableId: string;
  type: "parent" | "child";
  style?: React.CSSProperties;
  renderEmpty?: () => React.ReactNode;
  children?:
    | React.ReactNode
    | ((props: {
        item: T;
        index: number;
        provided: DraggableProvided;
        DragHandler: React.FC<PropsWithChildren>;
      }) => React.ReactNode);
};

function DroppableWrapper<T extends { id: string }>({
  type,
  list,
  children,
  className,
  style = {},
  droppableId,
  renderEmpty,
}: DroppableWrapperProps<T>) {
  return (
    <Droppable droppableId={droppableId} type={type}>
      {(provided) => (
        <div
          style={style}
          className={className}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {list.map((item, index) => {
            return (
              <Draggable
                index={index}
                draggableId={item.id}
                key={`${item.id}-${droppableId}`}
              >
                {(provided) => {
                  return (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      {typeof children === "function"
                        ? children({
                            item,
                            index,
                            provided,
                            DragHandler: ({ children }) => (
                              <div {...provided.dragHandleProps}>
                                {children}
                              </div>
                            ),
                          })
                        : children}
                    </div>
                  );
                }}
              </Draggable>
            );
          })}
          {provided.placeholder}
          {list.length <= 0 && renderEmpty && renderEmpty()}
        </div>
      )}
    </Droppable>
  );
}

type DragAndDropProps<T extends { id: string }> = DroppableWrapperProps<T> & {
  onParentSort: (list: T[]) => void;
};

function DragAndDrop<T extends { id: string }>({
  onParentSort,
  children,
  ...props
}: DragAndDropProps<T>) {
  const sortItems = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (result.type === "parent")
      onParentSort(
        orderList<T>({ list: props.list, sourceIndex, destinationIndex })
      );
  };

  return (
    <DragAndDropContext onDragEnd={sortItems}>
      <DroppableWrapper {...props}>{children}</DroppableWrapper>
    </DragAndDropContext>
  );
}

type NestedDragAndDropProps<
  T extends { id: string; items: I[] },
  I
> = DroppableWrapperProps<T> & {
  onParentSort: (list: T[]) => void;
  onSameParentChildSort: (destinationParentId: string, list: I[]) => void;
  onDifferentParentChildSort: ({
    sourceParentId,
    destinationParentId,
    sourceItems,
    destinationItems,
  }: {
    sourceParentId: string;
    destinationParentId: string;
    sourceItems: I[];
    destinationItems: I[];
  }) => void;
};

function NestedDragAndDrop<T extends { id: string; items: I[] }, I>({
  onParentSort,
  onSameParentChildSort,
  onDifferentParentChildSort,
  children,
  ...props
}: NestedDragAndDropProps<T, I>) {
  const sortItems = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (result.type === "parent") {
      onParentSort(
        orderList<T>({ list: props.list, sourceIndex, destinationIndex })
      );
    }
    if (result.type === "child") {
      const sourceParentId = result.source.droppableId;
      const destinationParentId = result.destination.droppableId;
      if (sourceParentId === destinationParentId) {
        onSameParentChildSort(
          destinationParentId,
          orderList<I>({
            list: props.list.find((item) => item.id === destinationParentId)
              ?.items as I[],
            sourceIndex: result.source.index,
            destinationIndex: result.destination.index,
          })
        );
      } else {
        const { sourceItems, destinationItems } = orderDifferentList<T, I>({
          list: props.list,
          sourceParentId,
          destinationParentId,
          sourceIndex,
          destinationIndex,
        });
        onDifferentParentChildSort({
          sourceParentId,
          destinationParentId,
          sourceItems,
          destinationItems,
        });
      }
    }
  };
  return (
    <DragAndDropContext onDragEnd={sortItems}>
      <DroppableWrapper {...props}>{children}</DroppableWrapper>
    </DragAndDropContext>
  );
}

DragAndDrop.Context = DragAndDropContext;

DragAndDrop.Droppable = DroppableWrapper;

DragAndDrop.Nested = NestedDragAndDrop;

export default DragAndDrop;
