import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import Header from "../components/Header";
import { Layout } from "../components/Layout";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & {
  Component: {
    auth: boolean;
    role: string;
    children: React.ReactNode;
  };
}) {
  return (
    <SessionProvider session={session}>
      <>
        <Layout>
          <ToastContainer />
          <Header />
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </>
    </SessionProvider>
  );
}

function Auth({ children }: { children: React.ReactElement }) {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
