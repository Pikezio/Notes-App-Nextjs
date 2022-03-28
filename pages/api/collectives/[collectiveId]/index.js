import {
  updateCollective,
  deleteCollective,
} from "../../../../controllers/collectiveController";
import globalHandler from "../../../../middleware/globalHandler";
import { isUserCollectiveOwner } from "../../../../middleware/isUserCollectiveOwner";

const handler = globalHandler()
  .use(isUserCollectiveOwner)
  .patch(async (req, res) => {
    const result = await updateCollective(req);
    res.send(result);
  })
  .delete(async (req, res) => {
    const result = await deleteCollective(req);
    res.send(result);
  });

export default handler;
