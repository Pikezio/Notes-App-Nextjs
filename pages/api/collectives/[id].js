import dbConnect from "../../../util/dbConnect";
import Collective from "../../../models/Collective";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  const token = await getToken({ req, secret });

  switch (method) {
    // case "POST":
    //   // Check if current user doesnt have a collective
    //   const collective = await Collective.findOne({ owner: token.email });

    //   if (collective) {
    //     res.status(403);
    //     return;
    //   }

    //   try {
    //     const collective = await Collective.create({
    //       title: req.body.title,
    //       owner: token.email,
    //     });
    //     res.status(201).json({ data: collective });
    //   } catch {
    //     res.status(400);
    //   }
    //   break;

    case "GET":
      const { id } = req.query;
      console.log(id);
      res.json(id);
      //   try {
      //     const collective = await Collective.findOne({ _id: collectiveId });

      //     console.log(collective);

      //     if (collective) {
      //       res.json({ data: collective });
      //     } else {
      //       res.status(404);
      //     }
      //   } catch {
      //     res.status(400);
      //   }
      break;
    default:
      res.status(404);
      break;
  }
}
