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
    skillsRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "skills" }],
    jobRef: { type: mongoose.Schema.Types.ObjectId, ref: "jobs" },
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("freelances", freelanceSchema);
