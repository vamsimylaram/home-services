const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema({
  // links professional to main user account
  user_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  // services offered
  service_categories: [
    {
      type: String,
      required: true,
    },
  ],

  // availability slots / days / time
  availability: {
    type: Object,
    default: {},
  },

  // verification by platform admin
  verified: {
    type: Boolean,
    default: false,
  },

  /* ---------------- REVIEWS & RATINGS ---------------- */

  // average rating (calculated, not user entered)
  average_rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

  // number of reviews received
  total_reviews: {
    type: Number,
    default: 0,
  },

  // number of completed jobs
  completed_jobs: {
    type: Number,
    default: 0,
  },

  /* ---------------- EARNINGS ---------------- */

  // total earnings from completed jobs
  total_earnings: {
    type: Number,
    default: 0,
  },

  // earnings waiting for settlement
  pending_earnings: {
    type: Number,
    default: 0,
  },

  // platform commission deducted (optional but useful)
  platform_fee_paid: {
    type: Number,
    default: 0,
  },

  /* ---------------- STATUS ---------------- */

  // professional profile state
  status: {
    type: String,
    enum: ["new", "active", "suspended"],
    default: "new",
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Professional", professionalSchema);
