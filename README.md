# react-hook-form-component

Type-safe, design-system-agnostic building blocks for React Hook Form. Compose complex, dynamic forms with first-class TypeScript types, conditional visibility/disable rules, and UI-library independence (Ant Design, Material UI, Chakra, Tailwind, or your own components).

## Why react-hook-form-component?

- Built on top of react-hook-form: minimal re-renders, great performance, familiar API.
- Design system agnostic: bring any input component from Antd, MUI, Chakra, or custom.
- TypeScript-first: strong typing for `values`, `names`, and component props.
- Dynamic forms: add/remove field-array items and auto-prefix nested names.
- Conditional logic: hide or disable fields based on other field values.
- Headless primitives: render-prop or element cloning — you choose the control pattern.

## Installation

```bash
npm install react-hook-form-component
# or
yarn add react-hook-form-component
```

## Quick Start

```tsx
import { RHForm } from 'react-hook-form-component';
import { Input } from 'antd'; // or MUI/TextField, Chakra/Input, your custom input

type Values = {
  email: string;
  newsletter: boolean;
  reason?: string;
};

export default function Example() {
  return (
    <RHForm<Values>
      showAsterisk
      formOptions={{ defaultValues: { email: '', newsletter: false, reason: '' } }}
      onChange={(values) => console.log(values)}
    >
      <RHForm.Control<Values, 'email'> name='email' label='Email' rules={{ required: 'Required' }}>
        <Input placeholder='you@example.com' />
      </RHForm.Control>

      <RHForm.Control<Values, 'newsletter'> name='newsletter' label='Subscribe?'>
        {/* any checkbox component works */}
        <input type='checkbox' />
      </RHForm.Control>

      {/* Conditionally show based on newsletter */}
      <RHForm.Control<Values, 'reason'>
        name='reason'
        label='Reason'
        visibility={{
          operator: 'AND',
          conditions: [{ name: 'newsletter', value: true, operator: 'EQUALS' }],
        }}
      >
        <Input placeholder='Tell us more' />
      </RHForm.Control>
    </RHForm>
  );
}
```

## Works With Any UI Library

Use Ant Design, Material UI, Chakra, Mantine, Headless UI, Tailwind, or custom inputs. `RHForm.Control` wires up value/blur/change/disabled props automatically when you pass a React element, or you can use a render function to get full control over `field`, `fieldState`, and `formState`.

### Element pattern (clone element)

```tsx
<RHForm.Control name='firstName' label='First name' rules={{ required: 'Required' }}>
  <Input />
  {/* MUI: <TextField /> / Chakra: <Input /> / custom <MyInput /> */}
  {/* The control receives id, name, value, onChange, onBlur, disabled automatically */}
  {/* Errors render below the control by default */}
  {/* Asterisk appears for required fields when showAsterisk is true */}
  {/* Label and optional description integrate above the control */}
</RHForm.Control>
```

### Render function pattern

```tsx
<RHForm.Control name='age' rules={{ min: { value: 18, message: 'Adults only' } }}>
  {({ field, fieldState }) => <input type='number' {...field} aria-invalid={!!fieldState.error} />}
  {/* Full control of rendering; manage props, classes, and aria yourself */}
</RHForm.Control>
```

## Conditional Visibility and Disable

Hide or disable a field based on other fields using strongly-typed conditions.

```tsx
<RHForm.Control
  name='coupon'
  label='Coupon Code'
  visibility={{
    operator: 'AND',
    conditions: [
      { name: 'newsletter', value: true, operator: 'EQUALS' },
      { name: 'email', operator: 'INCLUDES', value: '@' },
    ],
  }}
  disabled={{
    operator: 'OR',
    conditions: [{ name: 'email', operator: 'NOT_INCLUDES', value: '@' }],
  }}
>
  <input />
  {/* If visibility evaluates false, the whole control is hidden. If disabled evaluates true, the control is disabled. */}
</RHForm.Control>
```

Supported operators are type-aware:

- string: `EQUALS`, `NOT_EQUALS`, `STARTS_WITH`, `ENDS_WITH`, `INCLUDES`, `NOT_INCLUDES`
- number: `EQUALS`, `NOT_EQUALS`, `GREATER_THAN`, `LESS_THAN`, `GREATER_THAN_OR_EQUAL`, `LESS_THAN_OR_EQUAL`
- boolean: `EQUALS`, `NOT_EQUALS`

## Dynamic Arrays with `RHForm.ControlArray`

Easily build repeatable sections (field arrays). Child control names are auto-prefixed (e.g., `items.0.name`). Any `visibility`/`disabled` conditions on children are also auto-prefixed to match the correct nested paths.

```tsx
type Values = { items: { name: string; price: number }[] };

<RHForm<Values> formOptions={{ defaultValues: { items: [{ name: '', price: 0 }] } }}>
  <RHForm.ControlArray name='items'>
    {/* children can contain multiple nested RHForm.Control elements */}
    <div>
      <RHForm.Control name='name' label='Item name'>
        <input />
      </RHForm.Control>
      <RHForm.Control name='price' label='Price'>
        <input type='number' />
      </RHForm.Control>
    </div>
  </RHForm.ControlArray>
</RHForm>;
```

## API Reference

