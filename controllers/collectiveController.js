import Collective from "../models/Collective";

//Route: /collectives - POST, GET

async function getCollectives(req) {
  const ownedCollectives = await Collective.find(
    { owner: req.userId },
    "id title"
  );
  const memberInCollectives = await Collective.find(
    {
      "members.userId": req.userId,
    },
    "id title"
  );
  return { owned: ownedCollectives, member: memberInCollectives };
}

async function postCollective(req) {
  const createdCollective = await Collective.create({
    ...req.body,
    owner: req.userId,
    members: [],
  });
  return createdCollective;
}

module.exports = {
  getCollectives,
  postCollective,
};
