import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter, router } from "next/router";

import { createDepartmentFields } from "@/constants/forms";
import { ROLES } from "@/constants/users";
import { FormMaster } from "@/components/FormMaster";
import { baseUrl } from "@/config";

export default function CreateUserPage() {
  const [fields, setFields] = useState();
  const router = useRouter();

  const [department, setDepartment] = useState();
  const [customer, setCustomer] = useState();

  const idCustomer = router.query.userId;

  async function onDepartmentEdit(values) {
    if (!department) {
      return;
    }
    try {
      const response = await fetch(`/api/departments/${department._id}`, {
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

  async function getInfoCustomer() {
    if (!idCustomer) {
      return;
    }
    const response = await fetch(`/api/users/${idCustomer}`).then((res) => {
      return res.json();
    });

    setCustomer(response);
  }

  const updateField = () => {
    if (!department) {
      return;
    }
    const fields = createDepartmentFields();

    const updatedFields = fields.map((field) => {
      return {
        ...field,
        defaultValue: department[field.name],
      };
    });
    setFields(updatedFields);
  };

  async function getInfoDepartment() {
    const id = router.query.departmentId;
    if (!id) {
      return;
    }
    const response = await fetch(`/api/departments/${id}`, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });

    setDepartment(response);
  }

  useEffect(() => {
    getInfoCustomer();
    getInfoDepartment();
  }, []);

  useEffect(() => {
    updateField();
  }, [department]);

  return (
    <>
      {customer && (
        <div className="mb-4">
          <p className="mb-2">Предприятие: {customer.name}</p>
          <p>Адрес предприятие: {customer.address}</p>
        </div>
      )}
      {fields && (
        <FormMaster
          title="Добавить цех"
          name="department"
          type="edit"
          fields={fields}
          onSubmit={onDepartmentEdit}
        />
      )}
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
