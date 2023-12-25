import { useRef, useState } from "react";
import { getProviders, getSession, signIn, useSession } from "next-auth/react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/router";
import { baseUrl } from "@/config";
import Image from "next/image";
import Logo from "../assets/logo.png";
const Signin = ({ providers }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const session = useSession();
  const [showPassword, setShowPassword] = useState(false);

  async function onLogin(event: any) {
    event.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Ошибка при вводе данных");

      setTimeout(() => {
        setError("");
      }, 5000);

      return;
    }
  }

  function onEmailChange(event: any) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event: any) {
    setPassword(event.target.value);
  }

  return (
    <div className="flex flex-col	 justify-center items-center h-screen">
      <div className="mb-40">
        {" "}
        <Image
          src={Logo}
          width={150}
          height={150}
          alt="Picture of the author"
        />
      </div>
      {!session.data && (
        <form className="flex flex-col max-w-lg w-full">
          <Input
            value={email}
            onChange={onEmailChange}
            type="email"
            className="form-input px-4 py-3 mb-4"
            placeholder="Login"
          ></Input>
          <div className="form-group flex relative">
            <Input
              value={password}
              onChange={onPasswordChange}
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="form-input px-4 py-3 mb-4 w-full"
            ></Input>
            <div
              className="block w-2 absolute right-10 cursor-pointer absolute top-1/3 transform -translate-y-1/2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <svg
                width="16px"
                height="16px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <Button onClick={(event: any) => onLogin(event)}>Войти</Button>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default Signin;

export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });
  const providers = await getProviders();

  if (session) {
    return {
      redirect: { destination: `${baseUrl}/dashboard` },
    };
  }

  return {
    props: {
      providers,
    },
  };
}
