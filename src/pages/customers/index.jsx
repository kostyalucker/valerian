import Link from "next/link";
import { useState } from "react";

import { baseApiUrl } from "@/config";
import { useRouter, router } from "next/router";
import ModalDeleteUser from "../../components/modals/DeleteUser";
export default function CustomersPage({ customers, baseUrl }) {
  const [isLoading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sorted: "ASC",
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState();
  const [isShowModalDelete, setShowModalDelete] = useState(false);
  const [customersState, setCustomers] = useState(customers);

  async function deleteCustomer(id) {
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
      const filteredCustomers = customersState.filter(
        (customer) => customer._id !== deletedUser.id
      );

      setCustomers(filteredCustomers);
      setShowModalDelete(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function openCustomer(e, id) {
    e.preventDefault();

    if (e.target.dataset.id === "edit") {
      router.push(`/customers/${id}`);
    } else if (e.target.dataset.id === "delete") {
      setSelectedCustomerId(id);
      setShowModalDelete(true);
    } else {
      router.push(`/departments?userId=${id}`);
    }
  }

  function cancel() {
    setShowModalDelete(false);
  }

  function sortedCustomersAsc() {
    const sortingCustomers = customersState.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    setCustomers(sortingCustomers);
  }

  function sortedCustomerDesc() {
    const sortedCustomersDesc = customersState.sort((a, b) => {
      return b.name.localeCompare(a.name);
    });
    setCustomers(sortedCustomersDesc);
  }

  function sorted() {
    if (filters.sorted === "ASC") {
      sortedCustomerDesc();
      setFilters({
        sorted: "DESC",
      });
    } else if (filters.sorted === "DESC") {
      sortedCustomersAsc();
      setFilters({
        sorted: "ASC",
      });
    }
  }

  return (
    <>
      {isShowModalDelete && (
        <ModalDeleteUser delete={deleteCustomer} cancel={cancel} />
      )}
      <p className="text-xl font-bold mb-4">Заказчики</p>
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
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {customersState?.map((customer) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer "
                key={customer._id}
                onClick={(e) => openCustomer(e, customer._id)}
              >
                <td
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {customer.name}
                </td>
                <td className="px-6 py-4">{customer.region}</td>
                <td className="px-6 py-4">{customer.city}</td>
                <td className="px-6 py-4">{customer.inn}</td>
                <td className="px-6 py-4 bg-gray text ">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    disabled={isLoading}
                    data-id="delete"
                  >
                    Удалить
                  </button>
                </td>
                <td className="text edit">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    disabled={isLoading}
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

CustomersPage.auth = {
  loading: "loading",
};

export async function getServerSideProps({ req }) {
  try {
    const response = await fetch(`${baseApiUrl}/customers`);

    if (!response.ok) {
      throw new Error("Error");
    }

    const customers = await response.json();
    return {
      props: {
        customers,
        baseUrl: process.env.NEXTAUTH_URL,
      },
    };
  } catch (error) {
    return {
      props: {
        customers: [],
      },
    };
  }
}
