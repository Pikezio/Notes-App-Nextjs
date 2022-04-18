import globalHandler from "../../../../../middleware/globalHandler";
import { isUserCollectiveOwner } from "../../../../../middleware/isUserCollectiveOwner";
import Collective from "../../../../../models/Collective";

const handler = globalHandler()
  .use(isUserCollectiveOwner)
  // Accepts or declines a request to join a collective
  .patch(async (req, res) => {
    const { userId, collectiveId } = req.query;
    const { action } = req.body;

    switch (action) {
      case "accept":
        const acceptedUser = await Collective.updateOne(
          {
            _id: collectiveId,
            "members.userId": userId,
          },
          {
            $set: {
              "members.$.status": "Accepted",
            },
          }
        );
        res.send(acceptedUser);
        break;
      case "decline":
        const declinedUser = await Collective.updateOne(
          {
            _id: collectiveId,
            "members.userId": userId,
          },
          {
            $set: {
              "members.$.status": "Declined",
            },
          }
        );
        res.send(declinedUser);
        break;
    }
  })
  .delete(async (req, res) => {
    const { collectiveId, userId } = req.query;
    const collective = await Collective.findById(collectiveId);
    const user = collective.members.find((member) => member.userId == userId);
    collective.members.pull(user);
    collective.save();
    res.status(200);
  });

export default handler;
