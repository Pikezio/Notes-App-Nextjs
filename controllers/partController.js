import Song from "../models/Song";
import dbConnect from "../util/dbConnect";
import { getSongCollectiveId } from "./songController";

export async function getSpecificPart(songId, part) {
  await dbConnect();

  const song = await Song.findOne(
    {
      _id: songId,
      "parts.instrument": part,
    },
    {
      title: 1,
      composer: 1,
      arranger: 1,
      collectiveId: 1,
      video: 1,
      "parts.$": 1,
    }
  );
  if (song) {
    return JSON.stringify({
      _id: song._id,
      title: song.title,
      composer: song.composer,
      arranger: song.arranger,
      video: song.video,
      instrument: song.parts[0].instrument,
      filename: song.parts[0].filename,
      file: song.parts[0].file,
      collectiveId: song.collectiveId,
    });
  } else return null;
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
