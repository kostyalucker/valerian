import { useMasterForm } from "@/hooks/useMasterForm"
import { FORM_COMPONENTS_MAP } from "@/constants";
import Button from '@/components/Button'
import { useState } from "react";

// todo: problem with dynamic fields, reset doesn't work
export function FormMaster({ title, fields, onSubmit }) {
  const { getValues, formState: { isValid }, reset, handleSubmit, registeredFields } = useMasterForm(fields);
  const [error, setError] = useState(false);

  const onFormSubmit = () => {
    try {
      const values = getValues()

      if (!isValid) {
        return
      }

      handleSubmit(async () => {
        const response = await onSubmit(values);
        
        if (response.ok) {
          reset();

          return;
        }
        
        throw new Error('server error')
      }, (err) => {
        console.log(err)
      })()

    } catch (error) {
      console.log(error);
      setError(true)

      setTimeout(() => {
        setError(false)
      }, 10000);
    }
  }

  return (
    <>
      <p className="text-xl font-bold mb-4">{title}</p>
      {registeredFields?.length && registeredFields.map(field =>  {
        const Component = FORM_COMPONENTS_MAP[field.component];

        return (
          <div key={field.label + field.name}>
            <p className="mb-2">{field.label}</p>
            <Component {...field} inputref={field.ref} className="w-full" type={field.type} />
          </div>
        )
      })}
      <Button className="disabled:pointer-events-none" onClick={onFormSubmit} disabled={!isValid}>
        Добавить
      </Button>
      {!isValid && (
        <p className="text-red-400 mt-2">
          Заполните все поля формы
        </p>
      )}
      {error && (
        <p className="text-red-400 mt-2">
          Ошибка при операции
        </p>
      )}
    </>
  )
}