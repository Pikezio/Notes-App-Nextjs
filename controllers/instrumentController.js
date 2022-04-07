import dbConnect from "../util/dbConnect";
import Collective from "../models/Collective";

export async function getInstruments(collectiveId) {
  await dbConnect();
  const instruments = await Collective.findById(collectiveId, "instruments");
  return JSON.stringify(instruments);
}

export async function getInstrumentsJson(collectiveId) {
  const instruments = await Collective.findById(collectiveId, "instruments");
  return instruments;
}
export async function postInstruments(req) {
  await dbConnect();
  const { collectiveId } = req.query;
  const instruments = await Collective.findByIdAndUpdate(collectiveId, {
    instruments: req.body,
  });
  return instruments;
}
