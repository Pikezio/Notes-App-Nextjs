import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../util/mongoClient";

export default NextAuth({
  url: process.env.NEXTAUTH_URL,
  session: { strategy: "jwt" },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
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
