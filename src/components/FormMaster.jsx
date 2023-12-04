import { useMasterForm } from "@/hooks/useMasterForm";
import { FORM_COMPONENTS_MAP } from "@/constants";
import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// todo: problem with dynamic fields, reset doesn't work
export function FormMaster({
  title,
  name,
  type,
  fields,
  onSubmit,
  onChangeRole,
}) {
  const {
    getValues,
    formState: { isValid },
    reset,
    handleSubmit,
    registeredFields,
    watch,
  } = useMasterForm(fields);
  const [error, setError] = useState(false);
  const router = useRouter();

  const onFormSubmit = (e) => {
    e.preventDefault();

    try {
      const values = getValues();

      if (!isValid) {
        return;
      }

      handleSubmit(
        async () => {
          const response = await onSubmit(values);

          if (response?.ok) {
            return;
          }

          setError(true);

          setTimeout(() => {
            setError(false);
          }, 10000);
        },
        (err) => {
          console.log(err);
        }
      )();
    } catch (error) {
      setError(true);

      setTimeout(() => {
        setError(false);
      }, 10000);
    } finally {
      // TODO: remove force reload and fix updates
      // router.reload(window.location.pathname);
    }
  };

  const watchedRole = watch("role", "ADMIN");

  const setValueField = (fieldName, value) => {
    if (fieldName === "role") {
      onChangeRole(fieldName, value);
    }
  };

  function createClassName(str) {
    let result = str.replace(/([A-Z])/g, " $1"); // добавляем пробелы перед заглавными буквами
    result = result.trim().toLowerCase(); // убираем лишние пробелы и приводим к нижнему регистру
    result = result.replace(/\s+/g, "-"); // заменяем пробелы на дефисы
    return "form-master--" + result;
  }

  return (
    <>
      <p className="text-xl font-bold mb-4">{title}</p>
      {registeredFields?.length &&
        registeredFields.map((field) => {
          const Component = FORM_COMPONENTS_MAP[field.component];

          // TODO: remove hardcode
          if (field.name === "inn") {
            if (watchedRole === "CUSTOMER") {
              return (
                <div key={field.label + field.name}>
                  <p className="mb-2">{field.label}</p>
                  <Component
                    {...field}
                    inputref={field.ref}
                    className="w-full"
                    type={field.type}
                  />
                </div>
              );
            }

            return;
          }

          return (
            <div
              key={field.label + field.name}
              className={createClassName(field.name)}
            >
              <p className="mb-2">{field.label}</p>
              <Component
                {...field}
                inputref={field.ref}
                className="w-full"
                type={field.type}
                onChange={(e) => setValueField(field.name, e.target.value)}
              />
            </div>
          );
        })}
      <Button
        className="disabled:pointer-events-none mr-2 "
        onClick={onFormSubmit}
        disabled={!isValid}
      >
        {type === "edit" ? "Сохранить" : "Добавить"}
      </Button>
      <Button className="disabled:pointer-events-none">
        <Link href="/">Домой</Link>
      </Button>
      {!isValid && (
        <p className="text-red-400 mt-2">Заполните все поля формы</p>
      )}
      {error && <p className="text-red-400 mt-2">Ошибка при операции</p>}
    </>
  );
}
