import {
  createUserFields,
  createUserFieldsCustomer,
  createUserFieldsInternalEngineer,
} from "@/constants/forms";
import { getSession, useSession } from "next-auth/react";
import { FormMaster } from "@/components/FormMaster";
import { useEffect, useState } from "react";
import { baseUrl, baseApiUrl } from "@/config";
import { validateInn } from "@/utils/validateInn";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function CreateUserPage() {
  const [userFields, setUserFields] = useState([]);
  const { data: session } = useSession();
  const role = session?.user.role;
  const idActiveUser = session?.user.id;
  const router = useRouter();

  async function onUserCreate(values) {
    // TODO: refactoring dependent field inn
    if (values.role === "CUSTOMER") {
      const { result, error } = validateInn(Number(values.inn), new Error());
      values.password = "supreme1";

      if (!result) {
        return error;
      }
    }

    try {
      if (values.role === "INTERNAL_ENGINEER") {
        values.creator = idActiveUser;
        values.password = "external_engineer_supreme";
      }
      const response = await fetch(`/api/users`, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast("Пользователь создан!");
        router.back();
      } else {
        throw new Error("Пользователь с таким ИНН или email уже существует"); // Бросаем ошибку
      }
      // Успешный ответ
    } catch (error) {
      console.log(error, "error");
      // Ошибка сети или другие ошибки
      toast(error.message);
    }
  }

  const formatedField = () => {
    if (role === "ENGINEER") {
      const fields = createUserFieldsCustomer();
      return fields;
    }
    if (role === "CUSTOMER") {
      const fields = createUserFieldsInternalEngineer();
      return fields;
    }
    const fields = createUserFields();
    return fields;
  };

  const onChangeRole = (fieldName, value) => {
    if (fieldName === "role" && value === "CUSTOMER") {
      const fields = userFields.filter(
        (field) => field.name !== "lastName" && field.name !== "patronomyc"
      );

      setUserFields(
        fields.map((field) => {
          if (field.name === "firstName") {
            return {
              ...field,
              name: "companyName",
              label: "Имя компании",
            };
          } else {
            return { ...field };
          }
        })
      );
    } else {
      setUserFields(createUserFields());
    }
  };

  useEffect(() => {
    const fields = formatedField();
    setUserFields(fields);
  }, []);

  return (
    <>
      <FormMaster
        title="Добавить пользователя"
        fields={userFields}
        onSubmit={onUserCreate}
        onChangeRole={onChangeRole}
      />
    </>
  );
}

CreateUserPage.auth = {
  role: "SUPERADMIN",
  loading: "loading",
};

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  const isSuperAdmin = session?.data?.user?.role === "SUPERADMIN";
  const isEngineer = session?.data?.user?.role === "ENGINEER";

  const isShowCreateUser = isSuperAdmin || isEngineer;

  if (isShowCreateUser) {
    return {
      redirect: { destination: `${baseUrl}/dashboard` },
    };
  }

  return {
    props: {},
  };
}
