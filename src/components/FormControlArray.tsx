import { useImperativeHandle, Children, isValidElement, cloneElement } from 'react';
import { FieldValues, ArrayPath, useFieldArray } from 'react-hook-form';
import { FormControlArrayProps } from '../type';
import { FormControl } from './FormControl';

export const FormControlArray = <
  TFieldValues extends FieldValues = FieldValues,
  TArrayName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>
>({
  name,
  rules,
  ref,
  children,
  visibility,
  disabled,
}: FormControlArrayProps<TFieldValues, TArrayName>) => {
  const methods = useFieldArray<TFieldValues, TArrayName>({
    name,
    rules,
  });

  useImperativeHandle(ref, () => methods, [JSON.stringify(methods)]);

  const prefixChildrenNames = (children: React.ReactNode, prefix: string): React.ReactNode => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      const childProps = child.props as any;
      const childType = child.type as any;

      const isRHFormControl =
        childType?.displayName === 'RHFormControl' ||
        childType === FormControl ||
        (childProps.name !== undefined && typeof childType !== 'string');

      if (isRHFormControl && childProps.name !== undefined) {
        //visibility handling
        const _visibility = visibility
          ? visibility[childProps.name as keyof typeof visibility]
          : undefined;
        const fieldVisibility = _visibility
          ? {
              ..._visibility,
              conditions:
                _visibility.conditions?.map((cond: any) => ({
                  ...cond,
                  name: `${prefix}${cond.name}`,
                })) || [],
            }
          : undefined;

        //disability handling
        const _disability = disabled
          ? disabled[childProps.name as keyof typeof disabled]
          : undefined;

        const fieldDisabled = _disability
          ? {
              ..._disability,
              conditions:
                _disability.conditions?.map((cond: any) => ({
                  ...cond,
                  name: `${prefix}${cond.name}`,
                })) || [],
            }
          : undefined;

        const clonedProps: any = {
          ...childProps,
          name: `${prefix}${childProps.name}`,
          visibility: fieldVisibility,
          disabled: fieldDisabled,
        };

        if (childProps.id !== undefined) {
          clonedProps.id = `${prefix}${childProps.id}`;
        }

        return cloneElement(child, clonedProps);
      }

      if (childProps.children) {
        return cloneElement(child, {
          ...childProps,
          children: prefixChildrenNames(childProps.children, prefix),
        });
      }

      return child;
    });
  };

  return (
    <>
      {methods.fields.map((_, index) => {
        const prefix = `${name}.${index}.`;
        return (
          <div
            data-index={index}
            key={prefix}
            style={{ display: 'contents' }}
            id='field-array-item'
          >
            {prefixChildrenNames(children, prefix)}
          </div>
        );
      })}
    </>
  );
};
