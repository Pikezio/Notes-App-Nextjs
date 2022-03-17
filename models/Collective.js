import mongoose from "mongoose";

const CollectiveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    songs: [String],
    members: [
      {
        userId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        confirmed: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
    instruments: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Collective ||
  mongoose.model("Collective", CollectiveSchema);