### `RHForm` (component)

| Prop           | Type                                          | Default                                                                                        | Description                                                                                                |
| -------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `children`     | `ReactNode`                                   | —                                                                                              | Form content. Use `RHForm.Control` and `RHForm.ControlArray` inside.                                       |
| `style`        | `React.CSSProperties`                         | `{}`                                                                                           | Container style wrapper.                                                                                   |
| `className`    | `string`                                      | `""`                                                                                           | Container class name.                                                                                      |
| `formOptions`  | `UseFormProps<TFieldValues>`                  | `{ mode: 'onSubmit', reValidateMode: 'onChange', shouldFocusError: true }` plus your overrides | Passed to `useForm`.                                                                                       |
| `showAsterisk` | `boolean`                                     | `false`                                                                                        | Adds a red `*` to labels of required fields (when `rules` exist).                                          |
| `ref`          | `React.Ref<RHFormRef<TFieldValues>>`          | —                                                                                              | Imperative ref exposing a safe subset of `UseFormReturn` (e.g., `setValue`, `trigger`, `formState`, etc.). |
| `onChange`     | `(values: DeepPartial<TFieldValues>) => void` | `undefined`                                                                                    | Called on any watched value change.                                                                        |

`RHFormRef<TFieldValues>` exposes: `setValue`, `setError`, `clearErrors`, `getValues`, `reset`, `setFocus`, `resetField`, `trigger`, `unregister`, `watch`, `handleSubmit`, `formState`.

### `RHForm.Control` (field wrapper)

| Prop               | Type                                                  | Default           | Description                                                                                                                                |
| ------------------ | ----------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `children`         | `ReactElement` or `(ctx) => ReactElement`             | —                 | Either pass an input element to be auto-wired, or a render function receiving `{ field, fieldState, formState }`.                          |
| `name`             | `FieldPath<TFieldValues>`                             | —                 | Field path (fully typed by `TFieldValues`).                                                                                                |
| `rules`            | `RegisterOptions<TFieldValues, TName>`                | `undefined`       | Validation rules (RHF).                                                                                                                    |
| `className`        | `string`                                              | `""`              | Wrapper class.                                                                                                                             |
| `label`            | `string`                                              | `undefined`       | Optional label.                                                                                                                            |
| `id`               | `string`                                              | Auto-generated    | Control id. Auto-generated if omitted; prefixed inside arrays.                                                                             |
| `value`            | `any`                                                 | `undefined`       | External default value for render-function mode. When passing an element, the control uses `children.props.value ?? ''` as `defaultValue`. |
| `shouldUnregister` | `boolean`                                             | `undefined`       | Unregister on unmount (RHF).                                                                                                               |
| `disabled`         | `boolean` or `Visibility<TFieldValues>`               | `false`           | Disable based on a boolean or a condition set.                                                                                             |
| `visibility`       | `boolean` or `Visibility<TFieldValues>`               | `true`            | Show/hide based on a boolean or a condition set.                                                                                           |
| `description`      | `string` or `{ text: string; position?: 'LABEL_RIGHT' | 'LABEL_BOTTOM' }` | `undefined`                                                                                                                                | Optional helper text; displays to the right of the label or below it. |

### `RHForm.ControlArray` (repeatable groups)

Extends `UseFieldArrayProps` (except `control`) with:

| Prop         | Type                                                       | Default     | Description                                                                               |
| ------------ | ---------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `ref`        | `React.Ref<FormControlArrayRef<TFieldValues, TArrayName>>` | —           | Imperative access to underlying `useFieldArray` API.                                      |
| `className`  | `string`                                                   | `undefined` | Wrapper class.                                                                            |
| `children`   | `ReactNode`                                                | —           | Nested structure including `RHForm.Control` components; names are auto-prefixed per item. |
| `visibility` | `ControlArrayVisibilityMap<TFieldValues, TArrayName>`      | `undefined` | Map of child field visibilities, auto-prefixed per row.                                   |
| `disabled`   | `ControlArrayVisibilityMap<TFieldValues, TArrayName>`      | `undefined` | Map of child field disabilities, auto-prefixed per row.                                   |

### `Visibility<TFieldValues>` shape

```ts
type Visibility<TFieldValues> = {
  operator: 'AND' | 'OR';
  conditions: Array<{
    name: FieldPath<TFieldValues>;
    value: string | number | boolean;
    operator: /* operator matches inferred type of the field */
  }>;
};
```

The operator set is inferred from the field type:

- strings: `EQUALS`, `NOT_EQUALS`, `STARTS_WITH`, `ENDS_WITH`, `INCLUDES`, `NOT_INCLUDES`
- numbers: `EQUALS`, `NOT_EQUALS`, `GREATER_THAN`, `LESS_THAN`, `GREATER_THAN_OR_EQUAL`, `LESS_THAN_OR_EQUAL`
- booleans: `EQUALS`, `NOT_EQUALS`

## Design Principles

- Headless first: all UI is opt-in. Bring your own styles and components.
- Minimal glue: thin wrappers around RHF controllers and arrays.
- Ergonomic defaults: id auto-generation, label/description helpers, required asterisk.
- Predictable typing: generic parameters keep field names and values aligned.

## License

MIT © Albin Britto
