// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// module.exports = async (req, res, next) => {
//   try {
//     const token = req.cookies.session_token;

//     if (!token)
//       return res.status(401).json({
//         detail: "Not authenticated",
//       });

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     const user = await User.findById(decoded.id).select("-password_hash");

//     if (!user)
//       return res.status(404).json({
//         detail: "User not found",
//       });

//     req.user = user;

//     next();

//   } catch (err) {
//     return res.status(401).json({
//       detail: "Invalid token",
//     });
//   }
// };


const jwt = require("jsonwebtoken");
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
};
