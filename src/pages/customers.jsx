import Link from "next/link";
import { baseApiUrl } from '@/config'

export default function CustomersPage({ customers }) {
  return (
    <>
      <p className="text-xl font-bold mb-4">Заказчики</p>
      <ul className="overflow-y-auto">
        <div className="flex text-center mb-2">
          <div className="p-2 w-80 shrink-0">Имя</div>
          <div className="p-2 w-40 shrink-0">ИНН</div>
        </div>
        {customers?.map(({ _id, name, inn }) => (
            <Link
              className="
                block
              "
              href={`/departments?userId=${_id}`} 
              key={_id}>
              <div className="inline-flex text-center mb-2 hover:bg-slate-50 hover:border-cyan-900 hover:border-2 border-2 border-transparent">
                <div className="p-2 border-2 w-80 shrink-0">{name}</div>
                <div className="p-2 border-2 w-40 shrink-0">{inn}</div>
              </div>
            </Link>
          )
        )}
      </ul>
    </>
  )
}

CustomersPage.auth = {
  loading: "loading",
};

export async function getServerSideProps({ req }) {
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