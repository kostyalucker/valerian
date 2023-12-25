import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "./Button";
import { baseUrl } from "@/config";
import Link from "next/link";

function Header() {
  const router = useRouter();
  const session = useSession();

  if (session?.status === "unauthenticated") {
    return null;
  }

  const startPagesByRole = {
    ENGINEER: "/customers",
    ADMIN: "/customers",
    CUSTOMER: "/departments",
    SUPERADMIN: "/dashboard",
  };

  const isBackButtonRender =
    startPagesByRole[session?.data?.user?.role] !== router.pathname;

  const isNotCustomer = session?.data?.user?.role !== "CUSTOMER";
  const isSuperAdmin = session?.data?.user?.role === "SUPERADMIN";
  const isEngineer = session?.data?.user?.role === "ENGINEER";
  const isCustomerPage = router.pathname === "/customers";
  const isUserCreatePage = router.pathname === "/users/create";

  const isShowCreateUser = isSuperAdmin || isEngineer;
  async function onSignOut() {
    await signOut({
      callbackUrl: "/",
    });
  }

  return (
    <>
      <div className={`flex items-center mb-8 justify-between`}>
        <div className="flex items-center">
          {isBackButtonRender && <Button onClick={router.back}>Назад</Button>}
        </div>
        <Button className="border-red-600 text-red-600" onClick={onSignOut}>
          Выйти
        </Button>
      </div>
      {isNotCustomer && (
        <nav>
          <ul className="flex flex-col md:flex-row">
            <Link className="text-blue-400 mb-2 md:mr-8" href="/dashboard">
              Главная
            </Link>
            {!isCustomerPage && (
              <Link className="text-blue-400 mb-2" href="/customers">
                Заказчики
              </Link>
            )}
            {(isShowCreateUser && !isUserCreatePage) && (
              <>
                <Link
                  className={`text-blue-400 mb-2 ${
                    isCustomerPage ? "" : "md:ml-8"
                  }`}
                  href="/users/create"
                >
                  Добавить заказчика
                </Link>
              </>
            )}
          </ul>
        </nav>
      )}
      <hr className="bg-gray-500 h-0.5 mb-4" />
    </>
  );
}

export default Header;
