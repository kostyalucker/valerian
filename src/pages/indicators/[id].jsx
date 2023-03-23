import { useForm } from "react-hook-form";
import Input from '@/components/Input'
import Button from '@/components/Button'

export default function IndicatorPage({ indicator }) {
  const { concentration, ph, capacity } = indicator;
  
  const { register, getValues, formState: { isValid }, reset, handleSubmit } = useForm({
    defaultValues: {
      concentration,
      ph,
      capacity,
      reason: 's'
    }
  });

  const registerRequiredField = (fieldName) => {
    return register(fieldName, {
      required: true
    })
  }

  async function onIndicatorsEdit() {
    const values = getValues()

    if (!isValid) {
      return
    }

    try {
      const response = await fetch(`/api/indicators/${router.query.id}`, {
        method: 'PUT',
        body: JSON.stringify(values)
      })

      if (response.ok) {
        reset();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const phField = registerRequiredField("ph");
  const concentrationField = registerRequiredField("concentration");
  const capacityField = registerRequiredField("capacity");
  const reasonField = registerRequiredField("reason");

  return (
    <>
      <p className="text-xl font-bold mb-4">Редактирование показаний</p>
      <div>
        <p className="mb-2">pH</p>
        <Input {...phField} inputref={phField.ref} type="number" />
      </div>
      <div>
        <p className="mb-2">Концентрация</p>
        <Input {...concentrationField} inputref={concentrationField.ref} type="number" />
      </div>
      <div>
        <p className="mb-2">Долив</p>
        <Input {...capacityField} inputref={capacityField.ref} type="number" />
      </div>
      <div>
        <p className="mb-2">Причина изменений</p>
        <Input {...reasonField} inputref={reasonField.ref} type="text" />
      </div>
      <Button className="disabled:pointer-events-none" onClick={handleSubmit(onIndicatorsEdit)} disabled={!isValid}>
        Подтвердить
      </Button>
      {!isValid && (
        <p className="text-red-400 mt-2">
          Заполните все поля формы
        </p>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    const { id } = context.params;
    const response = await fetch(`http://localhost:3000/api/indicators/${id}`);
    const indicator = await response.json();

    return {
      props: {
        indicator
      }
    }
  } catch (error) {
    console.log(error)
    return {
      props: {}
    } 
  }

}