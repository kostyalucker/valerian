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
    ADMIN: '/customers',
    CUSTOMER: '/departments'
  }

  const isBackButtonRender = startPagesByRole[session?.data?.user?.role] !== router.pathname;

  async function onSignOut() {
    await signOut({
      callbackUrl: '/'
    })
  }

  return (
    <>
      <div className={`flex items-center mb-8 ${isBackButtonRender ? 'justify-between' : 'justify-end'}`}>
        {isBackButtonRender && (
          <Button onClick={router.back}>
            Назад
          </Button>
        )}
        <Button className="border-red-600 text-red-600" onClick={onSignOut}>
          Выйти
        </Button>
      </div>
      <hr className="bg-gray-500 h-0.5 mb-4"/>
    </>
  )
}

export default Header

