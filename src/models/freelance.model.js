const mongoose = require("mongoose");

const freelanceSchema = mongoose.Schema(
  {
    dailyWage: {
      type: Number,
      require: true,
    },
    yearsExp: {
      type: Number,
      require: true,
    },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "skills" }],
    job: { type: mongoose.Schema.Types.ObjectId, ref: "jobs" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("freelances", freelanceSchema);
