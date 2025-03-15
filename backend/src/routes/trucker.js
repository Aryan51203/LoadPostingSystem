const express = require("express");
const router = express.Router();
const {
  getTruckers,
  getTrucker,
  createTrucker,
  updateTrucker,
  deleteTrucker,
  getDashboard,
  getLoads,
  getBids,
  getEarnings,
  getPerformance,
} = require("../controllers/truckerController");

const {
  getDocuments,
  uploadDocument,
  deleteDocument,
} = require("../controllers/documentController");

const { protect } = require("../middleware/auth");

router.post("/", createTrucker);
// Protect all routes
router.use(protect);

// Document routes
router.get("/documents", getDocuments);
router.post("/documents", uploadDocument);
router.delete("/documents/:id", deleteDocument);

// Trucker routes
router.get("/", getTruckers);
router.get("/bids", getBids);
router.get("/dashboard", getDashboard);
router.get("/loads", getLoads);
router.get("/earnings", getEarnings);
router.get("/performance", getPerformance);
router.get("/:id", getTrucker);
router.put("/:id", updateTrucker);
router.delete("/:id", deleteTrucker);

module.exports = router;
