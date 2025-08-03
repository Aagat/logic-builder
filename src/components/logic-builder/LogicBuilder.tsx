import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

// --- Inlined Types ---
export type JsonLogic =
  | string
  | { and: JsonLogic[] }
  | { or: JsonLogic[] }
  | { '==': [any, any] };

export interface Item {
  id: string;
  name: string;
}

export interface Criteria {
  type: 'criteria';
  itemId: string;
  value: boolean;
}

export interface CriteriaGroup {
  type: 'group';
  operator: 'and' | 'or';
  conditions: (Criteria | CriteriaGroup)[];
}

export type CriteriaNode = Criteria | CriteriaGroup;
// --- End Inlined Types ---

export interface LogicBuilderLabels {
  selectCriteriaPlaceholder?: string;
  noCriteriaAvailable?: string;
  valuePlaceholder?: string;
  trueLabel?: string;
  falseLabel?: string;
  andLabel?: string;
  orLabel?: string;
  addCriteriaButton?: string;
  addGroupButton?: string;
  noCriteriaInGroupMessage?: string;
}

const defaultLabels: Required<LogicBuilderLabels> = {
  selectCriteriaPlaceholder: 'Select a criteria',
  noCriteriaAvailable: 'No criteria available',
  valuePlaceholder: 'Value',
  trueLabel: 'True',
  falseLabel: 'False',
  andLabel: 'AND',
  orLabel: 'OR',
  addCriteriaButton: '+ Add Criteria',
  addGroupButton: '+ Add Criteria Group',
  noCriteriaInGroupMessage: 'No criteria in this group. Add criteria using the buttons below.',
};

interface LogicBuilderProps {
  criteria: CriteriaNode;
  items: Item[];
  onChange: (node: CriteriaNode) => void;
  onDelete: () => void;
  level?: number;
  parentGroup?: CriteriaGroup;
  criteriaIndex?: number;
  labels?: LogicBuilderLabels;
}

export function LogicBuilder({ criteria, items, onChange, onDelete, level = 0, parentGroup, criteriaIndex, labels = {} }: LogicBuilderProps) {
  const currentLabels = { ...defaultLabels, ...labels };

  if (criteria.type === 'group') {
    return <CriteriaGroupComponent criteria={criteria} items={items} onChange={onChange} onDelete={onDelete} level={level} labels={currentLabels} />;
  }

  const availableItems = parentGroup && criteriaIndex !== undefined
    ? items.filter(item => {
        if (criteria.itemId === item.id) {
          return true;
        }
        const otherCriteria = parentGroup.conditions
          .filter((_, index) => index !== criteriaIndex)
          .filter(condition => condition.type === 'criteria')
          .map(condition => (condition as Criteria).itemId);
        return !otherCriteria.includes(item.id);
      })
    : items;

  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-4"></div>
      <Select
        value={criteria.itemId || ""}
        onValueChange={(value: string) => onChange({ ...criteria, itemId: value })}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder={currentLabels.selectCriteriaPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {availableItems.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">{currentLabels.noCriteriaAvailable}</div>
          ) : (
            availableItems.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {criteria.itemId && (
        <Select
          value={criteria.value?.toString() || "true"}
          onValueChange={(value: string) => onChange({ ...criteria, value: value === "true" })}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder={currentLabels.valuePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">{currentLabels.trueLabel}</SelectItem>
            <SelectItem value="false">{currentLabels.falseLabel}</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface CriteriaGroupProps {
  criteria: CriteriaNode;
  items: Item[];
  onChange: (node: CriteriaNode) => void;
  onDelete: () => void;
  level: number;
  labels: Required<LogicBuilderLabels>;
}

function CriteriaGroupComponent({ criteria, items, onChange, onDelete, level, labels }: CriteriaGroupProps) {
  const group = criteria as CriteriaGroup;

  const getSelectedCriteriaIds = () => {
    return group.conditions
      .filter(condition => condition.type === 'criteria')
      .map(condition => (condition as Criteria).itemId);
  };

  const availableItemsForAdd = items.filter(item =>
    !getSelectedCriteriaIds().includes(item.id)
  );

  const addCriteria = () => {
    const newCriteria: Criteria = { type: 'criteria', itemId: "", value: true };
    const newConditions = [...group.conditions, newCriteria];
    onChange({ ...group, conditions: newConditions });
  };

  const addGroup = () => {
    const newGroup: CriteriaGroup = { type: 'group', operator: 'and', conditions: [] };
    const newConditions = [...group.conditions, newGroup];
    onChange({ ...group, conditions: newConditions });
  };

  const updateCriteria = (index: number, node: CriteriaNode) => {
    const newConditions = [...group.conditions];
    newConditions[index] = node;
    onChange({ ...group, conditions: newConditions });
  };

  const deleteCriteria = (index: number) => {
    const newConditions = [...group.conditions];
    newConditions.splice(index, 1);
    onChange({ ...group, conditions: newConditions });
  };

  const updateOperator = (operator: 'and' | 'or') => {
    onChange({ ...group, operator });
  };

  return (
    <div className="border rounded-lg p-4 mb-2 bg-white" style={{ marginLeft: level * 20 }}>
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant={group.operator === 'and' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateOperator('and')}
          >
            {labels.andLabel}
          </Button>
          <Button
            variant={group.operator === 'or' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateOperator('or')}
          >
            {labels.orLabel}
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {group.conditions.length === 0 ? (
          <div className="text-sm text-muted-foreground italic p-2">
            {labels.noCriteriaInGroupMessage}
          </div>
        ) : (
          group.conditions.map((child: CriteriaNode, index: number) => (
            <div key={index}>
              <LogicBuilder
                criteria={child}
                items={items}
                onChange={(node) => updateCriteria(index, node)}
                onDelete={() => deleteCriteria(index)}
                level={level + 1}
                parentGroup={group}
                criteriaIndex={index}
                labels={labels} // Pass labels down
              />
            </div>
          ))
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addCriteria}>
            {labels.addCriteriaButton}
          </Button>
          <Button variant="outline" size="sm" onClick={addGroup}>
            {labels.addGroupButton}
          </Button>
        </div>
      </div>
    </div>
  );
}
