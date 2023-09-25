import Link from "next/link";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";

import { Title } from "@/components/Title";
import { baseApiUrl, baseUrl } from "@/config";
import { ROLES } from "@/constants/users";
import { useRouter } from "next/router";

export default function Departments(props) {
  const { departments } = props;
  const session = useSession();
  const router = useRouter();

  const isSuperAdmin = session?.data?.user?.role === ROLES.superAdmin;

  return (
    <>
      {/* {factory?.name && <p className="mb-4">Предприятие: {factory.name}</p>} */}
      <div className="title__container flex items-center mb-4">
        <Title>Выберите цех</Title>
        {isSuperAdmin && router.query.userId && (
          <Link
            href={`/departments/create?userId=${router.query.userId}`}
            className="ml-4 text-blue-400"
          >
            Добавить
          </Link>
        )}
      </div>
      <ul>
        {departments?.map((department) => (
          <Link
            className="flex items-center justify-center w-full p-2 mb-4 bg-slate-400 text-white h-52 text-5xl"
            href={{
              pathname: `/departments/${department._id}`,
            }}
            key={department._id}
          >
            {department.departmentNumber}
          </Link>
        ))}
      </ul>
    </>
  );
}

Departments.auth = {
  role: "CUSTOMER",
  loading: "loading",
};

export async function getServerSideProps(context) {
  const { req, query } = context;
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: `${baseUrl}/`,
      },
    };
  }

  const { role, id } = session?.user;
  let url;

  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  if (role === "ENGINEER" || isAdmin) {
    const { userId } = query;

    if (!userId) {
      return {
        redirect: {
          destination: `${baseUrl}/customers`,
        },
      };
    }

    url = `${baseApiUrl}/departments?userId=${userId}`;
  } else {
    url = `${baseApiUrl}/departments?userId=${id}`;
  }

  const response = await fetch(url)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      return err;
    });

  return {
    props: {
      departments: response.departments,
    },
  };
}
