import { useSession, signIn, signOut } from "next-auth/react";
import clientPromise from "../lib/mongodb";
import { baseUrl } from '@/config'

export async function getServerSideProps(context) {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    const response = await fetch(`${baseUrl}/db`).then((res) => {
      return res.json();
    });

    return {
      props: { isConnected: true, users: response },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default function Home(props) {
  const { data: session, status } = useSession();
  
  async function onUserCreate() {
    const data = {
      name: "Customer", email: "customer@gmail.com", password: 1111, role: "customer"
    }

    await fetch(`${baseUrl}/user`, {
      method: "POST",
      body: JSON.stringify(data)
    }).then((res) => {
      return res.json();
    });
  }

  if (status === "authenticated") {
    return (
      <section className="grid h-screen place-items-center">
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h1>Users</h1>
          {props.users?.length &&
            props.users.map((user) => {
              return (
                <li key={user._id}>
                  {user.name} {user.id}
                </li>
              );
            })}
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Hi {session?.user?.name}
          </h2>
          <br />
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            You are signed in as {session?.user?.email}.
          </p>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Logout
          </button>
          <button onClick={onUserCreate} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
            create user
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="grid h-screen place-items-center">
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome To LogRocket
        </h2>
        <br />
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          You currently not authenticated. Click the login button to get
          started!
        </p>
        <button
          type="button"
          onClick={() => signIn()}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Login
        </button>
      </div>
    </section>
  );
}
