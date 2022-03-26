import { joinCollective } from "../../../../controllers/collectiveController";
import globalHandler from "../../../../middleware/globalHandler";

const handler = globalHandler().post(async (req, res) => {
  const result = await joinCollective(req);
  res.send(result);
});

export default handler;
