import { getSession, signOut, useSession } from "next-auth/react";
import { baseApiUrl, baseUrl } from "@/config";
import Link from "next/link";

export default function Dashboard(props) {
  console.log(1);
  const { data: session } = useSession();
  const user = session?.user;
  //@ts-ignore

  function getUrlCustomers() {
    const role = session?.user?.role;
    switch (role) {
      case "CUSTOMER":
        return "/departments";
      case "ENGINEER":
        return "/customers";
      default:
        return "/customers";
    }
  }
  return (
    <section className=" place-items-center">
      <Link className="text-blue-400 mb-2" href={getUrlCustomers()}>
        <div className="text-white w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-center cursor-pointer">
          Мониторинг показателей
        </div>
      </Link>
      {/* <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Hello {session?.user?.name}
        </h2>
        <h1 className="dark:text-white">Users</h1>
        {props.users?.length &&
          props.users?.map((user) => {
            return (
              <li key={user.id} className="dark:text-white">
                {user.name} {user.id}
              </li>
            );
          })}
        <br />
      </div> */}
    </section>
  );
}

Dashboard.auth = {
  role: "ADMIN",
  loading: "loading",
};

export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  if (session?.user?.role === "SUPERADMIN") {
    const response = await fetch(`${baseApiUrl}/users`);

    if (!response.ok) {
      return {
        props: {
          users: [],
        },
      };
    }

    const users = await response.json();

    return {
      props: {
        users,
      },
    };
  }

  return {
    props: {
      users: [],
    },
  };
}
