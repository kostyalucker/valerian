import { useForm } from "react-hook-form"
import { useRouter } from "next/router";

import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'

import styles from './styles.module.css'
import { useSession } from "next-auth/react";
import { validateEmptyObjectValue } from "../../utils/validateEmptyObjectValue";

export function CreateIndicatorsForm({ onIndicatorsCreateSuccess }) {
  const { register, getValues, formState: { errors }, reset, handleSubmit } = useForm({
    defaultValues: {
      concentration: '',
      fungi: 'отсутствуют',
      ph: '',
      conductivity: '',
      bacteriaAmount: '',
      addedOilAmount: '',
      foreignOil: '',
      biocide: '',
      serviceAdditives: '',
    }
  });

  const router = useRouter()
  const session = useSession()

  async function onIndicatorsCreate() {
    const values = getValues()
    const isValidValues = validateEmptyObjectValue(values);

    values.machine = router.query.id;
    values.creatorName = session?.data?.user?.name;

    if (!isValidValues) {
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
  const addedOilAmount = registerRequiredField("addedOilAmount");
  const foreignOil = registerRequiredField("foreignOil");
  const biocide = registerRequiredField("biocide");
  const serviceAdditives = registerRequiredField("serviceAdditives");

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
        <p className="mb-2">Концентрация, %</p>
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
        <p className="mb-2">Долив, л</p>
        <Input className="w-full" {...addedOilAmount} inputref={addedOilAmount.ref} type="text" />
      </div>
      <div>
        <p className="mb-2">Постороннее масло, л</p>
        <Input className="w-full" {...foreignOil} inputref={foreignOil.ref} type="text" />
      </div>
      <div>
        <p className="mb-2">Добавлено биоцида, л</p>
        <Input className="w-full" {...biocide} inputref={biocide.ref} type="text" />
      </div>
      <div>
        <p className="mb-2">Добавлено сервисных присадок, л</p>
        <Input className="w-full" {...serviceAdditives} inputref={serviceAdditives.ref} type="text" />
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