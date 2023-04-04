import { useForm } from "react-hook-form"
import { useRouter } from "next/router";

import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'

import styles from './styles.module.css'
import { useSession } from "next-auth/react";

export function CreateIndicatorsForm({ onIndicatorsCreateSuccess }) {
  const { register, getValues, formState: { errors }, reset, handleSubmit } = useForm({
    defaultValues: {
      concentration: '',
      fungi: 'отсутствуют',
      ph: '',
      conductivity: '',
      bacteriaAmount: '',
    }
  });

  const router = useRouter()
  const session = useSession()

  async function onIndicatorsCreate() {
    const values = getValues()

    values.machineId = router.query.id;
    values.creatorName = session?.data?.user?.name;
    if (!values.ph || !values.conductivity || !values.creatorName || !values.concentration || !values.bacteriaAmount || !values.fungi) {
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

  const phField = registerRequiredField("ph");
  const concentrationField = registerRequiredField("concentration");
  const conductivityField = registerRequiredField("conductivity");
  const bacteriaAmount = registerRequiredField("bacteriaAmount");
  const fungi = registerRequiredField("fungi");

  const isErrors = Object.keys(errors).length > 0;

  const fungiOptions = [{
    label: 'отсутствуют',
    value: 'отсутствуют'
  }, {
    label: 'присутствуют',
    value: 'присутствуют'
  }]

  return (
    <div>
      <p className="text-xl font-bold mb-4">Добавление показаний</p>
      <div>
        <p className="mb-2">pH</p>
        <Input {...phField} inputref={phField.ref} className={styles.input} type="number" />
      </div>
      <div>
        <p className="mb-2">Концентрация</p>
        <Input {...concentrationField} inputref={concentrationField.ref} className={styles.input} type="number" />
      </div>
      <div>
        <p className="mb-2">Электропроводность, мкмСм/см </p>
        <Input className="w-full" {...conductivityField} inputref={conductivityField.ref} type="number" />
      </div>
      <div>
        <p className="mb-2">Количество бактерий, КОЕ/мл</p>
        <Input className="w-full" {...bacteriaAmount} inputref={bacteriaAmount.ref} type="text" />
      </div>
      <div>
        <p className="mb-2">Грибки, уровень</p>
        <Select options={fungiOptions} defaultValue={false} className="w-full" {...fungi} inputref={fungi.ref} />
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