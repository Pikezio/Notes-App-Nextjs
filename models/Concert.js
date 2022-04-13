import mongoose from "mongoose";

const ConcertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    collectiveId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    poster: String,
    songs: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Concert ||
  mongoose.model("Concert", ConcertSchema);