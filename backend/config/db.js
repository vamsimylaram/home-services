const mongoose = require("mongoose");

/*const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected",process.env.MONGO_URI, process.env.DB_NAME);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};*/

const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://aerpulamadhu18:madhu123@cluster0.0blnk4d.mongodb.net";
const DB_NAME = process.env.DB_NAME || "all_in_one_service";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${MONGO_URL}/${DB_NAME}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(MONGO_URL);
    console.log(DB_NAME);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
