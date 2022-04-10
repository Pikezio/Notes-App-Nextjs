import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  composer: String,
  arranger: String,
  video: String,
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

SongSchema.index({ title: "text", composer: "text", arranger: "text" });

export default mongoose.models.Song || mongoose.model("Song", SongSchema);
