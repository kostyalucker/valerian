import Link from "next/link";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";

import { Title } from "@/components/Title";
import { baseApiUrl, baseUrl } from "@/config";
import { ROLES } from "@/constants/users";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import DeleteDialog from "../../components/modals/Delete";

import { dialog } from "../../constants/dialog";
import { useCustomerInfo } from "@/hooks/useCustomerInfo";
export default function Departments(props) {
  const { departments, responseUserInfo, creatorOfCurrentUser } = props;

  const session = useSession();
  const router = useRouter();

  const [departmentsList, setDepartmentsList] = useState(departments);
  const [isShowDelete, setIsShowDelete] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({});

  const customerId = router.query.userId;

  const user = session?.data?.user;
  const isSuperAdmin = session?.data?.user?.role === ROLES.superAdmin;
  const isEngineer = session?.data?.user?.role === ROLES.engineer;
  const isInternalEngineer =
    session?.data?.user?.role === ROLES.internalEngineer;

  function openDepartment(e, id, department) {
    e.preventDefault();
    if (e.target.dataset.id === "edit") {
      console.log(department._id, user.id);
      router.push(
        `/departments/edit?departmentId=${department._id}&userId=${user.id}`
      );
    } else if (e.target.dataset.id === "delete") {
      setSelectedDepartment(department);

      setIsShowDelete(true);
    } else {
      router.push(`/departments/${department._id}?&userId=${user.id}`);
    }
  }

  async function deleteDepartment() {
    try {
      const response = await fetch(
        `/api/departments/${selectedDepartment._id}`,
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

  const { customerInfo } = useCustomerInfo(customerId);

  function closeDeleteModal() {
    setIsShowDelete(false);
  }

  return (
    <>
      {isShowDelete && (
        <DeleteDialog
          description={dialog.deleteDepartment(selectedDepartment.name)}
          delete={deleteDepartment}
          cancel={closeDeleteModal}
        />
      )}
      {customerInfo && (
        <div className="mb-4">
          <p className="mb-2">
            Предприятие:{" "}
            {creatorOfCurrentUser
              ? creatorOfCurrentUser.name
              : customerInfo.name}
          </p>
          <p>
            Адрес предприятия:{" "}
            {creatorOfCurrentUser
              ? creatorOfCurrentUser.address
              : customerInfo.address}
            ,{" "}
            {creatorOfCurrentUser
              ? creatorOfCurrentUser.city
              : customerInfo.city}
          </p>
        </div>
      )}
      <div className="title__container flex items-center mb-4">
        <Title>Выберите цех</Title>
        {(router.query.userId && isSuperAdmin) ||
        isEngineer ||
        isInternalEngineer ? (
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
                  <span
                    className="flex items-center justify-center w-full bg-slate-400 text-white "
                    key={department._id}
                  >
                    {department.name}
                  </span>
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
                  {(isEngineer || isSuperAdmin || isInternalEngineer) && (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                      data-id="edit"
                    >
                      Редактировать
                    </button>
                  )}
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

  const resp = await fetch(`${baseApiUrl}/users/${id}`);

  const activeUserInf = await resp.json();

  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  const respCreatorOfCurrentUser = await fetch(
    `${baseApiUrl}/users/${activeUserInf.creator}`
  );

  const creatorOfCurrentUser = await respCreatorOfCurrentUser.json();

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
  } else if (role === "INTERNAL_ENGINEER") {
    url = `${baseApiUrl}/departments?userId=${activeUserInf.creator}`;
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
      responseUserInfo: activeUserInf,
      creatorOfCurrentUser: creatorOfCurrentUser,
    },
  };
}
