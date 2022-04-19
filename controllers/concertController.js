import Collective from "../models/Collective";
import Concert from "../models/Concert";

export async function getConcertsByCollectiveId(collectiveId) {
  const concerts = await Concert.find({ collectiveId });
  return JSON.stringify(concerts);
}

export async function getConcertById(concertId) {
  const concert = await Concert.findById(concertId);
  return JSON.stringify(concert);
}

export async function getCollectiveConcerts(collectives, amount) {
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

export async function getAllConcerts(collectiveIds) {
  const concerts = await Concert.find(
    {
      collectiveId: { $in: collectiveIds },
    },
    {
      title: 1,
      date: 1,
      collectiveId: 1,
      // poster: 1,
    }
  ).sort({ date: "asc" });

  // get collective titles for each concert
  const collectiveTitles = await Collective.find(
    {
      _id: { $in: collectiveIds },
    },
    {
      title: 1,
    }
  );

  const concertTitles = concerts.map((concert) => {
    const collectiveTitle = collectiveTitles.find(
      (collective) => collective._id == concert.collectiveId
    );
    return {
      ...concert._doc,
      collectiveTitle: collectiveTitle.title,
    };
  });

  return JSON.stringify(concertTitles);
}
