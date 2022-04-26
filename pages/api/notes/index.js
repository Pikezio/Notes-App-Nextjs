import globalHandler from "../../../middleware/globalHandler";
import Note from "../../../models/Note";

const handler = globalHandler()
  .post(async (req, res) => {
    const { songId, userId, partId, page } = req.body;
    const note = await Note.findOneAndUpdate(
      { songId, userId, partId, page },
      { elements: req.body.elements },
      {
        upsert: true,
      }
    );
    res.json(note);
  })
  .get(async (req, res) => {
    const { songId, userId, partId, page } = req.query;
    const note = await Note.findOne({ songId, userId, partId, page });
    res.json(note);
  });

export default handler;
