import Link from "next/link";

export default function CustomersPage({ customers }) {
  return (
    <>
      <h1>Заказчики</h1>
      <ul>
        {customers?.map(customer => {
          return (
            <Link href={`/departments?userId=${customer._id}`} key={customer._id} className="block">
              {customer.name}
            </Link>
          )
        })}
      </ul>
    </>
  )
}

CustomersPage.auth = {
  role: "ENGINEER",
  loading: "loading",
};

export async function getServerSideProps() {
  try {
    const response = await fetch(`http://localhost:3000/api/customers`)

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