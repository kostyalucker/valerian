import { getSession, signOut, useSession } from "next-auth/react";
import { baseApiUrl, baseUrl } from "@/config";
import Link from "next/link";
import { ROLES } from "@/constants/users";
export default function Dashboard(props) {
  const links = {
    [ROLES.engineer]: "/customers",
    [ROLES.customer]: "/departments",
    [ROLES.superAdmin]: "/customers",
    default: "/customers",
  };

  const { data: session } = useSession();
  const user = session?.user;

  function getUrlCustomers() {
    const role = session?.user?.role;

    const keyRole = role || "default";
    return links[keyRole];
  }

  return (
    <section className=" place-items-center">
      <Link className="text-blue-400 mb-2" href={getUrlCustomers()}>
        <div className="text-white w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-center cursor-pointer">
          Мониторинг показателей
        </div>
      </Link>
    </section>
  );
}

Dashboard.auth = {
  role: "ADMIN",
  loading: "loading",
};

export async function getServerSideProps(context) {
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
