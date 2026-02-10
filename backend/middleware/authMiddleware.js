/*const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {

    const token = req.cookies?.session_token;

    // ✅ No token
    if (!token) {
      return res.status(401).json({
        detail: "Not authenticated",
      });
    }

    // ✅ Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ✅ Fetch fresh user from DB
    const user = await User.findById(decoded.id)
      .select("-password_hash");

    if (!user) {
      return res.status(401).json({
        detail: "User no longer exists",
      });
    }

    // 🔥 Attach useful shortcuts
    req.user = user;
    req.userId = user._id;
    req.role = user.role;
    req.cust_id = user.cust_id;

    next();

  } catch (err) {

    // ✅ Token expired vs invalid
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        detail: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      detail: "Invalid token",
    });
  }
};*/

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 AUTHENTICATION (ALL USERS)
const authenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies?.session_token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ detail: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ user_id: decoded.user_id })
      .select("-password_hash")
      .lean();

    if (!user) {
      return res.status(401).json({ detail: "User not found" });
    }

    req.user = user;        // 👈 COMMON for all roles
    req.user_id = user.user_id;
    req.role = user.role;

    next();
  } catch (err) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
};

// 🧑 CUSTOMER ONLY
const requireCustomer = (req, res, next) => {
  if (req.role !== "customer") {
    return res.status(403).json({
      detail: "Customers only"
    });
  }
  next();
};

// 🧑‍🔧 PROFESSIONAL ONLY
const requireProfessional = (req, res, next) => {
  if (req.role !== "professional") {
    return res.status(403).json({
      detail: "Professionals only"
    });
  }
  next();
};

// 👑 ADMIN ONLY (optional)
const requireAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({
      detail: "Admins only"
    });
  }
  next();
};

module.exports = {
  authenticate,
  requireCustomer,
  requireProfessional,
  requireAdmin
};

