const Counter = require("../models/Counter");

async function generateSupportId(role) {
  const prefix = role === "professional" ? "P" : "C";

  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const date = `${yy}${mm}${dd}`; // YYMMDD
  const counterId = `${prefix}_${date}`;

  const counter = await Counter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 }, $setOnInsert: { date } },
    { new: true, upsert: true }
  );

  const sequence = String(counter.seq).padStart(4, "0");

  return `${prefix}${date}${sequence}`;
}

module.exports = generateSupportId;