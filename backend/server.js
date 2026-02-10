/*require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));

const PORT = 8001;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// 🔗 Connect MongoDB
connectDB();

// 🔥 Required to accept Postman JSON
app.use(express.json());
app.use(cookieParser());

// 🌐 CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 🧪 LOG REQUESTS (very useful for Postman debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ❤️ HEALTH CHECK (FIRST POSTMAN TEST)
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Backend is running" });
});

// 🚏 ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));

// 🔧 ADD THIS (professional routes)
app.use("/api/professional", require("./routes/professionalRoutes"));

const PORT = 8001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

