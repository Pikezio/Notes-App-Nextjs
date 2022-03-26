import { postSong } from "../../../../controllers/songController";
import globalHandler from "../../../../middleware/globalHandler";

const handler = globalHandler().post(async (req, res) => {
  const result = await postSong(req);
  res.send(result);
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
