import { ObjectId } from "mongodb";
import Song from "../models/Song";
import dbConnect from "../util/dbConnect";

export async function getSpecificPart(songId, part) {
  await dbConnect();

  if (part === "all" || part === "---" || part == null) {
    const song = await Song.findById(songId).select(
      "_id title composer arranger parts"
    );
    return JSON.stringify(song);
  }

  const data = await Song.aggregate([
    {
      $match: { _id: new ObjectId(songId) },
    },
    { $unwind: "$parts" },
    { $match: { "parts.instrument": part } },
  ]);

  const parts = data.map((part) => ({
    filename: part.parts.filename,
    file: part.parts.file,
  }));

  return JSON.stringify({
    _id: songId,
    title: data[0].title,
    composer: data[0].composer,
    arranger: data[0].arranger,
    instrument: data[0].parts.instrument,
    video: data[0].video,
    parts,
  });
}

// get all parts that have a file in the specified song
export async function doesPartExistForInstrument(songId, instrument) {
  await dbConnect();
  const parts = await Song.find(
    {
      _id: songId,
      "parts.instrument": instrument,
    },
    {
      id: 1,
    }
  );
  if (parts[0] != null) {
    return true;
  } else {
    return false;
  }
}
