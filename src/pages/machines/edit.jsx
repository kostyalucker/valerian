import { createMachineFields } from "@/constants/forms";
import { getSession } from "next-auth/react";
import { FormMaster } from "@/components/FormMaster";
import { useEffect, useState, useCallback } from "react";
import { baseUrl } from "@/config";
import { useRouter } from "next/router";

export default function CreateMachinePage() {
  const [machineFields, setMachineFields] = useState([]);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const idMachine = router.query.machineId;

  async function getMachineData() {
    if (!idMachine) {
      router.push("/machines");
    }

    const response = await fetch(`${baseUrl}/api/machines/${idMachine}`);
    const data = await response.json();

    updateField(data.info);
  }

  async function getDataForMachine() {
    const fields = createMachineFields();

    setMachineFields(fields);
  }

  const updateField = async (machine) => {
    if (!machine) {
      return;
    }
    const fields = createMachineFields();

    const updatedFields = fields.map((field) => {
      return {
        ...field,
        defaultValue: machine[field.name],
      };
    });

    setMachineFields(updatedFields);

    setIsLoading(false);
  };

  useEffect(() => {
    try {
      getDataForMachine();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getMachineData();
  }, []);

  async function onMachineEdit(values) {
    if (!idMachine) {
      return;
    }
    try {
      const response = await fetch(`/api/machines/${idMachine}`, {
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

  return (
    <>
      {!isLoading && (
        <div className="">
          <FormMaster
            title="Редактировать станок"
            fields={machineFields}
            onSubmit={onMachineEdit}
            type="edit"
          />
          <p className="mt-4">{message}</p>
        </div>
      )}
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
