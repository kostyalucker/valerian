import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter, router } from "next/router";

import { createDepartmentFields } from "@/constants/forms";
import { ROLES } from "@/constants/users";
import { FormMaster } from "@/components/FormMaster";
import { baseUrl } from "@/config";

export default function CreateUserPage() {
  const fields = createDepartmentFields();
  const router = useRouter();

  const [customer, setCustomer] = useState();
  const customerId = router.query.userId;

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

    if (response.ok) {
      router.back();
    }
  }

  async function getCustomerInfo(id) {
    if (!id) {
      return;
    }

    const response = await fetch(`/api/users/${id}`).then((res) => {
      return res.json();
    });

    setCustomer(response);
  }

  useEffect(() => {
    getCustomerInfo(customerId);
  }, [customerId]);
  return (
    <>
      {customer && (
        <div className="mb-4">
          <p className="mb-2">Предприятие: {customer.name}</p>
          <p>Адрес предприятие: {customer.address}</p>
        </div>
      )}
      <FormMaster
        title="Добавить цех"
        name="department"
        type="create"
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
  const isAccessCreation =
    session?.user?.role === ROLES.admin ||
    session?.user?.role === ROLES.superAdmin ||
    session?.user?.role === ROLES.engineer;
  if (!isAccessCreation) {
    return {
      redirect: { destination: `${baseUrl}/dashboard` },
    };
  }

  return {
    props: {},
  };
}
