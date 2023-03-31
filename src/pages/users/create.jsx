import { createUserFields } from "@/constants/forms";
import { getSession } from "next-auth/react";
import { FormMaster } from "@/components/FormMaster";
import { useEffect, useState } from "react";

export default function CreateUserPage() {
  const [userFields, setUserFields] = useState([]);

  async function onUserCreate(values) {
    console.log('create')
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
      redirect: { destination: "/dashboard" },
    };
  }

  return {
    props: {},
  };
}