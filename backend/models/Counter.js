const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema(
  {
    _id: String,
    seq: { type: Number, default: 0 },
    date: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Counter", CounterSchema);
