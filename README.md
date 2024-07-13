# React Beautiful DnD Wrapper

A simplified component that wraps the react-beautiful-dnd library, providing single and nested levels drag and drop functionalities.

[Video](https://github.com/user-attachments/assets/f96edfa6-31d7-41d5-a540-16ef9aeff921)

## CAUTION ⚠️

Current react-beautiful-dnd library is not supported for `react > 18`. Please Update `strictMode` setting to `false`.

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

Here's examples of components provided by the `react-beautiful-dnd-wrapper` library.

### Basic Drag and Drop

```tsx
import { useState } from "react";
import { DragIndicatorSVG } from "@/icons";
import { DragAndDrop } from "react-beautiful-dnd-wrapper";

type Item = {
  id: string;
  label: string;
};

export default function Home() {
  const [list, setList] = useState<Item[]>([
    { id: "Item-1", label: "Item 1" },
    { id: "Item-2", label: "Item 2" },
    { id: "Item-3", label: "Item 3" },
    { id: "Item-4", label: "Item 4" },
  ]);

  return (
    <DragAndDrop<Item>
      list={list}
      type="parent"
      droppableId="parent"
      onParentSort={(list) => setList(list)}
      className="grid gap-5 border bg-white p-10"
    >
      {({ item, DragHandler }) => {
        return (
          <div className="flex w-80 bg-slate-200 items-center space-x-5 bg-off-white p-5">
            <DragHandler>
              <DragIndicatorSVG />
            </DragHandler>
            <span>{item.label}</span>
          </div>
        );
      }}
    </DragAndDrop>
  );
}
```

### Nested Drag and Drop

```tsx
import { useState } from "react";
import { DragIndicatorSVG } from "@/icons";
import { DragAndDrop } from "react-beautiful-dnd-wrapper";

type Item = {
  id: string;
  label: string;
};

type List = {
  id: string;
  label: string;
  items: Item[];
};

export default function Nested() {
  const [list, setList] = useState<List[]>([
    {
      id: "category-1",
      label: "Category 1",
      items: [
        { id: "item-1", label: "Item 1" },
        { id: "item-2", label: "Item 2" },
      ],
    },
    {
      id: "category-2",
      label: "Category 2",
      items: [],
    },
  ]);

  return (
    <DragAndDrop.Nested<List, Item>
      className="grid gap-5 border bg-white p-10"
      list={list}
      droppableId="parent"
      type="parent"
      onParentSort={(list) => setList(list)}
      onSameParentChildSort={(id, items) => {
        setList((state) =>
          state.map((item) => (item.id === id ? { ...item, items } : item))
        );
      }}
      onDifferentParentChildSort={({
        sourceItems,
        sourceParentId,
        destinationItems,
        destinationParentId,
      }) => {
        setList((state) =>
          state.map((item) =>
            item.id === sourceParentId
              ? { ...item, items: sourceItems }
              : item.id === destinationParentId
              ? { ...item, items: destinationItems }
              : item
          )
        );
      }}
    >
      {({ item, DragHandler }) => {
        return (
          <div className="grid w-96 gap-5 bg-slate-200 p-5">
            <div className="flex items-center space-x-5">
              <DragHandler>
                <DragIndicatorSVG />
              </DragHandler>
              <span>{item.label}</span>
            </div>
            <div className="bg-white p-5">
              <DragAndDrop.Droppable
                type="child"
                list={item.items}
                droppableId={item.id}
                className="grid gap-5"
                renderEmpty={() => (
                  <div className="bg-slate-200 p-5 text-center">
                    No item available!
                  </div>
                )}
              >
                {({ item, DragHandler }) => (
                  <div className="flex bg-slate-300 items-center space-x-5 bg-off-white p-5">
                    <DragHandler>
                      <DragIndicatorSVG />
                    </DragHandler>
                    <span>{item.label}</span>
                  </div>
                )}
              </DragAndDrop.Droppable>
            </div>
          </div>
        );
      }}
    </DragAndDrop.Nested>
  );
}
```

## API

### DragAndDrop

The main component for creating drag-and-drop functionality.

| Prop            | Description                                          |
|-----------------|------------------------------------------------------|
| `list`          | An array of items to be draggable.                   |
| `onParentSort`  | A function called when the items are reordered.      |
| `className`     | Optional class name for the droppable container.     |
| `droppableId`   | The ID of the droppable container.                   |
| `type`          | The type of the droppable area ("parent" or "child").|
| `style`         | Optional inline styles for the droppable container.  |
| `renderEmpty`   | Optional function to render when the list is empty.  |
| `children`      | A function that renders the draggable items.         |

### DragAndDrop.Nested

A component for nested drag-and-drop functionality.

#### Props

| Prop                          | Description                                                           |
|-------------------------------|-----------------------------------------------------------------------|
| `list`                        | An array of categories, each containing an array of items.            |
| `onParentSort`                | A function called when the categories are reordered.                  |
| `onSameParentChildSort`       | A function called when items within the same category are reordered.  |
| `onDifferentParentChildSort`  | A function called when items are moved between different categories.  |
| `className`                   | Optional class name for the droppable container.                      |
| `droppableId`                 | The ID of the droppable container.                                    |
| `type`                        | The type of the droppable area ("parent" or "child").                 |
| `style`                       | Optional inline styles for the droppable container.                   |
| `renderEmpty`                 | Optional function to render when the list is empty.                   |
| `children`                    | A function that renders the draggable items.                          |

## License

MIT
