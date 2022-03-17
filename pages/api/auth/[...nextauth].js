import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../util/mongoClient";
import User from "../../../models/User";
import { createUser } from "../../../controllers/userController";
import dbConnect from "../../../util/dbConnect";
import { compare } from "bcryptjs";

dbConnect();

export default NextAuth({
  url: process.env.NEXTAUTH_URL,
  session: { strategy: "jwt" },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "User name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const test = await User.findOne({
          username: credentials.username,
        });

        console.log(test);

        if (!test) {
          const createdUser = createUser(req);
          return createdUser;
        }

        const checkPassword = await compare(
          credentials.password,
          test.password
        );

        if (!checkPassword) {
          throw new Error("Password doesnt match");
        }

        return { id: test._id, email: test.email };
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.userId = token.sub;
      return session;
    },
  },
  events: {
    // async signIn(message) {
    //   // console.log(message);
    // },
    // async session(message) {
    //   console.log("async session event: ");
    //   console.log(message);
    // },
  },
});
