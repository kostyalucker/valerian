import { createMachineFields } from "@/constants/forms";
import { getSession } from "next-auth/react";
import { FormMaster } from "@/components/FormMaster";
import { useEffect, useState } from "react";
import { baseUrl } from "@/config";
import { useRouter } from "next/router";

export default function CreateMachinePage() {
  const [machineFields, setMachineFields] = useState([]);
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function getDataForMachine() {
    const fields = createMachineFields();

    setMachineFields(fields);
  }

  useEffect(() => {
    try {
      getDataForMachine();
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function onMachineCreate(values) {
    try {
      const departmentId = Object.keys(router.query)[0];
      values.department = departmentId;

      const response = await fetch(`/api/machines`, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setMessage("Станок успешно добавлен");

        setTimeout(() => {
          setMessage("");
        }, 5000);

        if (response.ok) {
          router.back();
        }
      }

      const data = await response.json();

      throw new Error(data.error);
    } catch (error) {
      setMessage(error.message || "Ошибка при добавлении станка");

      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  }

  return (
    <>
      <FormMaster
        title="Добавить станок"
        fields={machineFields}
        onSubmit={onMachineCreate}
      />
      <p className="mt-4">{message}</p>
    </>
  );
}

CreateMachinePage.auth = {
  role: "SUPERADMIN",
  loading: "loading",
};

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  const isRoleWithAccess =
    session?.user?.role === "SUPERADMIN" || session?.user?.role === "ENGINEER";

  if (!isRoleWithAccess) {
    return {
      redirect: { destination: `${baseUrl}/dashboard` },
    };
  }

  return {
    props: {},
  };
}
