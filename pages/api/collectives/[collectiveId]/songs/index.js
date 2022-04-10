import globalHandler from "../../../../../middleware/globalHandler";
import { isUserCollectiveOwner } from "../../../../../middleware/isUserCollectiveOwner";
import Song from "../../../../../models/Song";

const handler = globalHandler()
  .use(isUserCollectiveOwner)
  // Creates a new song
  .post(async (req, res) => {
    const { collectiveId } = req.query;
    const data = { ...req.body, collectiveId };
    const song = await Song.create(data);
    res.send(song.id);
  });

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
