import dbConnect from "../../../util/dbConnect";
import Part from "../../../models/Part";
import nextConnect from "next-connect";

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "POST":
      console.log(req.body);
    //   try {
    //     const song = await Part.create(req.body);
    //     res.status(201).json({ success: true, data: song });
    //   } catch {
    //     res.status(400).json({ success: false });
    //   }
    //   break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
