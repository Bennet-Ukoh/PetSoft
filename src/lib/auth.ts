import Prisma from "./db";
import NextAuth, { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import credentials from "next-auth/providers/credentials";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    credentials({
      async authorize(credentials) {
        //run on login
        const { email, password } = credentials;

        const user = await Prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          console.log("No user found");
          return null;
        }
        const passwordMatched = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordMatched) {
          console.log("Invalid credential");
          return null;
        }
        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

      if (!isLoggedIn && isTryingToAccessApp) {
        return "false";
      }
      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }
      if (isLoggedIn && !isTryingToAccessApp) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }
      return false;
    },
    jwt: ({ token, user }) => {
      // runs on login
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
