import { useForm } from "react-hook-form";
import Input from '@/components/Input'
import Button from '@/components/Button'
import { useRouter } from "next/router";

export default function IndicatorPage({ indicator }) {
  const router = useRouter();
  const { 
      concentration,
      fungi,
      ph,
      conductivity,
      bacteriaAmount,
      reason 
  } = indicator;
  
  const { register, getValues, formState: { isValid }, handleSubmit } = useForm({
    defaultValues: {
      concentration,
      fungi,
      ph,
      conductivity,
      bacteriaAmount,
      reason
    }
  });

  const registerRequiredField = (fieldName) => {
    return register(fieldName, {
      required: true
    })
  }

  async function onIndicatorsEdit() {
    const values = getValues()
    console.log(values, isValid);
    if (!isValid) {
      return
    }

    try {
      const response = await fetch(`/api/indicators/${router.query.id}`, {
        method: 'PUT',
        body: JSON.stringify(values)
      })

      if (response.ok) {
        router.back();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const phField = registerRequiredField("ph");
  const concentrationField = registerRequiredField("concentration");
  const conductivityField = registerRequiredField("conductivity");
  const bacteriaAmoutField = registerRequiredField("bacteriaAmount");
  const fungiField = registerRequiredField("fungi");
  const reasonField = registerRequiredField("reason");

  return (
    <>
      <p className="text-xl font-bold mb-4">Редактирование показаний</p>
      <div>
        <p className="mb-2">pH</p>
        <Input className="w-full" {...phField} inputref={phField.ref} type="number" />
      </div>
      <div>
        <p className="mb-2">Концентрация</p>
        <Input className="w-full" {...concentrationField} inputref={concentrationField.ref} type="number" />
      </div>
      <div>
        <p className="mb-2">Электропроводность, мкмСм/см </p>
        <Input className="w-full" {...conductivityField} inputref={conductivityField.ref} type="number" />
      </div>
      <div>
        <p className="mb-2">Количество бактерий, КОЕ/мл</p>
        <Input className="w-full" {...bacteriaAmoutField} inputref={bacteriaAmoutField.ref} type="text" />
      </div>
      <div>
        <p className="mb-2">Грибки, уровень</p>
        <Input className="w-full" {...fungiField} inputref={fungiField.ref} type="text" />
      </div>
      <div>
        <p className="mb-2">Причина изменений</p>
        <Input className="w-full" {...reasonField} inputref={reasonField.ref} type="text" />
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