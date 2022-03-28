import { postCollective } from "../../../controllers/collectiveController";
import globalHandler from "../../../middleware/globalHandler";

const handler = globalHandler().post(async (req, res) => {
  const result = await postCollective(req);
  res.send(result);
});

export default handler;
