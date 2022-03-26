import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  collectives: [
    {
      status: {
        type: String,
        required: true,
        default: "Requested",
      },
      collectiveId: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.models.Member || mongoose.model("Member", memberSchema);
