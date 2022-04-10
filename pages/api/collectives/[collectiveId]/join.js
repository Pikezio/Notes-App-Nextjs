import globalHandler from "../../../../middleware/globalHandler";
import Collective from "../../../../models/Collective";

const handler = globalHandler()
  // Sends a request to join a collective
  .post(async (req, res) => {
    const { collectiveId } = req.query;
    const { userId, name } = req.body;
    const collective = await Collective.findById(collectiveId);
    collective.members.push({
      userId,
      name,
      status: "Requested",
    });
    collective.save();
    res.send(collective);
  });

export default handler;
