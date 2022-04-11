import globalHandler from "../../../../../middleware/globalHandler";
import { isUserCollectiveMember } from "../../../../../middleware/isUserCollectiveMember";
import Song from "../../../../../models/Song";

const handler = globalHandler()
  .use(isUserCollectiveMember)
  // Gets all songs that have a specific instrument part
  .get(async (req, res) => {
    const { collectiveId, instrument } = req.query;
    if (instrument === "---") {
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
