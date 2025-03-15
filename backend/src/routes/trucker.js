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

// Protect all routes
router.use(protect);

// Document routes
router.get("/documents", getDocuments);
router.post("/documents", uploadDocument);
router.delete("/documents/:id", deleteDocument);

// Trucker routes
router.get("/", getTruckers);
router.get("/:id", getTrucker);
router.post("/", createTrucker);
router.put("/:id", updateTrucker);
router.delete("/:id", deleteTrucker);
router.get("/dashboard", getDashboard);
router.get("/loads", getLoads);
router.get("/bids", getBids);
router.get("/earnings", getEarnings);
router.get("/performance", getPerformance);

module.exports = router;
