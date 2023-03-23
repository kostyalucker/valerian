import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    secret: 'SECRET',
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
                const { email, password } = credentials
                const res = await fetch("http://localhost:3000/api/login", {
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
                console.log(user, res.ok)
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
                token.id = user._id;
            }

            return token
        }
    },
    pages: {
        signIn: '/',
        signout: '/',
        callback: '/',
        error: '/'
    }
}
export default NextAuth(authOptions)