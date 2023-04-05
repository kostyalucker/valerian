import { useRef, useState } from "react";
import { getProviders, getSession, signIn } from "next-auth/react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/router";
import { baseUrl } from "@/config";

const Signin = ({ providers }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function onLogin(event) {
    event.preventDefault();
    
    const res = await signIn('credentials', {
      email,
      password,
      callbackUrl: window.location.origin + '/dashboard'
    });
  }

  function onEmailChange(event: any) {
    setEmail(event.target.value)
  }

  function onPasswordChange(event: any) {
    setPassword(event.target.value)
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="flex flex-col max-w-lg w-full">
        <Input value={email} onChange={onEmailChange} type="email" className="form-input px-4 py-3 mb-4"></Input>
        <Input value={password} onChange={onPasswordChange} type="password" className="form-input px-4 py-3 mb-4"></Input>
        <Button onClick={(event) => onLogin(event)}>Войти</Button>
      </form>
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
