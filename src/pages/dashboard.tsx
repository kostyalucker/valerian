import { getSession, signOut, useSession } from "next-auth/react";
import { baseApiUrl, baseUrl } from '@/config'

export default function Dashboard(props) {
  const { data: session } = useSession();
  const user = session?.user;
  //@ts-ignore
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  if (!isAdmin) {
    return (
      <section className="grid h-screen place-items-center">
        <div className="w-25">
          <p>You do not have permission to view this page!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid h-screen place-items-center">
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
      </div>
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
        destination: '/'
      }
    }
  }

  if (session?.user?.role === "ENGINEER" || session?.user?.role === "ADMIN") {
    return {
      redirect: { destination: `${baseUrl}/customers` },
    };
  } else if (session?.user?.role === "CUSTOMER") {
    return {
      redirect: { destination: `${baseUrl}/departments` },
    };
  } else if (session?.user?.role === "SUPERADMIN") {
    const response = await fetch(`${baseApiUrl}/user`)
    
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
        users
      }
    }
  }

  return {
    props: {
      users: [],
    },
  };
}
