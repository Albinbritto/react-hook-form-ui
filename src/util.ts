import { FieldValues, Path } from 'react-hook-form';
import { Visibility } from './type';

export function conditionEvaluator<TFieldValues extends FieldValues>(
  namesToWatch: Path<TFieldValues>[],
  watchedValues: Record<string, any>,
  condition: Visibility<TFieldValues>
): boolean {
  const { conditions, operator } = condition;
  const valueByName: Record<string, any> = namesToWatch.reduce((acc, name, idx) => {
    acc[name as string] = watchedValues[idx];
    return acc;
  }, {} as Record<string, any>);

  const results = conditions.map((condition) => {
    const fieldValue = valueByName[condition.name as string];

    switch (condition.operator) {
      case 'EQUALS':
        return fieldValue === condition.value;
      case 'NOT_EQUALS':
        return fieldValue !== condition.value;
      case 'GREATER_THAN':
        return fieldValue > condition.value;
      case 'LESS_THAN':
        return fieldValue < condition.value;
      case 'GREATER_THAN_OR_EQUAL':
        return fieldValue >= condition.value;
      case 'LESS_THAN_OR_EQUAL':
        return fieldValue <= condition.value;
      case 'STARTS_WITH':
        return fieldValue.startsWith(condition.value);
      case 'ENDS_WITH':
        return fieldValue.endsWith(condition.value);
      case 'INCLUDES':
        return fieldValue.includes(condition.value);
      case 'NOT_INCLUDES':
        return !fieldValue.includes(condition.value);
      default:
        return false;
    }
  });

  return operator === 'AND' ? results.every(Boolean) : results.some(Boolean);
}
