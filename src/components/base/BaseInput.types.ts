// src/components/base/BaseInput/BaseInput.types.ts
export type BaseInputSize = 'sm' | 'md' | 'lg';

export type ModelModifiers = {
  trim?: boolean;
  number?: boolean;
};

export type BaseInputProps = {
  modelValue: string | number | null | undefined;
  label?: string;
  hint?: string;
  error?: string | boolean;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  size?: BaseInputSize;
  autofocus?: boolean;
  modelModifiers?: ModelModifiers;
};

export type BaseInputEmits = {
  (e: 'update:modelValue', v: string | number | null): void;
  (e: 'blur', ev: FocusEvent): void;
  (e: 'focus', ev: FocusEvent): void;
  (e: 'keydown', ev: KeyboardEvent): void;
};

export type BaseInputSlots = {
  prefix?: () => unknown;
  suffix?: () => unknown;
};
