import { useForm } from "react-hook-form";

export function useMasterForm(fields = []) {
  const defaultFieldsValues = fields.reduce((acc, curr) => {
    acc[curr.name] = curr.defaultValue;

    return acc;
  }, {});

  const {
    register,
    getValues,
    formState: { isValid },
    reset,
    handleSubmit,
    ...rest
  } = useForm({
    defaultValues: defaultFieldsValues,
  });

  const registeredFields = fields.map((field) => {
    const { label, type, component, options, defaultValue } = field;

    const extraFields = {
      label,
      type,
      component,
    };

    if (component === "select") {
      extraFields.options = options;
      extraFields.defaultValue = defaultValue;
    }

    return {
      ...register(field.name, {
        required: field.required,
      }),
      ...extraFields,
    };
  });

  return {
    ...rest,
    getValues,
    formState: { isValid },
    reset,
    handleSubmit,
    registeredFields,
  };
}
