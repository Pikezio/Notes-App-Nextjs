import dbConnect from "../util/dbConnect";
import Collective from "../models/Collective";

export async function getInstruments(collectiveId) {
  await dbConnect();
  const data = await Collective.findById(collectiveId, "instruments");
  if (!data) return null;
  return JSON.stringify(data.instruments);
}
