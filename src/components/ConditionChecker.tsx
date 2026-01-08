import { useMemo } from 'react';
import { FieldValues, useWatch } from 'react-hook-form';
import { conditionEvaluator } from '../util';
import { ConditionCheckProps } from '../type';

export const ConditionChecker = <TFieldValues extends FieldValues = FieldValues>({
  children,
  visibility,
}: ConditionCheckProps<TFieldValues>) => {
  const namesToWatch = useMemo(() => {
    if (typeof visibility === 'boolean') return [];
    return visibility?.conditions.map((c) => c.name) || [];
  }, [visibility]);

  const watchedValues = useWatch<TFieldValues>({ name: namesToWatch });

  const evaluateCondition = useMemo(() => {
    if (typeof visibility === 'boolean') return visibility;

    if (!visibility || visibility?.conditions.length === 0) return true;

    return conditionEvaluator<TFieldValues>(namesToWatch, watchedValues, visibility);
  }, [visibility, namesToWatch, watchedValues]);

  return evaluateCondition ? children : null;
};
