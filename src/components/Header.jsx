import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "./Button";

function Header() {
  const router = useRouter();
  const session = useSession();

  if (session?.status === "unauthenticated") {
    return null;
  }

  const startPagesByRole = {
    ENGINEER: '/customers',
    ADMIN: '/dashboard',
    CUSTOMER: '/departments'
  }

  const isBackButtonRender = startPagesByRole[session?.data?.user?.role] !== router.pathname;

  return (
    <div className="flex justify-between items-center mb-8">
      {isBackButtonRender && (
        <Button onClick={router.back}>
          Назад
        </Button>
      )}
      <Button className="border-red-600 text-red-600" onClick={() => signOut()}>
        Выйти
      </Button>
    </div>
  )
}

export default Header

