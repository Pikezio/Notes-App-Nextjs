var mongoose = require("mongoose");

var partSchema = new mongoose.Schema({
  title: String,
  instrument: String,
  file: {
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.models.Part || mongoose.model("Part", partSchema);
