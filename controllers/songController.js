import Song from "../models/Song";
//Route: /collectives/[collectiveId]/songs - POST, GET

async function getSongs(req) {
  const { collectiveId } = req.query;
  const collectiveSongs = await Song.find(
    {
      collectiveId,
    },
    "id title"
  );
  return { collectiveSongs };
}

async function getSong(req) {
  const { id } = req.query;
  const song = await Song.findById(id);
  return song;
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
};
