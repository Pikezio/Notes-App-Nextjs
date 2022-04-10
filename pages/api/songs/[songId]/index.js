import globalHandler from "../../../../middleware/globalHandler";
import { isUserCollectiveMember } from "../../../../middleware/isUserCollectiveMember";
import { attachCollectiveId } from "../../../../middleware/attachCollectiveId";
import { isUserCollectiveOwner } from "../../../../middleware/isUserCollectiveOwner";
import Song from "../../../../models/Song";

const handler = globalHandler()
  .use(attachCollectiveId)
  .use(isUserCollectiveMember)
  // Gets a song with a specific part
  .get(async (req, res) => {
    const { songId, part } = req.query;
    const songWithPart = await Song.findOne({
      _id: songId,
      "parts.instrument": part,
    });
    res.send(songWithPart);
  })
  .use(isUserCollectiveOwner)
  // Deletes a song
  .delete(async (req, res) => {
    const { songId } = req.query;
    const song = await Song.findByIdAndDelete(songId);
    res.send(song);
  })
  // Updates a song
  .patch(async (req, res) => {
    const { songId } = req.query;
    const song = await Song.findByIdAndUpdate(songId, req.body);
    res.send(song);
  });

export default handler;
