# React Beautiful DnD Wrapper

A simplified component that wraps the react-beautiful-dnd library, providing single and nested levels drag and drop functionalities.

## CAUTION ⚠️

react-beautiful-dnd library currently is not supported for `react > 18`.

## Installation

To install the package, use npm or yarn or pnpm:

```bash
npm install react-beautiful-dnd-wrapper
# or
yarn add react-beautiful-dnd-wrapper
# or
pnpm install react-beautiful-dnd-wrapper
```

## Usage

Here's how to use the components provided by the `react-beautiful-dnd-wrapper` library.

### Basic Drag and Drop

```tsx
import React, { useState } from "react";
import { DragAndDrop } from "react-beautiful-dnd-wrapper";

const App = () => {
  const [items, setItems] = useState([
    { id: "item-1", content: "Item 1" },
    { id: "item-2", content: "Item 2" },
    { id: "item-3", content: "Item 3" },
  ]);

  const onParentSort = (sortedItems) => {
    setItems(sortedItems);
  };

  return (
    <DragAndDrop
      list={items}
      type="parent"
      droppableId="droppable"
      onParentSort={onParentSort}
    >
      {({ item,  DragHandler }) => (
        <DragHandler>
          <div>{item.content}</div>
        </DragHandler>
      )}
    </DragAndDrop>
  );
};

export default App;
```

### Nested Drag and Drop

```tsx
import React, { useState } from "react";
import DragAndDrop from "react-beautiful-dnd-wrapper";

const App = () => {
  const [categories, setCategories] = useState([
    {
      id: "category-1",
      items: [
        { id: "item-1", content: "Item 1" },
        { id: "item-2", content: "Item 2" },
      ],
    },
    {
      id: "category-2",
      items: [
        { id: "item-3", content: "Item 3" },
        { id: "item-4", content: "Item 4" },
      ],
    },
  ]);

  const onParentSort = (sortedCategories) => {
    setCategories(sortedCategories);
  };

  const onSameParentChildSort = (parentId, sortedItems) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === parentId
          ? { ...category, items: sortedItems }
          : category
      )
    );
  };

  const onDifferentParentChildSort = ({
    sourceParentId,
    destinationParentId,
    sourceItems,
    destinationItems,
  }) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === sourceParentId) {
          return { ...category, items: sourceItems };
        }
        if (category.id === destinationParentId) {
          return { ...category, items: destinationItems };
        }
        return category;
      })
    );
  };


  return (
    <DragAndDrop.Nested
      type="parent"
      list={categories}
      onParentSort={onParentSort}
      droppableId="nested-droppable"
      onSameParentChildSort={onSameParentChildSort}
      onDifferentParentChildSort={onDifferentParentChildSort}
    >
      {({ item, provided, DragHandler }) => (
        <div>
          <DragHandler>
            <DragIcon>
          </DragHandler>
          <h3>{item.id}</h3>
           <DragAndDrop.Droppable
              type="child"
              list={item.items}
              droppableId={item.id}
              renderEmpty={function(){
                return <div>No items available!</div>
              }}
            >
                {({ item, provided, DragHandler }) => (
                  <div>
                    <DragHandler>
                      <div>{item.content}</div>
                    </DragHandler>
                  </div>
                )}
            </DragAndDrop.Droppable>   
        </div>
      )}
    </DragAndDrop.Nested>
  );
};

export default App;
```

## API

### DragAndDrop

The main component for creating drag-and-drop functionality.

Props
`list`: An array of items to be draggable.
`onParentSort`: A function called when the items are reordered.
`className`: Optional class name for the droppable container.
`droppableId`: The ID of the droppable container.
`type`: The type of the droppable area ("parent" or "child").
`style`: Optional inline styles for the droppable container.
`renderEmpty`: Optional function to render when the list is empty.
`children`: A function that renders the draggable items.

### DragAndDrop.Nested

A component for nested drag-and-drop functionality.

#### Props

`list`: An array of categories, each containing an array of items.
`onParentSort`: A function called when the categories are reordered.
`onSameParentChildSort`: A function called when items within the same category are reordered.
`onDifferentParentChildSort`: A function called when items are moved between different categories.
`className`: Optional class name for the droppable container.
droppableId: The ID of the droppable container.
`type`: The type of the droppable area ("parent" or "child").
style: Optional inline styles for the droppable container.
`renderEmpty`: Optional function to render when the list is empty.
`children`: A function that renders the draggable items

## License

MIT
