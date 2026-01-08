import { ReactElement, ReactNode } from 'react';
import {
  FieldValues,
  FieldPath,
  ControllerFieldState,
  ControllerRenderProps,
  RegisterOptions,
  UseFormProps,
  PathValue,
  UseFieldArrayProps,
  UseFormReturn,
  UseFieldArrayReturn,
  DeepPartial,
  ArrayPath,
  UseFormStateReturn,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';

export type RHFormRef<TFieldValues extends FieldValues = FieldValues> = Pick<
  UseFormReturn<TFieldValues>,
  | 'setValue'
  | 'setError'
  | 'clearErrors'
  | 'getValues'
  | 'reset'
  | 'setFocus'
  | 'resetField'
  | 'trigger'
  | 'unregister'
  | 'watch'
  | 'formState'
> & {
  submit: ReturnType<UseFormReturn<TFieldValues>['handleSubmit']>;
};

export type FormControlArrayRef<
  TFieldValues extends FieldValues = FieldValues,
  TArrayName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>
> = UseFieldArrayReturn<TFieldValues, TArrayName>;

type RHFormBase = <TFieldValues extends FieldValues = FieldValues>(
  props: RHFormProps<TFieldValues>
) => ReactElement;

export type RHFormComponent = RHFormBase & {
  Control: <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  >(
    props: FormControlProps<TFieldValues, TName>
  ) => ReactElement;
  ControlArray: <
    TFieldValues extends FieldValues = FieldValues,
    TArrayName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>
  >(
    props: FormControlArrayProps<TFieldValues, TArrayName>
  ) => ReactElement;
};

export interface RHFormProps<TFieldValues extends FieldValues = FieldValues> {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  formOptions?: UseFormProps<TFieldValues>;
  showAsterisk?: boolean;
  ref?: React.Ref<RHFormRef<TFieldValues>>;
  onChange?: (values: DeepPartial<TFieldValues>) => void;
  onSubmit?: SubmitHandler<TFieldValues>;
  onError?: SubmitErrorHandler<TFieldValues>;
}

export interface FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  children:
    | ReactElement<any>
    | ((fieldState: {
        field: ControllerRenderProps<TFieldValues, TName>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
      }) => ReactElement);
  rules?: RegisterOptions<TFieldValues, TName>;
  name: TName;
  label?: string;
  className?: string;
  id?: string;
  value?: any;
  shouldUnregister?: boolean;
  disabled?: boolean | Visibility<TFieldValues>;
  visibility?: boolean | Visibility<TFieldValues>;
  description?: string | { text: string; position?: 'LABEL_RIGHT' | 'LABEL_BOTTOM' };
}

export interface FormControlArrayProps<
  TFieldValues extends FieldValues = FieldValues,
  TArrayName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>
> extends Omit<UseFieldArrayProps<TFieldValues, TArrayName>, 'control'> {
  ref?: React.Ref<FormControlArrayRef<TFieldValues, TArrayName>>;
  className?: string;
  children: ReactNode;
  visibility?: ControlArrayVisibilityMap<TFieldValues, TArrayName>;
  disabled?: ControlArrayVisibilityMap<TFieldValues, TArrayName>;
}

type StringOperators =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'STARTS_WITH'
  | 'ENDS_WITH'
  | 'INCLUDES'
  | 'NOT_INCLUDES';

type NumberOperators =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN_OR_EQUAL';

type BooleanOperators = 'EQUALS' | 'NOT_EQUALS';

type OperatorForType<T> = T extends string
  ? StringOperators
  : T extends number
  ? NumberOperators
  : T extends boolean
  ? BooleanOperators
  : never;

type ValueForType<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : never;

type Condition<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>> = {
  name: TFieldName;
  value: ValueForType<NonNullable<PathValue<TFieldValues, TFieldName>>>;
  operator: OperatorForType<NonNullable<PathValue<TFieldValues, TFieldName>>>;
};

type AnyCondition<TFieldValues extends FieldValues> = {
  [K in FieldPath<TFieldValues>]: Condition<TFieldValues, K>;
}[FieldPath<TFieldValues>];

export interface Visibility<TFieldValues extends FieldValues = FieldValues> {
  operator: 'AND' | 'OR';
  conditions: Array<AnyCondition<TFieldValues>>;
}

type FieldArrayItem<T> = T extends ReadonlyArray<infer U> ? U : never;

type FieldArrayItemFromValues<
  TFieldValues extends FieldValues,
  TArrayName extends ArrayPath<TFieldValues>
> = FieldArrayItem<
  PathValue<TFieldValues, TArrayName & FieldPath<TFieldValues>>
> extends FieldValues
  ? FieldArrayItem<PathValue<TFieldValues, TArrayName & FieldPath<TFieldValues>>>
  : FieldValues;

export type ControlArrayVisibilityMap<
  TFieldValues extends FieldValues,
  TArrayName extends ArrayPath<TFieldValues>
> = Partial<
  Record<
    FieldPath<FieldArrayItemFromValues<TFieldValues, TArrayName>>,
    Visibility<FieldArrayItemFromValues<TFieldValues, TArrayName>>
  >
>;

export interface ControlledFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  children: ReactElement<any>;
  className?: string;
  label?: string;
  id?: string;
  required?: boolean;
  visibility?: boolean | Visibility<TFieldValues>;
}

export interface ConditionCheckProps<TFieldValues extends FieldValues = FieldValues> {
  children: React.ReactNode;
  visibility?: boolean | Visibility<TFieldValues>;
}

export interface DisableCheckProps<TFieldValues extends FieldValues = FieldValues> {
  children: ReactElement<any>;
  disabled?: boolean | Visibility<TFieldValues>;
}

export type ConditionDataType = string | number | boolean;

export interface RHFormContextType {
  showAsterisk?: boolean;
}

export interface RHFormProviderProps {
  children: ReactNode;
  showAsterisk?: boolean;
}
