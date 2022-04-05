import dbConnect from "../util/dbConnect";
import Collective from "../models/Collective";


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
    getInstruments,
    getInstrumentsJson,
    postInstruments,
}