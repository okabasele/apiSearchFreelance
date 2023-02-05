const mongoose = require("mongoose");

const companySchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
    siret: {
      type: String,
      require: true,
    },
    missions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "missions", default: [] },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("companies", companySchema);
