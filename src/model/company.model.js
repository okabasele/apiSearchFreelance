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
      maxLength: 9,
      require: true,
    },
    missionsRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "missions" }],
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("companies", companySchema);
