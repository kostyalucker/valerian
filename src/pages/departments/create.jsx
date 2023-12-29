import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter, router } from "next/router";

import { createDepartmentFields } from "@/constants/forms";
import { ROLES } from "@/constants/users";
import { FormMaster } from "@/components/FormMaster";
import { baseUrl } from "@/config";
import { useCustomerInfo } from "../../hooks/useCustomerInfo";
export default function CreateUserPage() {
  const fields = createDepartmentFields();
  const router = useRouter();

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

  const { customerInfo } = useCustomerInfo(customerId);

  return (
    <>
      {customerInfo && (
        <div className="mb-4">
          <p className="mb-2">Предприятие: {customerInfo.name}</p>
          <p>Адрес предприятие: {customerInfo.address} {customerInfo.city}</p>
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
