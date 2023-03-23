import { useForm } from "react-hook-form"
import { useRouter } from "next/router";

import Input from '@/components/Input'
import Button from '@/components/Button'

import styles from './styles.module.css'
import { useEffect, useState } from "react";

export function CreateIndicatorsForm({ onIndicatorsCreateSuccess }) {
  const { control, register, getValues, formState: { errors }, reset, handleSubmit } = useForm({
    defaultValues: {
      concentration: '',
      ph: '',
      capacity: '',
      firstName: '',
      lastName: '',
      patronymic: '',
    }
  });

  const router = useRouter()

  async function onIndicatorsCreate() {
    const values = getValues()

    values.machineId = router.query.id;

    if (!values.ph || !values.capacity || !values.firstName || !values.lastName || !values.patronymic || !values.concentration) {
      return
    }

    try {
      const response = await fetch("/api/indicators", {
        method: 'POST',
        body: JSON.stringify(values)
      })

      if (response.ok) {
        onIndicatorsCreateSuccess();
        reset();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const registerRequiredField = (fieldName) => {
    return register(fieldName, {
      required: true
    })
  }

  const ph = registerRequiredField("ph");
  const concentration = registerRequiredField("concentration");
  const capacity = registerRequiredField("capacity");
  const firstName = registerRequiredField("firstName");
  const lastName = registerRequiredField("lastName");
  const patronymic = registerRequiredField("patronymic");

  const isErrors = Object.keys(errors).length > 0;

  return (
    <div>
      <p className="text-xl font-bold mb-4">Добавление показаний</p>
      <div>
        <p className="mb-2">pH</p>
        <Input {...ph} inputref={ph.ref} className={styles.input} type="number" />
      </div>
      <div>
        <p className="mb-2">Концентрация</p>
        <Input {...concentration} inputref={concentration.ref} className={styles.input} type="number" />
      </div>
      <div>
        <p className="mb-2">Долив</p>
        <Input {...capacity} inputref={capacity.ref} className={styles.input}  type="number" />
      </div>
      <div>
        <p className="mb-2">Имя</p>
        <Input {...firstName} inputref={firstName.ref} className={styles.input} type="text" />
      </div>
      <div>
        <p className="mb-2">Фамилия</p>
        <Input {...lastName} inputref={lastName.ref} className={styles.input}  type="text" />
      </div>
      <div>
        <p className="mb-2">Отчество</p>
        <Input {...patronymic} inputref={patronymic.ref} className={styles.input} type="text" />
      </div>
      <Button className="disabled:pointer-events-none" onClick={handleSubmit(onIndicatorsCreate)} disabled={isErrors}>
        Добавить показания
      </Button>
      {isErrors && (
        <p className="text-red-400 mt-2">
          Заполните все поля формы
        </p>
      )}
    </div>
  )
}