import Link from "next/link";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";

import { Title } from "@/components/Title";
import { baseApiUrl, baseUrl } from "@/config";
import { ROLES } from "@/constants/users";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import Delete from "../../components/modals/Delete";

export default function Departments(props) {
  const { departments } = props;

  const session = useSession();
  const router = useRouter();

  const [departmentsList, setDepartmentsList] = useState(departments);
  const [isShowDelete, setIsShowDelete] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({});

  const [customer, setCustomer] = useState();

  const idCustomer = router.query.userId;
  const isSuperAdmin = session?.data?.user?.role === ROLES.superAdmin;
  const isEngineer = session?.data?.user?.role === ROLES.engineer;

  function openDepartment(e, id, department) {
    e.preventDefault();
    if (e.target.dataset.id === "edit") {
      router.push(`/departments/${id}`);
    } else if (e.target.dataset.id === "delete") {
      setSelectedDepartment(department);

      setIsShowDelete(true);
    } else {
      router.push(`/departments?userId=${id}`);
    }
  }

  async function deleteDepartment() {
    try {
      const response = await fetch(
        `${baseApiUrl}/departments/${selectedDepartment._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status !== 200) {
        throw new Error("Delete customer error");
      }

      await response.json();

      const filteredDepartments = departmentsList.filter(
        (department) => department._id !== selectedDepartment._id
      );

      setDepartmentsList(filteredDepartments);
      setIsShowDelete(false);
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  async function getInfoCustomer(id) {
    if (!id) {
      return;
    }

    const response = await fetch(`/api/users/${id}`).then((res) => {
      return res.json();
    });

    setCustomer(response);
  }

  useEffect(() => {
    getInfoCustomer(idCustomer);
  }, [idCustomer]);

  function unshowDeleteModal() {
    setIsShowDelete(false);
  }

  return (
    <>
      {isShowDelete && (
        <Delete
          description={`Вы хотите удалить цех ${selectedDepartment.departmentNumber}!! После удаления цех и его данные будут удалены`}
          delete={deleteDepartment}
          cancel={unshowDeleteModal}
        />
      )}
      {customer && (
        <div className="mb-4">
          <p className="mb-2">Предприятие: {customer.name}</p>
          <p>Адрес предприятие: {customer.address}</p>
        </div>
      )}
      <div className="title__container flex items-center mb-4">
        <Title>Выберите цех</Title>
        {(router.query.userId && isSuperAdmin) || isEngineer ? (
          <Link
            href={`/departments/create?userId=${router.query.userId}`}
            className="ml-4 text-blue-400"
          >
            Добавить
          </Link>
        ) : null}
      </div>
      <ul></ul>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 flex items-center cursor-pointer"
              >
                <span className="col-name">Имя</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-arrows-sort"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M3 9l4-4l4 4m-4 -4v14" />
                  <path d="M21 15l-4 4l-4-4m4 4v-14" />
                </svg>
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {departmentsList?.map((department) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer "
                key={department._id}
                onClick={(e) => openDepartment(e, department._id, department)}
              >
                <td
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  <Link
                    className="flex items-center justify-center w-full bg-slate-400 text-white "
                    href={{
                      pathname: `/departments/${department._id}`,
                    }}
                    key={department._id}
                  >
                    {department.departmentNumber}
                  </Link>
                </td>
                <td className="px-6 py-4 bg-gray text">
                  {router.query.userId && isSuperAdmin ? (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4"
                      data-id="delete"
                    >
                      Удалить
                    </button>
                  ) : null}

                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    data-id="edit"
                  >
                    Редактировать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

Departments.auth = {
  role: "CUSTOMER",
  loading: "loading",
};

export async function getServerSideProps(context) {
  const { req, query } = context;
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: `${baseUrl}/`,
      },
    };
  }

  const { role, id } = session?.user;
  let url;

  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  if (role === "ENGINEER" || isAdmin) {
    const { userId } = query;

    if (!userId) {
      return {
        redirect: {
          destination: `${baseUrl}/customers`,
        },
      };
    }

    url = `${baseApiUrl}/departments?userId=${userId}`;
  } else {
    url = `${baseApiUrl}/departments?userId=${id}`;
  }

  const response = await fetch(url)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      return err;
    });

  return {
    props: {
      departments: response.departments,
    },
  };
}
