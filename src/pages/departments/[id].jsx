import Link from "next/link";
import { Title } from "@/components/Title";
import { baseApiUrl } from "@/config";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import DeleteDialog from "../../components/modals/Delete";
import { dialog } from "../../constants/dialog";
import Button from "@/components/Button";
import { useCustomerInfo } from "@/hooks/useCustomerInfo";

export default function DepartmentPage(props) {
  const router = useRouter();
  const [machines, setMachines] = useState(props.machines);
  const session = useSession();
  const [selectedMachine, setSelectedMachine] = useState();

  const [department, setDepartment] = useState({});

  const [isShowDelete, setIsShowDelete] = useState(false);

  const [customer, setCustomer] = useState({});

  const user = session?.data?.user;

  const isSuperAdmin = session?.data?.user?.role === "SUPERADMIN";
  const isEngineer = session?.data?.user?.role === "ENGINEER";
  const customerId = router.query.userId;

  const { customerInfo } = useCustomerInfo(customerId);

  const accessToAdd = isSuperAdmin || isEngineer;

  async function getDepartmentInfo() {
    const id = router.query.id;
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

  function openMachine(e, machine) {
    e.preventDefault();
    if (e.target.dataset.id === "edit") {
      router.push(
        `/machines/edit?machineId=${machine._id}&userId=${customerId}`
      );
    } else if (e.target.dataset.id === "delete") {
      setSelectedMachine(machine);

      setIsShowDelete(true);
    } else {
      router.push(`/machines/${machine._id}`);
    }
  }

  function closeDeleteModal() {
    setIsShowDelete(false);
  }

  async function deleteMachine() {
    try {
      const response = await fetch(
        `${baseApiUrl}/machines/${selectedMachine._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status !== 200) {
        throw new Error("Delete Machine error");
      }

      await response.json();

      const filteredMachines = machines.filter(
        (machines) => machines._id !== selectedMachine._id
      );

      setMachines(filteredMachines);
      setIsShowDelete(false);
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  useEffect(() => {
    getDepartmentInfo();
  }, []);

  return (
    <>
      {isShowDelete && (
        <DeleteDialog
          description={dialog.deleteMachine(selectedMachine.machineNumber)}
          cancel={closeDeleteModal}
          delete={deleteMachine}
        />
      )}
      {customerInfo && (
        <div className="">
          <span>
            <span className="font-semibold mb-2">Наименование Заказчика: </span>
            <span>{customerInfo.name}</span>
          </span>
          <p className="mb-2">
            <span className="font-semibolds">Адрес: </span>{" "}
            {customerInfo.address}
          </p>
        </div>
      )}
      {department && (
        <div className="">
          <p className="mb-2">
            <span className="font-semibold">ЦЕХ№: </span>
            {department.name}
          </p>
          <div className="">
            <span className="font-semibold">Контактная информация:</span>
            <p>
              <span className="font-semibold">Имя: </span>
              {department.contactName}
            </p>
            <p>
              {" "}
              <span className="font-semibold">Телефон: </span>
              {department.contactPhone}
            </p>
            <p>
              <span className="font-semibold">Email: </span>
              {department.contactEmail}
            </p>
          </div>
        </div>
      )}
      <div className="flex mb-4 items-center">
        <Title>Выберите станок</Title>
        {accessToAdd && (
          <Link
            className="text-blue-400 ml-8"
            href={`/machines/create?${router.query.id}`}
          >
            <Button>Добавить</Button>
          </Link>
        )}
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                №
              </th>
              <th scope="col" className="px-6 py-3">
                Номер станка
              </th>
              <th scope="col" className="px-6 py-3">
                Тип оборудования
              </th>
              <th scope="col" className="px-6 py-3">
                Модель
              </th>
              <th scope="col" className="px-6 py-3">
                Емкость системы (л)
              </th>
              {user.role === "SUPERADMIN" && (
                <th scope="col" className="px-6 py-3"></th>
              )}
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {machines ? (
              machines?.map((machine, index) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer "
                  key={machine._id}
                  onClick={(e) => openMachine(e, machine)}
                >
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">{machine.machineNumber}</td>
                  <td className="px-6 py-4">{machine.type}</td>
                  <td className="px-6 py-4">{machine.model}</td>
                  <td className="px-6 py-4">{machine.machineCapacity}</td>
                  {user.role === "SUPERADMIN" && (
                    <td className="px-6 py-4 bg-gray text">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        data-id="delete"
                      >
                        Удалить
                      </button>
                    </td>
                  )}
                  <td className="text edit">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                      data-id="edit"
                    >
                      Редактировать
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <span className="w-full font-semibold text-xl text-center">
                Здесь будет список станков
              </span>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

DepartmentPage.auth = {
  loading: "loading",
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  try {
    const response = await fetch(`${baseApiUrl}/machines?department=${id}`);
    if (!response.ok) {
      throw new Error("Error");
    }

    const machines = await response.json();

    return {
      props: {
        machines,
      },
    };
  } catch (error) {
    return {
      props: {
        machines: [],
      },
    };
  }
}
