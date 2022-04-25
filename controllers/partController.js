import { ObjectId } from "mongodb";
import Song from "../models/Song";
import dbConnect from "../util/dbConnect";

export async function getSpecificPart(songId, part) {
  await dbConnect();

  if (part === "all" || part === "---" || part == null) {
    const song = await Song.findById(songId).select(
      "_id title composer arranger video parts"
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
    _id: part.parts._id,
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

// gets list of unique instruments for each part of the specified song
export async function getUniquePartInstruments(songId) {
  await dbConnect();
  const parts = await Song.find(
    {
      _id: songId,
    },
    {
      id: 1,
      "parts.instrument": 1,
    }
  );
  const instruments = parts[0].parts.map((part) => part.instrument);
  const uniqueInstruments = [...new Set(instruments)];

  return uniqueInstruments;
}

export async function getPartById(partId) {
  await dbConnect();
  const part = await Song.findOne(
    {
      "parts._id": partId,
    },
    {
      "parts.$": 1,
    }
  );
  return JSON.stringify(part);
}
