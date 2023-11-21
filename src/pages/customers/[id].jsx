import { useForm } from "react-hook-form";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import { baseApiUrl, baseUrl } from "@/config";
import { getSession } from "next-auth/react";

export default function CustomersPage({ customer }) {
  const router = useRouter();
  const { name, email, inn, city, region, address } = customer;

  const {
    register,
    getValues,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name,
      email,
      inn,
      city,
      region,
      address,
    },
  });

  const registerRequiredField = (fieldName) => {
    return register(fieldName, {
      required: true,
    });
  };

  async function onCustomerEdit() {
    const values = getValues();
    console.log(values, isValid);
    if (!isValid) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${router.query.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      if (response.ok) {
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const nameField = registerRequiredField("name");
  const emailField = registerRequiredField("email");
  const innField = registerRequiredField("inn");
  const cityField = registerRequiredField("city");
  const regionField = registerRequiredField("region");
  const addressField = registerRequiredField("address");

  return (
    <>
      <p className="text-xl font-bold mb-4">Редактирование заказчика</p>

      <div>
        <p className="mb-2">Наименование</p>
        <Input
          className="w-full"
          {...nameField}
          inputref={nameField.ref}
          type="text"
        />
      </div>
      <div>
        <p className="mb-2">Email</p>
        <Input
          className="w-full"
          {...emailField}
          inputref={emailField.ref}
          type="email"
        />
      </div>
      <div>
        <p className="mb-2">ИНН</p>
        <Input
          className="w-full"
          {...innField}
          inputref={innField.ref}
          type="number"
        />
      </div>
      <div>
        <p className="mb-2">Город</p>
        <Input
          className="w-full"
          {...cityField}
          inputref={cityField.ref}
          type="text"
        />
      </div>
      <div>
        <p className="mb-2">Регион</p>
        <Input
          className="w-full"
          {...regionField}
          inputref={regionField.ref}
          type="text"
        />
      </div>
      <div>
        <p className="mb-2">Адрес</p>
        <Input
          className="w-full"
          {...addressField}
          inputref={addressField.ref}
          type="text"
        />
      </div>
      <Button
        className="disabled:pointer-events-none"
        onClick={handleSubmit(onCustomerEdit)}
        disabled={!isValid}
      >
        Подтвердить
      </Button>
      {!isValid && (
        <p className="text-red-400 mt-2">Заполните все поля формы</p>
      )}
    </>
  );
}

CustomersPage.auth = {
  loading: "loading",
};

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session?.user?.role === "CUSTOMER") {
    return {
      redirect: {
        destination: baseUrl + "/dashboard",
      },
    };
  }

  try {
    const { id } = context.params;
    const response = await fetch(`${baseApiUrl}/users/${id}`);
    const customer = await response.json();

    return {
      props: {
        customer,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
