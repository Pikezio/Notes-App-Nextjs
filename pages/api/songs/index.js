import dbConnect from "../../../util/dbConnect";
import Song from "../../../models/Song";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const songs = await Song.find({});
        res.status(200).json({ success: true, data: songs });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const song = await Song.create(req.body);
        res.status(201).json({ success: true, data: song });
      } catch {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
