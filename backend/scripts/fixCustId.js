require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const User = require("../models/User");
const Counter = require("../models/Counter");

(async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Mongo Connected");

    const users = await User.find({
      cust_id: { $exists: false },
    });

    console.log(`Found ${users.length} users to fix`);

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

    await mongoose.connection.close();

  } catch (err) {

    console.error("❌ Migration failed:", err);

    await mongoose.connection.close();
  }
})();
