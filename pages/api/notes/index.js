import globalHandler from "../../../middleware/globalHandler";
import Note from "../../../models/Note";

const handler = globalHandler()
  .post(async (req, res) => {
    const { songId, userId } = req.body;
    const note = await Note.findOneAndUpdate({ songId, userId }, req.body, {
      upsert: true,
    });
    res.status(note);
  })
  .get(async (req, res) => {
    const { songId, userId } = req.query;
    const note = await Note.findOne({ songId, userId });
    res.json(note);
  });

export default handler;
