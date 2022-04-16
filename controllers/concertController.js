import Concert from "../models/Concert";

export async function getConcertsByCollectiveId(collectiveId) {
  const concerts = await Concert.find({ collectiveId });
  return JSON.stringify(concerts);
}

export async function getConcertById(concertId) {
  const concert = await Concert.findById(concertId);
  return JSON.stringify(concert);
}

export async function getAllConcerts(collectives, amount) {
  const concerts = await Concert.find(
    {
      collectiveId: { $in: collectives },
      date: { $gte: new Date() },
    },
    {
      title: 1,
      date: 1,
      collectiveId: 1,
      poster: 1,
    }
  )
    .sort({ date: "asc" })
    .limit(amount);

  return JSON.stringify(concerts);
}
