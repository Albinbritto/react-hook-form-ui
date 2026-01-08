import { cloneElement, useMemo } from 'react';
import { FieldValues, useWatch } from 'react-hook-form';
import { DisableCheckProps } from '../type';
import { conditionEvaluator } from '../util';

export const DisabilityChecker = <TFieldValues extends FieldValues = FieldValues>({
  children,
  disabled,
}: DisableCheckProps<TFieldValues>) => {
  const namesToWatch = useMemo(() => {
    if (typeof disabled === 'boolean') return [];
    return disabled?.conditions.map((c) => c.name) || [];
  }, [disabled]);

  const watchedValues = useWatch<TFieldValues>({ name: namesToWatch });

  const isDisabled = useMemo(() => {
    if (typeof disabled === 'boolean') return disabled;

    if (!disabled || disabled?.conditions.length === 0) return false;

    return conditionEvaluator<TFieldValues>(namesToWatch, watchedValues, disabled);
  }, [disabled, namesToWatch, watchedValues]);

  return cloneElement(children, { ...children.props, disabled: isDisabled });
};
