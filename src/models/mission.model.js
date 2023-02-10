const mongoose = require("mongoose");

const missionSchema = mongoose.Schema(
  {
    beginsAt: {
      type: Date,
      require: true,
    },
    endsAt: {
      type: Date,
      require: true,
    },
    totalWage: {
      type: Number,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    isOpen: {
      type: Boolean,
      require: true,
      default: true,
    },
    candidates: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        status: { type: String, default: "pending" },
      },
    ],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "skills" }],
    job: { type: mongoose.Schema.Types.ObjectId, ref: "jobs" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("missions", missionSchema);
