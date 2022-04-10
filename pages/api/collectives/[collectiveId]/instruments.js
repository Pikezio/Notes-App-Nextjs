import globalHandler from "../../../../middleware/globalHandler";
import { isUserCollectiveOwner } from "../../../../middleware/isUserCollectiveOwner";
import { isUserCollectiveMember } from "../../../../middleware/isUserCollectiveMember";
import Collective from "../../../../models/Collective";

const handler = globalHandler()
  .use(isUserCollectiveMember)

  // Gets a list of instruments for a specific collective
  .get(async (req, res) => {
    const { collectiveId } = req.query;
    const instruments = await Collective.findById(collectiveId, "instruments");
    res.send(instruments);
  })
  .use(isUserCollectiveOwner)

  // Updates a list of instruments for a specific collective
  .post(async (req, res) => {
    const { collectiveId } = req.query;
    const instruments = await Collective.findByIdAndUpdate(collectiveId, {
      instruments: req.body,
    });
    res.send(instruments);
  });

export default handler;
