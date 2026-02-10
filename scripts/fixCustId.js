const mongoose = require("mongoose");
const User = require("../models/User");
const Counter = require("../models/Counter");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const users = await User.find({ cust_id: { $exists: false } });

  for (const user of users) {
    const seqName = `${user.role}_seq`;

    const counter = await Counter.findByIdAndUpdate(
      { _id: seqName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const prefix = user.role.substring(0, 3).toUpperCase();
    user.cust_id = `${prefix}-${String(counter.seq).padStart(6, "0")}`;

    await user.save();
  }

  console.log("✅ cust_id backfilled");
  process.exit();
})();
