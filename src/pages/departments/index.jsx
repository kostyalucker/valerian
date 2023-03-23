import Link from "next/link";

import { getSession } from "next-auth/react";
import { Title } from '@/components/Title' 

export default function Departments(props) {
  const { departments } = props;

  return (
    <>
      <Title>Выберите цех</Title>
      <ul>
        {departments?.map((department) => <Link
          className="flex items-center justify-center w-full p-2 mb-4 bg-slate-400 text-white h-52 text-5xl"
          href={{
          pathname: `/departments/${department._id}`
        }} key={department._id}>{department.departmentNumber}</Link>)}
      </ul>
    </>
  )
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
        destination: "/"
      }
    }
  }

  const { role, id } = session?.user;
  let url;

  console.log(role)

  if (role === "ENGINEER" || role === "ADMIN") {
    const { userId } = query

    if (!userId) {
      return {
        redirect: {
          destination: '/customers'
        }
      }
    }

    url = `http://localhost:3000/api/departments?userId=${userId}`
  } else {
    url = `http://localhost:3000/api/departments?userId=${id}`
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