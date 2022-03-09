import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Protects the routes from non-loggedin users
export async function middleware(req) {
  if (req.nextUrl.pathname === "/songs/create") {
    // Get session object/login
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    const url = req.nextUrl.clone();
    url.pathname = "/";

    // Possible to check roles in the session object here
    if (!session) return NextResponse.redirect(url);
  }
}
