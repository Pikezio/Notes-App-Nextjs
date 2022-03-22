import { getSession } from "next-auth/react";

// Checks if there is a userId in the session and adds it to req.userId
export async function isUserAuthenticated(req, res, next) {
  const session = await getSession({ req });

  console.log("From mid: " + session);
  // Error response and message
  if (!session) {
    req.userId = "Test ID";
    return res.status(403).end("Not authenticated!");
  }

  //Succesful
  req.userId = session.userId;
  next();
}
