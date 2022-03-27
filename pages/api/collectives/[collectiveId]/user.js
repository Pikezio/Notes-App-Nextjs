import { modifyUserRequest } from "../../../../controllers/collectiveController";
import globalHandler from "../../../../middleware/globalHandler";
import { isUserCollectiveOwner } from "../../../../middleware/isUserCollectiveOwner";

const handler = globalHandler()
  .use(isUserCollectiveOwner)
  .post(async (req, res) => {
    const result = await modifyUserRequest(req);
    res.send(result);
  });

export default handler;
