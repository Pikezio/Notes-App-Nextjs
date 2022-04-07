import Song from "../models/Song";

export async function updatePart(req) {
  const { songId, partId } = req.query;
  let setObject = {
    $set: {
      "parts.$.instrument": req.body.instrument,
    },
  };

  if (req.body.file !== null) {
    setObject = {
      $set: {
        "parts.$.instrument": req.body.instrument,
        "parts.$.file": req.body.file,
      },
    };
  }

  const song = await Song.updateOne(
    {
      _id: songId,
      "parts._id": partId,
    },
    setObject
  );
  return setObject;
}

export async function deletePart(req) {
  const { songId, partId } = req.query;
  const song = await Song.findById(songId);
  song.parts.pull({ _id: partId });
  await song.save();
  return {};
}

export async function addPart(req) {
  const { songId } = req.query;
  const song = await Song.findById(songId);
  req.body.map((part) => {
    song.parts.push(part);
  });
  await song.save();
  return {};
}
