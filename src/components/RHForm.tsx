import { useImperativeHandle, useEffect } from 'react';
import { FormProvider, useForm, FieldValues } from 'react-hook-form';
import { RHFormProvider } from '../context/RHFormContext';
import { RHFormProps, RHFormComponent } from '../type';
import { FormControl } from './FormControl';
import { FormControlArray } from './FormControlArray';

const RHForm: RHFormComponent = <TFieldValues extends FieldValues = FieldValues>({
  children,
  style = {},
  className = '',
  formOptions,
  showAsterisk,
  ref,
  onChange,
  onSubmit = () => {},
  onError = () => {},
}: RHFormProps<TFieldValues>) => {
  const methods = useForm<TFieldValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    ...formOptions,
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        setValue: methods.setValue,
        setError: methods.setError,
        clearErrors: methods.clearErrors,
        getValues: methods.getValues,
        reset: methods.reset,
        setFocus: methods.setFocus,
        resetField: methods.resetField,
        trigger: methods.trigger,
        unregister: methods.unregister,
        watch: methods.watch,
        formState: methods.formState,
        submit: methods.handleSubmit(onSubmit, onError),
      };
    },
    [methods]
  );

  useEffect(() => {
    const subscription = methods.watch((value) => {
      onChange?.(value);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  return (
    <RHFormProvider showAsterisk={showAsterisk}>
      <FormProvider {...methods}>
        <div style={style} className={className}>
          {children}
        </div>
      </FormProvider>
    </RHFormProvider>
  );
};

RHForm.Control = FormControl;
RHForm.ControlArray = FormControlArray;

export default RHForm;
