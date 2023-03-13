import { useForm } from "react-hook-form"
import Input from '@/components/Input'
import Button from '@/components/Button'

import styles from './styles.module.css'

export function CreateIndicatorsForm() {
  const { control, register, getValues } = useForm({
    defaultValues: {
      concentration: '',
      ph: '',
      capacity: '',
      firstName: '',
      lastName: '',
      patronymic: '',
    }
  });

  function onIndicatorsCreate() {
    const values = getValues()

    console.log(values)
  }

  const ph = register("ph");
  const concentration = register("concentration");
  const capacity = register("capacity");
  const firstName = register("firstName");
  const lastName = register("lastName");
  const patronymic = register("patronymic");

  return (
    <div>
      <Input {...ph} inputref={ph.ref} className={styles.input} type="number" />
      <Input {...concentration} inputref={concentration.ref} className={styles.input} type="number" />
      <Input {...capacity} inputref={capacity.ref} className={styles.input}  type="number" />
      <Input {...firstName} inputref={firstName.ref} className={styles.input} type="text" />
      <Input {...lastName} inputref={lastName.ref} className={styles.input}  type="text" />
      <Input {...patronymic} inputref={patronymic.ref} className={styles.input} type="text" />
      <Button onClick={onIndicatorsCreate}>
        Добавить показания
      </Button>
    </div>
  )
}