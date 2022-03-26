import Collective from "../models/Collective";
//Route: /collectives - POST, GET

async function getCollectives(userId) {
  const ownedCollectives = await Collective.find({ owner: userId }, "id title");
  const memberInCollectives = await Collective.find(
    {
      owner: { $ne: userId },
      "members.userId": userId,
      "members.status": "Accepted",
    },
    "id title"
  );
  return JSON.stringify({
    data: { owned: ownedCollectives, member: memberInCollectives },
  });
}

async function getAllCollectives(userId) {
  const unjoinedCollectives = await Collective.find({
    owner: { $ne: userId },
    "members.userId": { $ne: userId },
  }).select("id title");

  const joinedCollectives = await Collective.find(
    {
      owner: { $ne: userId },
      "members.userId": userId,
      "members.status": "Requested",
    },
    { _id: 1, title: 1, "members.status": 1 }
  );
  return JSON.stringify({ unjoinedCollectives, joinedCollectives });
}

async function joinCollective(req) {
  const { collectiveId } = req.query;
  const { userId, name } = req.body;
  const collective = await Collective.findById(collectiveId);
  collective.members.push({
    userId,
    name,
    status: "Requested",
  });
  collective.save();
  return collective;
}

async function modifyUserRequest(req) {
  const { action, _id, collectiveId } = req.body;
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

async function getCollectiveMembers(collectiveId) {
  const members = await Collective.findById(collectiveId).select("members");
  return JSON.stringify(members);
}

async function getCollective(id) {
  const collective = await Collective.findById(id);
  return collective;
}

async function getCollectiveOwner(id) {
  const collective = await Collective.findById(id);
  return collective.owner;
}

async function postCollective(req) {
  const createdCollective = await Collective.create({
    ...req.body,
    owner: req.userId,
    members: [],
  });
  return createdCollective;
}

async function getInstruments(collectiveId) {
  const instruments = await Collective.findById(collectiveId, "instruments");
  return JSON.stringify(instruments);
}

async function getInstrumentsJson(collectiveId) {
  const instruments = await Collective.findById(collectiveId, "instruments");
  return instruments;
}
async function postInstruments(req) {
  const { collectiveId } = req.query;
  const instruments = await Collective.findByIdAndUpdate(collectiveId, {
    instruments: req.body,
  });
  return instruments;
}

module.exports = {
  getCollectives,
  postCollective,
  getCollective,
  getInstruments,
  postInstruments,
  getInstrumentsJson,
  getCollectiveOwner,
  getAllCollectives,
  joinCollective,
  getCollectiveMembers,
  modifyUserRequest,
};
