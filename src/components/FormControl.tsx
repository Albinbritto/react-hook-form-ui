import { useMemo, cloneElement } from 'react';
import { FieldValues, FieldPath, useFormContext, Controller } from 'react-hook-form';
import { useRHFormContext } from '../context/RHFormContext';
import { FormControlProps } from '../type';
import { ConditionChecker } from './ConditionChecker';
import { DisabilityChecker } from './DisabilityChecker';

export const FormControl = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  name,
  rules,
  className = '',
  label,
  id,
  value: externalValue,
  disabled,
  shouldUnregister,
  visibility,
  description,
}: FormControlProps<TFieldValues, TName>) => {
  const { control } = useFormContext<TFieldValues>();
  const isRenderFunction = typeof children === 'function';
  const controlledValue = isRenderFunction ? (externalValue ?? '') : (children.props.value ?? '');
  const { showAsterisk } = useRHFormContext();

  const fieldId = useMemo(() => id || crypto.randomUUID(), []);

  const fieldDescription = useMemo(() => {
    if (!description) return;

    if (typeof description === 'string') {
      return { position: 'LABEL_BOTTOM', text: description };
    }

    return description;
  }, [description]);

  return (
    <ConditionChecker<TFieldValues> visibility={visibility}>
      <DisabilityChecker disabled={disabled}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          defaultValue={controlledValue}
          shouldUnregister={shouldUnregister}
          render={(fieldState) => {
            const {
              field: { name, onBlur, value, onChange, ref, disabled: fieldDisabled },
              fieldState: { error },
            } = fieldState;
            return (
              <div
                className={`controlled-field ${className}`}
                style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    ...(fieldDescription && {
                      gap: '2px',
                      flexDirection: fieldDescription.position === 'LABEL_RIGHT' ? 'row' : 'column',
                    }),
                  }}
                >
                  {label && (
                    <label htmlFor={fieldId} className='controlled-field-label'>
                      {label}
                      {showAsterisk && !!rules && <span style={{ color: 'red' }}> *</span>}
                    </label>
                  )}
                  {fieldDescription && fieldDescription.position !== 'CONTROL_BOTTOM' && (
                    <span style={{ color: '#a1a1a1', fontSize: 12 }}>{fieldDescription.text}</span>
                  )}
                </div>

                {isRenderFunction
                  ? children(fieldState)
                  : cloneElement(children, {
                      ...children.props,
                      id: fieldId,
                      name,
                      disabled: fieldDisabled,
                      onChange: (...args: any[]) => {
                        onChange(...args);
                        children.props.onChange?.(...args);
                      },
                      value: value,
                      onBlur: (...args: any[]) => {
                        onBlur();
                        children.props.onBlur?.(...args);
                      },
                      ref,
                    })}
                {error && (
                  <div style={{ color: 'red', fontSize: 13 }} className='controlled-field-error'>
                    {error.message}
                  </div>
                )}
              </div>
            );
          }}
        />
      </DisabilityChecker>
    </ConditionChecker>
  );
};

FormControl.displayName = 'RHFormControl';
