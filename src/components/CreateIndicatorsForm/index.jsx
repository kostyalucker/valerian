import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";

import styles from "./styles.module.css";
import { useSession } from "next-auth/react";
import { validateEmptyObjectValue } from "../../utils/validateEmptyObjectValue";

export function CreateIndicatorsForm({ onIndicatorsCreateSuccess }) {
  const {
    register,
    getValues,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      concentration: "",
      fungi: "отсутствуют",
      presenceImpurities: "отсутствуют",
      smell: "",
      ph: "",
      conductivity: "",
      bacteriaAmount: "",
      addedOilAmount: "",
      biocide: "",
      antiFoamAdditive: "",
      fungicide: "",
      batchNumberDate: "",
      notesRecommendations: "",
    },
  });

  const router = useRouter();
  const session = useSession();

  async function onIndicatorsCreate() {
    const values = getValues();
    const isValidValues = validateEmptyObjectValue(values);

    values.machine = router.query.id;
    values.creatorName = session?.data?.user?.name;

    if (!isValidValues) {
      return;
    }

    try {
      const response = await fetch("/api/indicators", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response.ok) {
        onIndicatorsCreateSuccess();
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const registerRequiredField = (fieldName) => {
    return register(fieldName, {
      required: true,
    });
  };

  const phField = registerRequiredField("ph");
  const concentrationField = registerRequiredField("concentration");
  const conductivityField = registerRequiredField("conductivity");
  const bacteriaAmount = registerRequiredField("bacteriaAmount");
  const fungi = registerRequiredField("fungi");
  const smell = registerRequiredField("smell");
  const presenceImpurities = registerRequiredField("presenceImpurities");
  const addedOilAmount = registerRequiredField("addedOilAmount");
  // const foreignOil = registerRequiredField("foreignOil");
  const biocide = registerRequiredField("biocide");
  const fungicide = registerRequiredField("fungicide");
  const batchNumberDate = registerRequiredField("batchNumberDate");
  const antiFoamAdditive = registerRequiredField("antiFoamAdditive");
  // const serviceAdditives = registerRequiredField("serviceAdditives");
  const notesRecommendations = registerRequiredField("notesRecommendations");

  const isErrors = Object.keys(errors).length > 0;

  const fungiOptions = [
    {
      label: "отсутствуют",
      value: "отсутствуют",
    },
    {
      label: "присутствуют",
      value: "присутствуют",
    },
  ];
  const presenceImpuritiesOptions = [
    {
      label: "Да",
      value: "Да",
    },
    {
      label: "Нет",
      value: "Нет",
    },
  ];
  const smellOptions = [
    {
      label: "Резкий",
      value: "Резкий",
    },
    {
      label: "Умеренный",
      value: "Умеренный",
    },
    {
      label: "Практически отсутствует",
      value: "Практически отсутствует",
    },
  ];

  return (
    <div>
      <p className="text-xl font-bold mb-4">Добавление показаний</p>

      <div>
        <p className="mb-2">Концентрация, %</p>
        <Input
          {...concentrationField}
          inputref={concentrationField.ref}
          className={styles.input}
          type="number"
        />
      </div>
      <div>
        <p className="mb-2">Электропроводность, мкмСм/см </p>
        <Input
          className="w-full"
          {...conductivityField}
          inputref={conductivityField.ref}
          type="number"
        />
      </div>
      <div>
        <p className="mb-2">pH</p>
        <Input
          {...phField}
          inputref={phField.ref}
          className={styles.input}
          type="number"
        />
      </div>
      <div>
        <p className="mb-2">Количество бактерий, КОЕ/мл</p>
        <Input
          className="w-full"
          {...bacteriaAmount}
          inputref={bacteriaAmount.ref}
          type="number"
        />
      </div>
      <div>
        <p className="mb-2">Грибки, уровень</p>
        <Select
          options={fungiOptions}
          defaultValue={false}
          className="w-full"
          {...fungi}
          inputref={fungi.ref}
        />
      </div>
      <div>
        <p className="mb-2">Запах</p>
        <Select
          options={smellOptions}
          defaultValue={false}
          className="w-full"
          {...smell}
          inputref={smell.ref}
        />
      </div>
      <div>
        <p className="mb-2">Наличие посторонних примесей</p>
        <div>
          <Select
            options={presenceImpuritiesOptions}
            defaultValue={false}
            className="w-full"
            {...presenceImpurities}
            inputref={presenceImpurities.ref}
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Долив, л</p>
        <Input
          className="w-full"
          {...addedOilAmount}
          inputref={addedOilAmount.ref}
          type="number"
        />
      </div>
      <h2 className="text-xl font-bold mb-2 ">Сервисные присадки:</h2>
      {/* <div>
        <p className="mb-2">Постороннее масло, л</p>
        <Input
          className="w-full"
          {...foreignOil}
          inputref={foreignOil.ref}
          type="text"
        />
      </div> */}
      <div>
        <p className="mb-2">Добавлено биоцида, л</p>
        <Input
          className="w-full"
          {...biocide}
          inputref={biocide.ref}
          type="number"
        />
      </div>
      <div>
        <p className="mb-2">Добавлено фунгицида, л</p>
        <Input
          className="w-full"
          {...fungicide}
          inputref={fungicide.ref}
          type="number"
        />
      </div>
      <div>
        <p className="mb-2">Добавлено антипенной присадки, л</p>
        <Input
          className="w-full"
          {...antiFoamAdditive}
          inputref={antiFoamAdditive.ref}
          type="number"
        />
      </div>
      <div>
        <p className="mb-2">Номер и дата партии</p>
        <Input
          className="w-full"
          {...batchNumberDate}
          inputref={batchNumberDate.ref}
          type="text"
        />
      </div>
      <div>
        <p className="mb-2">Примечания и рекомендации</p>
        <textarea
          className="w-full"
          {...notesRecommendations}
          inputref={notesRecommendations.ref}
          type="text"
          rows="5"
        />
      </div>
      {/* <div>
        <p className="mb-2">Добавлено сервисных присадок, л</p>
        <Input
          className="w-full"
          {...serviceAdditives}
          inputref={serviceAdditives.ref}
          type="text"
        />
      </div> */}
      <Button
        className="disabled:pointer-events-none"
        onClick={handleSubmit(onIndicatorsCreate)}
        disabled={isErrors}
      >
        Добавить показания
      </Button>
      {isErrors && (
        <p className="text-red-400 mt-2">Заполните все поля формы</p>
      )}
    </div>
  );
}
