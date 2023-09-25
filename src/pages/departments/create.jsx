import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import { createDepartmentFields } from "@/constants/forms";
import { ROLES } from "@/constants/users";
import { FormMaster } from "@/components/FormMaster";
import { baseUrl } from "@/config";

export default function CreateUserPage() {
  const fields = createDepartmentFields();
  const router = useRouter();

  async function onDepartmentCreate(values) {
    if (!router.query.userId) {
      return;
    }

    const valuesWithUserId = {
      ...values,
      user: router.query.userId,
    };

    const response = await fetch(`/api/departments`, {
      method: "POST",
      body: JSON.stringify(valuesWithUserId),
    });

    return response;
  }

  return (
    <>
      <FormMaster
        title="Добавить цех"
        fields={fields}
        onSubmit={onDepartmentCreate}
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
  const isAdminRole =
    session?.user?.role === ROLES.admin ||
    session?.user?.role === ROLES.superAdmin;

  if (!isAdminRole) {
    return {
      redirect: { destination: `${baseUrl}/dashboard` },
    };
  }

  return {
    props: {},
  };
}
