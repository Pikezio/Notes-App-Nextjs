import Song from "../models/Song";
import dbConnect from "../util/dbConnect";
import { getCollectives } from "./collectiveController";

//Route: /collectives/[collectiveId]/songs - POST, GET

export async function getAllSongs(req) {
  await dbConnect();
  // Get all collectives that the current user is part of
  const userCollectives = JSON.parse(await getCollectives(req.userId)).data;
  const allCollectives = userCollectives.owned.concat(userCollectives.member);

  const { search } = req.query;

  // Get songs for each collective

  const result = await Promise.all(
    allCollectives.map(async (col) => {
      const collectiveSongs = await searchSongs(col._id, search);
      return collectiveSongs.map((song) => ({
        ...song,
        collectiveId: col._id,
        collectiveTitle: col.title,
        collectiveLogo: col.logo,
      }));
    })
  );

  let items = [];
  for (let index = 0; index < result.length; index++) {
    items = items.concat(result[index]);
  }
  return items;
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
          path: ["title", "composer", "arranger"],
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
        logo: 1,
      },
    },
  ]);
  return res;
}

export async function getSong(songId) {
  const song = await Song.findById(songId).select({
    "parts.file": 0,
  });
  return JSON.stringify(song);
}

export async function getSongCollectiveId(songId) {
  await dbConnect();
  const songCollectiveId = await Song.findById(songId).select("collectiveId");
  return songCollectiveId;
}

export async function getAllCollectiveSongs(collectiveId) {
  await dbConnect();
  const songs = await Song.find({ collectiveId: collectiveId }).select(
    "title composer arranger"
  );
  return JSON.stringify(songs);
}
