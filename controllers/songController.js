import Song from "../models/Song";
import { getCollectives } from "./collectiveController";

//Route: /collectives/[collectiveId]/songs - POST, GET

export async function getAllSongs(req) {
  // Get all collectives that the current user is part of
  const userCollectives = JSON.parse(await getCollectives(req.userId)).data;
  const allCollectives = userCollectives.owned.concat(userCollectives.member);

  const { search } = req.query;

  // Get songs for each collective
  const songs = await Promise.all(
    allCollectives.map(async (col) => ({
      collective: col,
      songs: JSON.parse(await searchSongs(col._id, search)),
    }))
  );
  return songs;
}

// Search songs
export async function searchSongs(collectiveId, search) {
  if (search === undefined) return {};
  const res = await Song.aggregate([
    {
      $search: {
        index: "default",
        text: {
          query: search,
          path: {
            wildcard: "*",
          },
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    },
    { $limit: 6 },
    {
      $match: {
        collectiveId: collectiveId,
      },
    },
    {
      $project: {
        title: 1,
      },
    },
  ]);
  return JSON.stringify(res);
}

export async function getPartOfSong(req) {
  const { songId, part } = req.query;
  const songWithPart = await Song.findOne(
    { _id: songId, "parts.instrument": part },
    {
      title: 1,
      composer: 1,
      arranger: 1,
      collectiveId: 1,
      "parts.$": 1,
    }
  );
  return songWithPart;
}

export async function getSong(songId) {
  const song = await Song.findById(songId).select({
    _id: 1,
    title: 1,
    composer: 1,
    arranger: 1,
    collectiveId: 1,
    "parts._id": 1,
    "parts.instrument": 1,
    "parts.filename": 1,
  });
  return JSON.stringify(song);
}

export async function postSong(req) {
  const { collectiveId } = req.query;
  const data = { ...req.body, collectiveId };
  const song = await Song.create(data);
  return song.id;
}

export async function deleteSong(req) {
  const { songId } = req.query;
  const song = await Song.findByIdAndDelete(songId);
  return song;
}

export async function updateSong(req) {
  const { songId } = req.query;
  const song = await Song.findByIdAndUpdate(songId, req.body);
  return song;
}

export async function getSongCollectiveId(req) {
  const { songId } = req.query;
  const songCollectiveId = await Song.findById(songId).select("collectiveId");
  return songCollectiveId;
}

export async function getSongNamesByPart(req) {
  const { collectiveId, instrument } = req.query;
  const songNames = await Song.find(
    {
      collectiveId,
      "parts.instrument": instrument,
    },
    {
      title: 1,
    }
  );
  return songNames;
}
