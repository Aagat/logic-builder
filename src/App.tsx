import { Toaster } from "@/components/ui/sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogicBuilder, type LogicBuilderLabels, type CriteriaNode, type Item } from "@/components/logic-builder/LogicBuilder"
import { JsonPreview } from "@/components/JsonPreview"
import { SaveLoadControls } from "@/components/SaveLoadControls"
import { items } from "@/lib/data"
import { serialize, deserialize } from "@/lib/utils"
import { useState } from "react"

// Example of custom labels for the LogicBuilder
const customLabels: LogicBuilderLabels = {
  selectCriteriaPlaceholder: "Choose a rule...",
  noCriteriaAvailable: "No rules left to choose from",
  valuePlaceholder: "State",
  trueLabel: "Yes",
  falseLabel: "No",
  andLabel: "All Of",
  orLabel: "Any Of",
  addCriteriaButton: "+ Add Rule",
  addGroupButton: "+ Add Rule Group",
  noCriteriaInGroupMessage: "This group is empty. Add some rules!",
};

function App() {
  const [rootCriteria, setRootCriteria] = useState<CriteriaNode>({
    type: 'group',
    operator: 'and',
    conditions: [
      {
        type: 'criteria',
        itemId: 'user_active',
        value: true,
      },
      {
        type: 'group',
        operator: 'or',
        conditions: [
          {
            type: 'criteria',
            itemId: 'email_verified',
            value: true,
          },
          {
            type: 'criteria',
            itemId: 'phone_number_verified',
            value: true,
          },
        ]
      },
    ]
  });

  const updateCriteria = (node: CriteriaNode) => {
    setRootCriteria(node);
  };

  const handleLoad = (logic: any) => {
    try {
      const deserialized = deserialize(logic);
      setRootCriteria(deserialized);
    } catch (error) {
      console.error('Failed to deserialize logic:', error);
      setRootCriteria({
        type: 'group',
        operator: 'and',
        conditions: []
      });
    }
  };

  return (
    <>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Logic Builder</CardTitle>
              <SaveLoadControls 
                logic={serialize(rootCriteria)} 
                onLoad={handleLoad} 
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <LogicBuilder 
                  criteria={rootCriteria} 
                  items={items} 
                  onChange={updateCriteria} 
                  onDelete={() => {}} 
                  labels={customLabels}
                />
              </div>
              <JsonPreview logic={serialize(rootCriteria)} />
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
  )
}

export default App
