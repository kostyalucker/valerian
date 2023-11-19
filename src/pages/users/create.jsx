import { createUserFields, createUserFieldsCustomer } from "@/constants/forms";
import { getSession, useSession } from "next-auth/react";
import { FormMaster } from "@/components/FormMaster";
import { useEffect, useState } from "react";
import { baseUrl } from "@/config";
import { validateInn } from "@/utils/validateInn";
import { baseApiUrl } from "@/config";

export default function CreateUserPage() {
  const [userFields, setUserFields] = useState([]);
  const { data: session } = useSession();
  const role = session?.user.role;

  async function onUserCreate(values) {
    // TODO: refactoring dependent field inn
    if (values.role === "CUSTOMER") {
      const validateInnResult = validateInn(Number(values.inn), new Error());

      if (!validateInnResult) {
        return;
      }
    }
    const response = await fetch(`${baseApiUrl}/users`, {
      method: "POST",
      body: JSON.stringify(values),
    }).then((res) => {
      return res.json();
    });

    return response;
  }

  const formatedField = () => {
    let fields = createUserFields();
    if (role === "ENGINEER") {
      return (fields = createUserFieldsCustomer());
    }
    return fields;
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

  const isShowCreateUser = () => {
    return isSuperAdmin || isEngineer;
  };

  if (isShowCreateUser()) {
    return {
      redirect: { destination: `${baseUrl}/dashboard` },
    };
  }

  return {
    props: {},
  };
}
