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
    router.push(`/departments?userId=${id}`);
  }

  function editCustomer(e, id) {
    e.preventDefault();
    router.push(`/customers/${id}`);
  }

  return (
    <>
      <p className="text-xl font-bold mb-4">Заказчики</p>
      <ul className="overflow-y-auto">
        <div className="flex text-center mb-2">
          <div className="p-2 w-80 shrink-0">Имя</div>
          <div className="p-2 w-40 shrink-0">ИНН</div>
          <div className="p-2 w-40 shrink-0"></div>
        </div>
        {/* {customersState?.map(({ _id, name, inn }) => (
          <div className="flex items-stretch " key={_id}>
            <Link
              className="
                block
                flex
              "
              href={`/departments?userId=${_id}`}
            >
              <div className="inline-flex text-center mb-2 hover:bg-slate-50 hover:border-cyan-900 hover:border-2 border-2 border-transparent">
                <div className="p-2 border-2 w-80 shrink-0">{name}</div>
                <div className="p-2 border-2 w-40 shrink-0">{inn}</div>
              </div>
            </Link>
            <div className="p-2 border-2 w-80 shrink-0">
              <button onClick={() => deleteCustomer(_id)} disabled={isLoading}>
                Удалить
              </button>
            </div>
            <div className="p-2 border-2 w-80 shrink-0">
              <Link href={`/customers/${_id}`}>редактировать</Link>
            </div>
          </div>
        ))} */}

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
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer  hover:bg-slate-100"
                  key={customer._id}
                  onClick={(e) => openCustomer(e, customer._id)}
                >
                  <td
                    scope="row"
                    class="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {customer.name}
                  </td>
                  <td class="px-6 py-4">{customer.region}</td>
                  <td class="px-6 py-4">{customer.city}</td>
                  <td class="px-6 py-4">{customer.inn}</td>
                  <td
                    class="px-6 py-4 bg-gray text hover:bg-slate-100"
                    onClick={() => deleteCustomer(customer._id)}
                  >
                    <button disabled={isLoading}>Удалить</button>
                  </td>
                  <td
                    class="px-6 py-4 bg-gray text hover:bg-slate-100"
                    onClick={(e) => editCustomer(e, customer._id)}
                  >
                    Редактировать
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ul>
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
