import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { baseApiUrl, baseUrl } from "@/config";

export const authOptions = {
  secret: "SECRET",
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Password",
        },
      },

      async authorize(credentials: any, req) {
        const { email, password } = credentials;
        const res = await fetch(`${baseApiUrl}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        const user = await res.json();

        if (res.ok && user) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      session.accessToken = token.accessToken;

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.password;
        token.id = user._id;
      }

      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    // async redirect({ url, baseUrl }) {
    //     console.log(baseUrl, url, new URL(url).origin)
    //     // Allows relative callback URLs
    //     if (url.startsWith("/")) return `${baseUrl}${url}`
    //     // Allows callback URLs on the same origin
    //     else if (new URL(url).origin === baseUrl) return url
    //     return baseUrl
    // }
  },
};
export default NextAuth(authOptions);
