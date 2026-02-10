// const jwt = require("jsonwebtoken");

// const sendToken = (user, res) => {

//   const token = jwt.sign(
//     {
//       id: user._id,
//       role: user.role,
//       name: user.name,
//       email: user.email,
//       cust_id: user.cust_id, // 🔥 VERY IMPORTANT if using readable IDs
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "30d",
//     }
//   );

//   res.cookie("session_token", token, {
//     httpOnly: true,
//     secure: false, // 👉 true in production (HTTPS)
//     sameSite: "lax",
//     maxAge: 1000 * 60 * 60 * 24 * 30,
//   });

//   const safeUser = {
//     id: user._id,
//     cust_id: user.cust_id,
//     email: user.email,
//     name: user.name,
//     role: user.role,
//     phone: user.phone,
//   };

//   res.json({
//     success: true,
//     user: safeUser,
//   });
// };

// module.exports = sendToken;


const jwt = require("jsonwebtoken");

const sendToken = (user, res) => {

  // 🔥 Keep JWT minimal
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      cust_id: user.cust_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.cookie("session_token", token, {
    httpOnly: true,

    // ✅ AUTO production security
    secure: process.env.NODE_ENV === "production",

    sameSite: "lax",

    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  // ✅ NEVER send password_hash (already safe)
  const safeUser = {
    id: user._id,
    cust_id: user.cust_id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    picture: user.picture,
  };

  res.status(200).json({
    success: true,
    user: safeUser,
  });
};

module.exports = sendToken;
