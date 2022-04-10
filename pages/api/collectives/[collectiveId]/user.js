import globalHandler from "../../../../middleware/globalHandler";
import { isUserCollectiveOwner } from "../../../../middleware/isUserCollectiveOwner";
import Collective from "../../../../models/Collective";

const handler = globalHandler()
  .use(isUserCollectiveOwner)
  // Accepts or declines a request to join a collective
  .post(async (req, res) => {
    const { action, _id, collectiveId } = req.body;
    switch (action) {
      case "accept":
        const acceptedUser = await Collective.updateOne(
          {
            _id: collectiveId,
            "members._id": _id,
          },
          {
            $set: {
              "members.$.status": "Accepted",
            },
          }
        );
        res.send(acceptedUser);
      case "decline":
        const declinedUser = await Collective.updateOne(
          {
            _id: collectiveId,
            "members._id": _id,
          },
          {
            $set: {
              "members.$.status": "Declined",
            },
          }
        );
        res.send(declinedUser);
    }
  });

export default handler;
