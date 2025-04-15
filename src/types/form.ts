export type Field = {
  value: string;
  error: string;
  touched: boolean;
  dirty: boolean;
  everTyped: boolean;
  validatedOnce: boolean;
  onInput: () => void;
  onBlur: () => void;
};

export type CustomValidatorMap<TFields extends Record<string, any>> = Partial<
  Record<
    keyof TFields,
    (value: string, all: Record<keyof TFields, Field>) => string
  >
>;
