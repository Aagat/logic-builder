import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { JsonLogic, CriteriaNode, CriteriaGroup, Criteria } from './types';
import { items } from './data';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serializes a criteria node to JSON logic
 */
export function serialize(node: CriteriaNode): JsonLogic {
  if (node.type === 'criteria') {
    return { '==': [{ 'var': node.itemId }, node.value] };
  } else {
    const group = node as CriteriaGroup;
    // Filter out empty criteria and serialize the rest
    const validConditions = group.conditions.filter(condition => 
      condition.type === 'criteria' ? condition.itemId !== "" : true
    );
    const key = group.operator;
    const serializedConditions = validConditions.map(serialize);
    if (key === 'and') {
      return { and: serializedConditions };
    } else {
      return { or: serializedConditions };
    }
  }
}

/**
 * Deserializes JSON logic to criteria nodes
 */
export function deserialize(json: JsonLogic): CriteriaNode {
  if (typeof json === 'string') {
    return {
      type: 'criteria',
      itemId: json,
      value: true
    };
  }
  
  const keys = Object.keys(json);
  if (keys.length === 1) {
    const key = keys[0];
    
    if (key === 'and' || key === 'or') {
      const operator = key as 'and' | 'or';
      const conditions = (json as any)[operator].map((item: JsonLogic) => deserialize(item));
      return {
        type: 'group',
        operator,
        conditions
      };
    } else if (key === '==') {
      const equality = json as { '==': [any, any] };
      const varExpr = equality['=='][0];
      const value = equality['=='][1];
      if (typeof varExpr === 'object' && 'var' in varExpr) {
        return {
          type: 'criteria',
          itemId: varExpr['var'],
          value: value === true
        };
      }
    }
  }
  
  throw new Error('Invalid JSON logic format');
}

/**
 * Validates if a criteria node is valid
 */
export function isValid(node: CriteriaNode): boolean {
  if (node.type === 'criteria') {
    return items.some(item => item.id === (node as Criteria).itemId);
  }
  
  const group = node as CriteriaGroup;
  if (group.conditions.length === 0) {
    return false;
  }
  
  return group.conditions.every(isValid);
}

/**
 * Gets the name of an item by its ID
 */
export function getItemNameById(id: string): string {
  const item = items.find(item => item.id === id);
  return item ? item.name : id;
}

/**
 * Saves logic to localStorage
 */
export function saveLogic(name: string, logic: JsonLogic) {
  const saved = JSON.parse(localStorage.getItem('savedLogics') || '[]');
  const newSaved = [...saved, { name, logic, id: Date.now().toString() }];
  localStorage.setItem('savedLogics', JSON.stringify(newSaved));
}

/**
 * Loads all saved logics
 */
export function loadSavedLogics() {
  return JSON.parse(localStorage.getItem('savedLogics') || '[]');
}

/**
 * Loads a specific logic by ID
 */
export function loadLogic(id: string) {
  const saved = loadSavedLogics();
  return saved.find((item: any) => item.id === id);
}

/**
 * Deletes a saved logic
 */
export function deleteLogic(id: string) {
  const saved = loadSavedLogics();
  const newSaved = saved.filter((item: any) => item.id !== id);
  localStorage.setItem('savedLogics', JSON.stringify(newSaved));
}
