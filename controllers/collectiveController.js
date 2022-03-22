import Collective from "../models/Collective";
//Route: /collectives - POST, GET

async function getCollectives(userId) {
  const ownedCollectives = await Collective.find({ owner: userId }, "id title");
  const memberInCollectives = await Collective.find(
    {
      "members.userId": userId,
    },
    "id title"
  );
  return JSON.stringify({
    data: { owned: ownedCollectives, member: memberInCollectives },
  });
}

async function getCollective(id) {
  const collective = await Collective.findById(id);
  return collective;
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
};
