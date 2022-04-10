import dbConnect from "../util/dbConnect";
import Collective from "../models/Collective";

export async function getInstruments(collectiveId) {
  await dbConnect();
  const instruments = await Collective.findById(collectiveId, "instruments");
  return JSON.stringify(instruments);
}
