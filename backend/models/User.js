// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password_hash: {
//       type: String,
//       required: true,
//     },

//     name: String,
//     role: {
//       type: String,
//       enum: ["customer", "professional", "admin"],
//       default: "customer",
//     },

//     phone: String,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");
const Counter = require("./Counter");

const UserSchema = new mongoose.Schema(
  {
    user_id:{
      type:String,
      required:true,
      unique:true,
      index:true,
    },
    cust_id: {
      type: String,
      unique: true,
      index: true,
      //required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password_hash: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    picture: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["customer", "professional", "admin"],
      default: "customer",
    },

    phone: {
      type: String,
      default: null,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: true,
  }
);

// ✅ PRE-SAVE MIDDLEWARE (AFTER schema creation)
// UserSchema.pre("save", async function () {
//   if (!this.isNew) return;

//   const sequenceName = `${this.role}_seq`;

//   const counter = await Counter.findByIdAndUpdate(
//     { _id: sequenceName },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );

//   const prefix = this.role.substring(0, 3).toUpperCase();

//   this.cust_id = `${prefix}-${String(counter.seq).padStart(6, "0")}`;
// });

// // ✅ EXTRA SAFETY INDEX
// UserSchema.index({ cust_id: 1 });

module.exports = mongoose.model("User", UserSchema);
