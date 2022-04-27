import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
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
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "User name" },
        name: { label: "Name", type: "text", placeholder: "Your name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await User.findOne({
          username: credentials.username,
        });

        if (!user) {
          const createdUser = createUser(req);
          return createdUser;
        }

        const checkPassword = await compare(
          credentials.password,
          user.password
        );

        if (!checkPassword) {
          throw new Error("Password doesnt match");
        }

        return { id: user._id, email: user.email, name: user.name };
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
});
