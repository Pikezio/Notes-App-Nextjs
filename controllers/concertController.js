import Concert from "../models/Concert";

export async function getConcertsByCollectiveId(collectiveId) {
  const concerts = await Concert.find({ collectiveId });
  return JSON.stringify(concerts);
}

export async function getConcertById(concertId) {
  const concert = await Concert.findById(concertId);
  return JSON.stringify(concert);
}
