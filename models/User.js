import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.models.TestUser ||
  mongoose.model("TestUser", UserSchema);
