const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/bookingController");

router.post("/", authenticate, ctrl.createBooking);
router.get("/", authenticate, ctrl.getBookings);

module.exports = router;
