import globalHandler from "../../../../../../middleware/globalHandler";
import { attachCollectiveId } from "../../../../../../middleware/attachCollectiveId";
import { isUserCollectiveOwner } from "../../../../../../middleware/isUserCollectiveOwner";
import Song from "../../../../../../models/Song";

const handler = globalHandler()
  .use(attachCollectiveId)
  .use(isUserCollectiveOwner)
  .post(async (req, res) => {
    const { songId } = req.query;
    const song = await Song.findById(songId);
    req.body.map((part) => {
      song.parts.push(part);
    });
    await song.save();
    res.send({});
  })
  .delete(async (req, res) => {
    const { songId, partId } = req.query;
    const song = await Song.findById(songId);
    song.parts.pull({ _id: partId });
    await song.save();
    res.send({});
  })
  .patch(async (req, res) => {
    const { songId, partId } = req.query;
    let setObject = {
      $set: {
        "parts.$.instrument": req.body.instrument,
      },
    };

    if (req.body.file !== null) {
      setObject = {
        $set: {
          "parts.$.instrument": req.body.instrument,
          "parts.$.file": req.body.file,
          "parts.$.filename": req.body.filename,
        },
      };
    }

    const song = await Song.updateOne(
      {
        _id: songId,
        "parts._id": partId,
      },
      setObject
    );
    res.send(setObject);
  });

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // Set desired value here
    },
  },
};
