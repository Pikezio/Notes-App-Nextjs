// ALL COLLECTIVES FOR A USER WITH ID OF "userId"

import dbConnect from "../../../../../util/dbConnect";
import Collective from "../../../../../models/Collective";
import { getSession } from "next-auth/react";

export default async function Handler(req, res) {
  await dbConnect();
  const {
    query: { userId },
  } = req;

  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // const session = await getSession({ req });

  if (req.method === "GET") {
    let collectives;
    try {
      collectives = await Collective.find({ owner: userId });
    } catch (e) {
      res.send({ message: "Error in fetching Collectives." });
    }
    res.json({ collectives });
  }
}
