import { getSession } from "next-auth/react";

// Checks if there is a userId in the session and adds it to req.userId
export async function isUserAuthenticated(req, res, next) {
  const session = await getSession({ req });
  if (!session) {
    res.status(403);
    return;
  }
  req.userId = session.userId;
  next();
}
