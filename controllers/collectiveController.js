import Collective from "../models/Collective";
import { getSession } from "next-auth/react";

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
  console.log({ owned: ownedCollectives, member: memberInCollectives });
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

async function getInstruments(req) {
  const { collectiveId } = req.query;
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
};
