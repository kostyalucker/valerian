import Link from "next/link";
import { baseApiUrl } from '@/config'

export default function CustomersPage({ customers }) {
  return (
    <>
      <p className="text-xl font-bold mb-4">Заказчики</p>
      <ul>
        {customers?.map(customer => {
          return (
            <Link
              href={`/departments?userId=${customer._id}`} 
              key={customer._id} 
              className="block text-lg hover:text-sky-500"
            >
              {customer.name}
            </Link>
          )
        })}
      </ul>
    </>
  )
}

CustomersPage.auth = {
  loading: "loading",
};

export async function getServerSideProps() {
  try {
    const response = await fetch(`${baseApiUrl}/customers`)

    if (!response.ok) {
      throw new Error('Error')
    }

    const customers = await response.json();
    return {
      props: {
        customers
      }
    }
  } catch (error) {
    return {
      props: {
        customers: []
      }
    }
  }
}