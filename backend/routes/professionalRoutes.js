const express = require("express");
const { Professional, Booking } = require("../models");
const { authenticate, requireProfessional } = require("../middleware/authMiddleware");

const router = express.Router();

// Get available bookings for professional (pending bookings in their categories)
router.get("/available-bookings", authenticate, requireProfessional, async (req, res) => {
  try {
    const professional = await Professional.findOne({ user_id: req.user.user_id });

    if (!professional || professional.service_categories.length === 0) {
      return res.json([]);
    }

    const bookings = await Booking.find({
      service_category_id: { $in: professional.service_categories },
      status: "pending"
    })
      .select("-_id -__v")
      .sort({ created_at: -1 })
      .lean();

    res.json(bookings);
  } catch (error) {
    console.error("Get available bookings error:", error);
    res.status(500).json({ detail: "Failed to get available bookings" });
  }
});

// Create or update professional profile
router.post("/profile", authenticate, requireProfessional, async (req, res) => {
  try {
    const { service_categories, availability } = req.body;

    let professional = await Professional.findOne({ user_id: req.user.user_id });

    if (professional) {
      if (service_categories) professional.service_categories = service_categories;
      if (availability) professional.availability = availability;
      await professional.save();
    } else {
      professional = new Professional({
        user_id: req.user.user_id,
        service_categories: service_categories || [],
        availability: availability || {
          monday: ["09:00", "17:00"],
          tuesday: ["09:00", "17:00"],
          wednesday: ["09:00", "17:00"],
          thursday: ["09:00", "17:00"],
          friday: ["09:00", "17:00"]
        },
        verified: false,
        rating: 0,
        total_reviews: 0,
        earnings_total: 0,
        created_at: new Date()
      });

      await professional.save();
    }

    const professionalObj = professional.toObject();
    delete professionalObj._id;
    delete professionalObj.__v;

    res.json(professionalObj);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ detail: "Failed to update profile" });
  }
});

// Get professional profile
router.get("/profile", authenticate, requireProfessional, async (req, res) => {
  try {
    const professional = await Professional.findOne({ user_id: req.user.user_id })
      .select("-_id -__v")
      .lean();

    if (!professional) {
      return res.status(404).json({ detail: "Professional profile not found" });
    }

    res.json(professional);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ detail: "Failed to get profile" });
  }
});

// Get professional earnings dashboard
router.get("/earnings", authenticate, requireProfessional, async (req, res) => {
  try {
    const professional = await Professional.findOne({ user_id: req.user.user_id });

    if (!professional) {
      return res.status(404).json({ detail: "Professional profile not found" });
    }

    const completedBookings = await Booking.find({
      professional_id: req.user.user_id,
      status: "completed"
    })
      .select("-_id -__v")
      .lean();

    const totalEarnings = completedBookings.reduce(
      (sum, booking) => sum + (booking.price || 0),
      0
    );

    const allBookings = await Booking.find({
      professional_id: req.user.user_id
    }).lean();

    const bookingsByStatus = {
      pending: allBookings.filter(b => b.status === "pending").length,
      accepted: allBookings.filter(b => b.status === "accepted").length,
      in_progress: allBookings.filter(b => b.status === "in_progress").length,
      completed: allBookings.filter(b => b.status === "completed").length,
      cancelled: allBookings.filter(b => b.status === "cancelled").length
    };

    res.json({
      total_earnings: totalEarnings,
      completed_jobs: completedBookings.length,
      total_jobs: allBookings.length,
      rating: professional.rating,
      total_reviews: professional.total_reviews,
      bookings_by_status: bookingsByStatus,
      recent_bookings: completedBookings.slice(0, 5)
    });
  } catch (error) {
    console.error("Get earnings error:", error);
    res.status(500).json({ detail: "Failed to get earnings" });
  }
});

module.exports = router;

