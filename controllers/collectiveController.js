import Collective from "../models/Collective";
import dbConnect from "../util/dbConnect";
//Route: /collectives - POST, GET

async function getCollectives(userId) {
  await dbConnect();
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
  await dbConnect();
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

async function getCollectiveMember(collectiveId, memberUserId) {
  await dbConnect();
  const member = await Collective.findOne(
    {
      _id: collectiveId,
      "members.userId": memberUserId,
    },
    {
      "members.$": 1,
    }
  );
  return member;
}

async function getCollective(id) {
  await dbConnect();
  const collective = await Collective.findById(id);
  return JSON.stringify(collective);
}

async function getCollectiveOwner(id) {
  await dbConnect();
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

async function updateCollective(req) {
  const { collectiveId } = req.query;
  const updated = await Collective.findOneAndUpdate(
    {
      _id: collectiveId,
    },

    req.body
  );
  return updated;
}

async function deleteCollective(req) {
  const { collectiveId } = req.query;
  const deleted = await Collective.findOneAndDelete({
    _id: collectiveId,
  });
  return deleted;
}

async function getInstruments(collectiveId) {
  await dbConnect();
  const instruments = await Collective.findById(collectiveId, "instruments");
  return JSON.stringify(instruments);
}

async function getInstrumentsJson(collectiveId) {
  const instruments = await Collective.findById(collectiveId, "instruments");
  return instruments;
}
async function postInstruments(req) {
  await dbConnect();
  const { collectiveId } = req.query;
  const instruments = await Collective.findByIdAndUpdate(collectiveId, {
    instruments: req.body,
  });
  return instruments;
}

module.exports = {
  getCollectives,
  postCollective,
  updateCollective,
  deleteCollective,
  getCollective,
  getInstruments,
  postInstruments,
  getInstrumentsJson,
  getCollectiveOwner,
  getAllCollectives,
  joinCollective,
  getCollectiveMembers,
  getCollectiveMember,
  modifyUserRequest,
};
