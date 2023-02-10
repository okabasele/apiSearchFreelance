const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "skills" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("jobs", jobSchema);
