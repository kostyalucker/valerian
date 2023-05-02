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
    const departmentId = Object.keys(router.query)[0];
    const machineTypesResponse = await fetch("/api/machineTypes");
    const machineDepartmentsResponse = await fetch(
      `/api/departments?${departmentId}`
    );
    const promises = await Promise.all([
      machineTypesResponse,
      machineDepartmentsResponse,
    ]);
    const jsonPromises = promises.map(async (promise) => {
      return await promise.json();
    });
    const dataForMachines = await Promise.all(jsonPromises);

    const formattedMachineTypes = dataForMachines[0]?.map((type) => {
      return {
        value: type._id,
        label: type.name,
      };
    });
    const fields = createMachineFields(formattedMachineTypes);

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
      }

      return response;
    } catch (error) {
      setMessage("Ошибка при добавлении станка");

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
