import { createUserFields } from "@/constants/forms";
import { getSession } from "next-auth/react";
import { FormMaster } from "@/components/FormMaster";
import { useEffect, useState } from "react";
import { baseUrl } from '@/config'
import { validateInn } from "@/utils/validateInn";

export default function CreateUserPage() {
  const [userFields, setUserFields] = useState([]);

  async function onUserCreate(values) {
    // TODO: refactoring dependent field inn
    if (values.role === 'CUSTOMER') {
      const validateInnResult = validateInn(Number(values.inn), new Error())

      if (!validateInnResult) {
        console.log('error')

        return;
      }
    }

    const response = await fetch(`/api/users`, {
      method: 'POST',
      body: JSON.stringify(values)
    })

    return response;
  }

  useEffect(() => {
    const fields = createUserFields();

    setUserFields(fields);
  }, [])

  return (
    <>
      <FormMaster 
        title="Добавить пользователя"
        fields={userFields}
        onSubmit={onUserCreate}
      />
    </>
  )
}

CreateUserPage.auth = {
  role: 'SUPERADMIN',
  loading: 'loading'
} 

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session?.user?.role !== "SUPERADMIN") {
    return {
      redirect: { destination: `${baseUrl}/dashboard` },
    };
  }

  return {
    props: {},
  };
}