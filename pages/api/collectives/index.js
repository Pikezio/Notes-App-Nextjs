import globalHandler from "../../../middleware/globalHandler";
import Collective from "../../../models/Collective";

const handler = globalHandler()
  // Creating a new collective
  .post(async (req, res) => {
    const createdCollective = await Collective.create({
      ...req.body,
      owner: req.userId,
      members: [],
    });
    res.send(createdCollective);
  });

export default handler;
