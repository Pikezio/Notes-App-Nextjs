import mongoose from "mongoose";
import Part from "./Part";

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
  parts: [{ type: Part }],
});

export default mongoose.models.Song || mongoose.model("Song", SongSchema);
