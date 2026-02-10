const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const ctrl = require("../controllers/serviceController");

router.get("/", ctrl.getServices);
router.get("/:category_id", ctrl.getServiceByCategoryId);
router.post("/", authenticate, admin, ctrl.createService);

module.exports = router;
