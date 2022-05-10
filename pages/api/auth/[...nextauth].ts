import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "utils/dbConnect";
import { User } from "models/user";

import { verifyPassword } from "utils/auth";

const THIRTY_MINUTES_IN_SECONDS = 60 * 30;

export default NextAuth({
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const isDBConnected = await dbConnect();
          if (!isDBConnected) {
            return null;
          }

          const user = await User.findOne({
            username: credentials.username,
          });

          if (!user) {
            throw new Error("No user found!");
          }

          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Could not log you in!");
          }

          return { username: user.username };
        } catch (error) {
          console.log("Error while trying to login: ", error.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: THIRTY_MINUTES_IN_SECONDS,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        //token.accessToken = user.id;
        token.user = user;
      }

      return token;
    },
    session: async ({ session, token }) => {
      //  "session" is current session object
      if (!session) {
        return null;
      }
      if (token) {
        //session.token = token;
        session.user = token.user;
        //session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});
