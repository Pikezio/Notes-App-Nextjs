import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  songId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  elements: String,
});

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
