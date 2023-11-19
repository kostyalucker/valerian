import Link from "next/link";
import { useState } from "react";

import { baseApiUrl } from "@/config";
import { useRouter } from "next/router";

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

  return (
    <>
      <p className="text-xl font-bold mb-4">Заказчики</p>
      <ul className="overflow-y-auto">
        <div className="flex text-center mb-2">
          <div className="p-2 w-80 shrink-0">Имя</div>
          <div className="p-2 w-40 shrink-0">ИНН</div>
        </div>
        {customersState?.map(({ _id, name, inn }) => (
          <div key={_id}>
            <Link
              className="
                block
              "
              href={`/departments?userId=${_id}`}
            >
              <div className="inline-flex text-center mb-2 hover:bg-slate-50 hover:border-cyan-900 hover:border-2 border-2 border-transparent">
                <div className="p-2 border-2 w-80 shrink-0">{name}</div>
                <div className="p-2 border-2 w-40 shrink-0">{inn}</div>
              </div>
            </Link>
            <button onClick={() => deleteCustomer(_id)} disabled={isLoading}>
              delete user
            </button>
            <Link href={`/customers/${_id}`}>edit user</Link>
          </div>
        ))}
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
