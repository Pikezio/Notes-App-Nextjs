import globalHandler from "../../../../middleware/globalHandler";
import { isUserCollectiveOwner } from "../../../../middleware/isUserCollectiveOwner";
import Collective from "../../../../models/Collective";

const handler = globalHandler()
  .use(isUserCollectiveOwner)
  // Updates a collective
  .patch(async (req, res) => {
    const { collectiveId } = req.query;
    const updated = await Collective.findOneAndUpdate(
      {
        _id: collectiveId,
      },
      req.body
    );
    res.send(updated);
  })
  // Deletes a collective
  .delete(async (req, res) => {
    const { collectiveId } = req.query;
    const deleted = await Collective.findOneAndDelete({
      _id: collectiveId,
    });
    res.send(deleted);
  });

export default handler;
