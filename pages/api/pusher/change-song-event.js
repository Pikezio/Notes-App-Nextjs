import globalHandler from "../../../middleware/globalHandler";

const { pusher } = require("../../../util/pusher");

const handler = globalHandler().post(async (req, res) => {
  const { concertId, songId } = req.body;
  const response = await pusher.trigger(
    `song-changer-${concertId}`,
    "change-event",
    {
      songId,
    }
  );

  res.json({ message: "completed" });
});

export default handler;
