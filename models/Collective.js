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
    logo: String,
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
        status: {
          type: String,
          required: true,
          default: "Requested",
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
