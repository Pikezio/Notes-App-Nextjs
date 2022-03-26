import { getPartOfSong } from "../../../controllers/songController";
import globalHandler from "../../../middleware/globalHandler";

const handler = globalHandler().get(async (req, res) => {
  const result = await getPartOfSong(req);
  res.send(result);
});

export default handler;
