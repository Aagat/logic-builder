# React Logic Builder Component

A flexible and reusable React component for building complex logical conditions. This component allows users to create nested criteria with AND/OR operators, making it ideal for creating advanced filters, rules engines, or any application requiring dynamic logic construction.

Built with TypeScript, React, and styled with Shadcn UI components.

## Features

- **Dynamic Criteria Building**: Add, remove, and nest criteria and criteria groups.
- **AND/OR Operators**: Easily switch between logical operators within groups.
- **Reusable & Independent**: Designed to be imported into any React/Vite project.
- **Customizable Labels**: All UI text can be customized via props.
- **TypeScript Support**: Fully typed for a better developer experience.
- **Shadcn UI Integration**: Styled with popular and customizable Shadcn UI components.

## Live Demo

You can see a live demo of this component in action by running this project locally.

### To run the demo:

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/condition-builder.git
    ```
2.  Navigate into the project directory:
    ```bash
    cd condition-builder
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    ```
4.  Start the development server:
    ```bash
    pnpm dev
    ```
5.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Integrating into Your Shadcn UI Project

Follow these steps to copy and integrate the `LogicBuilder` component into your existing Shadcn UI project.

### Prerequisites

Ensure your project already has Shadcn UI set up. If not, please refer to the [official Shadcn UI documentation](https://ui.shadcn.com/docs/installation) for setup instructions.

You will also need the following dependencies installed in your project:

```bash
pnpm add lucide-react sonner
```

And the following Shadcn UI components:

```bash
pnpm shadcn-ui@latest add button select card input label dialog
```

### Step 1: Copy the LogicBuilder Component File

1.  Create a new directory in your project's `src/components/` folder named `logic-builder`.
2.  Copy the content of `src/components/logic-builder/LogicBuilder.tsx` from this repository into a new file named `LogicBuilder.tsx` inside your project's `src/components/logic-builder/` directory.

### Step 2: Install Peer Dependencies

The `LogicBuilder` component has peer dependencies on `react`, `react-dom`, `lucide-react`, and several Shadcn UI components. You should already have these if you've set up Shadcn UI.

Ensure your `package.json` includes (versions might vary):

```json
"peerDependencies": {
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "lucide-react": "^0.263.1" // Or your installed version
},
```
And that you have the necessary Shadcn UI components installed as mentioned in the prerequisites.

### Step 3: Use the Component in Your Application

You can now import and use the `LogicBuilder` component in your React application.

#### Example Usage

Here's a basic example of how to use the `LogicBuilder` component:

```tsx
// src/App.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogicBuilder, type LogicBuilderLabels, type CriteriaNode, type Item } from '@/components/logic-builder/LogicBuilder';

// Define your list of selectable criteria items
const items: Item[] = [
  { id: 'item1', name: 'Is Active' },
  { id: 'item2', name: 'Has Subscription' },
  { id: 'item3', name: 'Is Verified' },
  { id: 'item4', name: 'Agreed to Terms' },
];

// Optional: Define custom labels for the UI
const customLabels: LogicBuilderLabels = {
  selectCriteriaPlaceholder: 'Choose a condition...',
  valueTrue: 'Yes',
  valueFalse: 'No',
  addCriteriaButton: '+ Add Condition',
  addGroupButton: '+ Add Group',
  noCriteriaInGroupText: 'No conditions in this group. Add some using the buttons below.',
  andOperatorText: 'AND',
  orOperatorText: 'OR',
};

export default function App() {
  const [rootCriteria, setRootCriteria] = useState<CriteriaNode>({
    type: 'group',
    operator: 'and',
    conditions: [],
  });

  const updateCriteria = (node: CriteriaNode) => {
    setRootCriteria(node);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Custom Logic Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <LogicBuilder
            criteria={rootCriteria}
            items={items}
            onChange={updateCriteria}
            onDelete={() => {}} // Root cannot be deleted
            labels={customLabels} // Pass custom labels, or omit for defaults
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

## Props

| Prop         | Type                                      | Required | Description                                                                                              |
| ------------ | ----------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `criteria`   | `CriteriaNode`                            | Yes      | The root criteria node object representing the current logic structure.                                   |
| `items`      | `Item[]`                                  | Yes      | An array of `Item` objects that can be selected as criteria.                                             |
| `onChange`   | `(node: CriteriaNode) => void`            | Yes      | Callback function that is invoked whenever the logic structure changes. It receives the updated root node. |
| `onDelete`   | `() => void`                              | Yes      | Callback function for deleting the current criteria node. For the root node, this should typically be a no-op. |
| `labels`     | `LogicBuilderLabels` (optional)           | No       | An object to customize the UI text strings. See `LogicBuilderLabels` interface in `LogicBuilder.tsx`.     |
| `level`      | `number` (optional)                       | No       | Internal prop for nesting level. Generally not used when directly implementing the component.           |
| `parentGroup`| `CriteriaGroup` (optional)                | No       | Internal prop for parent group context. Generally not used when directly implementing the component.     |
| `criteriaIndex`| `number` (optional)                     | No       | Internal prop for index within parent group. Generally not used when directly implementing the component. |

### Type Definitions

The component exports several TypeScript types that you can use:

-   `LogicBuilder`: The main component type.
-   `LogicBuilderLabels`: Interface for customizing UI text.
-   `CriteriaNode`: A union type representing either a `CriteriaGroup` or a `Criteria`.
-   `CriteriaGroup`: Type for a group of conditions (AND/OR).
-   `Criteria`: Type for an individual condition.
-   `Item`: Type for a selectable criteria item.
-   `JsonLogic`: Type for the serialized JSON logic output (though serialization logic is not part of this independent component).

Refer to the `LogicBuilder.tsx` file for the full definitions of these types.

## Customization

### Labels

You can customize most of the text displayed in the `LogicBuilder` by passing a `labels` prop. Any label not provided will fall back to a default English string.

```tsx
const myLabels: LogicBuilderLabels = {
  selectCriteriaPlaceholder: 'Select an attribute',
  valueTrue: 'Enabled',
  valueFalse: 'Disabled',
  // ...and so on
};

<LogicBuilder
  // ... other props
  labels={myLabels}
/>
```

### Styling

The component uses Shadcn UI components, which rely on CSS variables for theming. To customize the look and feel, you can override these CSS variables in your project's global CSS file (`src/index.css` or similar). Refer to the [Shadcn UI Theming documentation](https://ui.shadcn.com/docs/theming) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

-   [React](https://reactjs.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Vite](https://vitejs.dev/)
-   [Shadcn UI](https://ui.shadcn.com/)
-   [Lucide React](https://lucide.dev/)
