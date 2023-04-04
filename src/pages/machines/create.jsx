import { createMachineFields} from "@/constants/forms";
import { getSession } from "next-auth/react";
import { FormMaster } from "@/components/FormMaster";
import { useEffect, useState } from "react";
import { baseUrl } from '@/config';

export default function CreateMachinePage() {
  const [machineFields, setMachineFields] = useState([]);

  async function getDataForMachine() {
    const machineTypesResponse = await fetch('/api/machineTypes');
    const machineDepartmentsResponse = await fetch('/api/departments');
    const promises = await Promise.all([machineTypesResponse, machineDepartmentsResponse])
    const jsonPromises = promises.map(async promise => {
      return await promise.json();
    })
    const dataForMachines = await Promise.all(jsonPromises)
    const formattedMachineTypes = dataForMachines[0]?.map(type => {
      return {
        value: type._id,
        label: type.name
      }
    })
    const formattedMachineDepartments = dataForMachines[1]?.map(department => {
      return {
        value: department._id,
        label: department.departmentNumber
      }
    })
    const fields = createMachineFields(formattedMachineTypes, formattedMachineDepartments);

    setMachineFields(fields);
  }

  useEffect(() => {
    try {
      getDataForMachine();
    } catch (error) {
      console.log(error)
    }
  }, [])

  async function onMachineCreate(values) {
    const response = await fetch(`/api/machines`, {
      method: 'POST',
      body: JSON.stringify(values)
    })

    console.log('create machine')

    return response;
  }

  return (
    <>
      <FormMaster 
        title="Добавить станок"
        fields={machineFields}
        onSubmit={onMachineCreate}
      />
    </>
  )
}

CreateMachinePage.auth = {
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