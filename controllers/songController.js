import Song from "../models/Song";
//Route: /collectives/[collectiveId]/songs - POST, GET

async function getSongs(collectiveId) {
  const collectiveSongs = await Song.find(
    {
      collectiveId,
    },
    "id title"
  );
  return JSON.stringify(collectiveSongs);
}

async function getPartOfSong(req) {
  const { songId, part } = req.query;
  const songWithPart = await Song.findOne(
    { _id: songId, "parts.instrument": part },
    { _id: 1, title: 1, composer: 1, arranger: 1, "parts.$": 1 }
  );
  return songWithPart;
}

async function getSong(songId) {
  const song = await Song.findById(songId);
  return JSON.stringify(song);
}

async function postSong(req) {
  const { collectiveId } = req.query;
  const data = { ...req.body, collectiveId };
  const song = Song.create(data);
  return song.id;
}

module.exports = {
  postSong,
  getSongs,
  getSong,
  getPartOfSong,
};
