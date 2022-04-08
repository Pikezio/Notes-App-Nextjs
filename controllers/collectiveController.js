import Collective from "../models/Collective";
import dbConnect from "../util/dbConnect";

//Route: /collectives - POST, GET

// Gets all owned and joined collectives for a user
export async function getCollectives(userId) {
  await dbConnect();
  const ownedCollectives = await Collective.find(
    { owner: userId },
    "title logo"
  );
  const memberInCollectives = await Collective.find(
    {
      owner: { $ne: userId },
      "members.userId": userId,
      "members.status": "Accepted",
    },
    "title logo"
  );
  return JSON.stringify({
    data: { owned: ownedCollectives, member: memberInCollectives },
  });
}

// Gets all collectives that are not joined by the user
export async function getAllCollectives(userId) {
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

// Gets all members for a specific collectiveId
export async function getCollectiveMembers(collectiveId) {
  const members = await Collective.findById(collectiveId).select("members");
  return JSON.stringify(members);
}

// Get specific collective member by ID
export async function getCollectiveMember(collectiveId, memberUserId) {
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

export async function getCollective(id) {
  await dbConnect();
  const collective = await Collective.findById(id);
  return JSON.stringify(collective);
}

// Gets the owner of collective
export async function getCollectiveOwner(id) {
  await dbConnect();
  const collective = await Collective.findById(id);
  return collective.owner;
}

export async function postCollective(req) {
  const createdCollective = await Collective.create({
    ...req.body,
    owner: req.userId,
    members: [],
  });
  return createdCollective;
}

export async function updateCollective(req) {
  const { collectiveId } = req.query;
  const updated = await Collective.findOneAndUpdate(
    {
      _id: collectiveId,
    },

    req.body
  );
  return updated;
}

export async function deleteCollective(req) {
  const { collectiveId } = req.query;
  const deleted = await Collective.findOneAndDelete({
    _id: collectiveId,
  });
  return deleted;
}
