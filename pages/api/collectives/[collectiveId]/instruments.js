import {
  postInstruments,
  getInstrumentsJson,
} from "../../../../controllers/instrumentController";
import globalHandler from "../../../../middleware/globalHandler";
import { isUserCollectiveOwner } from "../../../../middleware/isUserCollectiveOwner";
import { isUserCollectiveMember } from "../../../../middleware/isUserCollectiveMember";

const handler = globalHandler()
  .use(isUserCollectiveMember)
  .get(async (req, res) => {
    const result = await getInstrumentsJson(req.query.collectiveId);
    res.send(result);
  })
  .use(isUserCollectiveOwner)
  .post(async (req, res) => {
    const result = await postInstruments(req);
    res.send(result);
  });

export default handler;
