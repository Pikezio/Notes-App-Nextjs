import User from "../models/User";
import {hash} from "bcryptjs";
import Collective from "../models/Collective";

//Route: /collectives/[collectiveId]/songs - POST, GET

async function createUser(req) {
  const { username, password, name } = req.body;

  const passHash = await hash(password, 12);

  const user = await User.create({
    username,
    password: passHash,
    name,
  });

  return user;
}

module.exports = {
  createUser,
};

export async function joinCollective(req) {
    const {collectiveId} = req.query;
    const {userId, name} = req.body;
    const collective = await Collective.findById(collectiveId);
    collective.members.push({
        userId,
        name,
        status: "Requested",
    });
    collective.save();
    return collective;
}

export async function modifyUserRequest(req) {
    const {action, _id, collectiveId} = req.body;
    switch (action) {
        case "accept":
            const member1 = await Collective.updateOne(
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
            return member1;
        case "decline":
            const member2 = await Collective.updateOne(
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
            return member2;
    }
}