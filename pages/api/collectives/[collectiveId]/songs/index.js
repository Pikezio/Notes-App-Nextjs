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
  })
  // Gets a list of songs that have a particular instrument
  .get(async (req, res) => {
    const { collectiveId, instrument } = req.query;
    if (instrument === "all" || instrument === "---" || instrument == null) {
      // Return all song titles
      const songs = await Song.find(
        { collectiveId: collectiveId },
        { title: 1 }
      );
      res.json(songs);
    } else {
      // Return all songs that have a specific instrument part
      const songNames = await Song.find(
        {
          collectiveId,
          "parts.instrument": instrument,
        },
        {
          title: 1,
        }
      );
      res.send(songNames);
    }
  });

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
