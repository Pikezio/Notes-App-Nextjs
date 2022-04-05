import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  composer: {
    type: String,
  },
  arranger: {
    type: String,
  },
  parts: [
    {
      instrument: {
        type: String,
        required: true,
      },
      filename: {
        type: String,
      },
      file: {
        type: String,
        required: true,
      },
    },
  ],
  collectiveId: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Song || mongoose.model("Song", SongSchema);
