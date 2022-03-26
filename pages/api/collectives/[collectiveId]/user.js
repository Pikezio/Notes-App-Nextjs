import { modifyUserRequest } from "../../../../controllers/collectiveController";
import globalHandler from "../../../../middleware/globalHandler";

const handler = globalHandler().post(async (req, res) => {
  const result = await modifyUserRequest(req);
  res.send(result);
});

export default handler;
