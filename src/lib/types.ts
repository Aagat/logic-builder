export type JsonLogic = 
  | string 
  | { and: JsonLogic[] } 
  | { or: JsonLogic[] } 
  | { '==': [any, any] };

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
