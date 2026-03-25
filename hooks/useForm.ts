import { useState } from 'react';

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface UseFormReturn {
  values: { [key: string]: any };
  errors: FormErrors;
  touched: { [key: string]: boolean };
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  resetForm: () => void;
  validateAll: () => boolean;
}

interface FormConfig {
  initialValues: { [key: string]: any };
  onSubmit?: (values: { [key: string]: any }) => void | Promise<void>;
  validate?: (values: { [key: string]: any }) => FormErrors;
}

export function useForm(config: FormConfig): UseFormReturn {
  const { initialValues, validate } = config;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const setFieldValue = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const setFieldError = (field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const setFieldTouched = (field: string, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  };

  const validateAll = (): boolean => {
    if (!validate) return true;

    const newErrors = validate(values);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateAll,
  };
}
