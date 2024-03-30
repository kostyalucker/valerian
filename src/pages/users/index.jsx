import { baseApiUrl } from "@/config";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";
import DeleteDialog from "../../components/modals/Delete";
import { useState } from "react";

import { dialog } from "../../constants/dialog";
export default function UsersPage({ users, baseUrl }) {
  const { data: session } = useSession();
  const activeUser = session?.user;

  const [selectedCustomerId, setSelectedCustomerId] = useState();
  const [isLoading, setLoading] = useState(false);

  const [isShowModalDelete, setShowModalDelete] = useState(false);
  const [usersState, setUsers] = useState(users);

  async function deleteCustomer() {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/api/users/${selectedCustomerId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status !== 200) {
        throw new Error("Delete customer error");
      }

      const deletedUser = await response.json();
      const filteredCustomers = usersState.filter(
        (user) => user._id !== deletedUser.id
      );

      setUsers(filteredCustomers);
      setShowModalDelete(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function cancel() {
    setShowModalDelete(false);
  }

  function openCustomer(e, id) {
    e.preventDefault();

    if (e.target.dataset.id === "delete") {
      setSelectedCustomerId(id);
      setShowModalDelete(true);
    }
  }
  return (
    <>
      {isShowModalDelete && (
        <DeleteDialog
          description={dialog.deleteCustomer()}
          delete={deleteCustomer}
          cancel={cancel}
        />
      )}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 flex items-center cursor-pointer"
                onClick={() => sorted()}
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
              <th scope="col" className="px-6 py-3">
                Регион
              </th>
              <th scope="col" className="px-6 py-3">
                Город
              </th>
              <th scope="col" className="px-6 py-3">
                Инн
              </th>
              {activeUser && activeUser?.role === "CUSTOMER" && (
                <th scope="col" className="px-6 py-3"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {usersState?.map((user) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer "
                key={user._id}
                onClick={(e) => openCustomer(e, user._id)}
              >
                <td
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {user.name}
                </td>
                <td className="px-6 py-4">{user.region}</td>
                <td className="px-6 py-4">{user.city}</td>
                <td className="px-6 py-4">{user.inn}</td>
                {activeUser && activeUser.role === "CUSTOMER" && (
                  <td className="px-6 py-4 bg-gray text">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      data-id="delete"
                    >
                      Удалить
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  let users = [];
  const { req } = ctx;

  try {
    const session = await getSession({ req });
    const idUser = session?.user.id;
    const role = session?.user.role;

    const response = await fetch(
      `${baseApiUrl}/users?userId=${idUser}&role=${role}`
    );
    const json = await response.json();

    if (!response.ok) {
      throw new Error("server error");
    }

    users = json;
  } catch (error) {
    console.log(error);
  } finally {
    return {
      props: {
        users: users,
        baseUrl: process.env.NEXTAUTH_URL,
      },
    };
  }
}
