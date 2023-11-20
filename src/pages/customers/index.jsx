import Link from "next/link";
import { useState } from "react";

import { baseApiUrl } from "@/config";
import { useRouter, router } from "next/router";

export default function CustomersPage({ customers, baseUrl }) {
  const [isLoading, setLoading] = useState(false);
  const [customersState, setCustomers] = useState(customers);

  async function deleteCustomer(id) {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.status !== 200) {
        throw new Error("Delete customer error");
      }

      const deletedUser = await response.json();
      const filteredCustomers = customersState.filter(
        (customer) => customer._id !== deletedUser.id
      );

      setCustomers(filteredCustomers);
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
      deleteCustomer(id);
    } else {
      router.push(`/departments?userId=${id}`);
    }
  }

  return (
    <>
      <p className="text-xl font-bold mb-4">Заказчики</p>
      
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Имя
              </th>
              <th scope="col" class="px-6 py-3">
                Регион
              </th>
              <th scope="col" class="px-6 py-3">
                Город
              </th>
              <th scope="col" class="px-6 py-3">
                Инн
              </th>
              <th scope="col" class="px-6 py-3"></th>
              <th scope="col" class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {customersState?.map((customer) => (
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer "
                key={customer._id}
                onClick={(e) => openCustomer(e, customer._id)}
              >
                <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
                  {customer.name}
                </td>
                <td class="px-6 py-4">{customer.region}</td>
                <td class="px-6 py-4">{customer.city}</td>
                <td class="px-6 py-4">{customer.inn}</td>
                <td class="px-6 py-4 bg-gray text ">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    disabled={isLoading}
                    data-id="delete"
                  >
                    Удалить
                  </button>
                </td>
                <td class="text edit">
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
