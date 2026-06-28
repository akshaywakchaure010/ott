const express = require("express");
const {
  getAllContent,
  getHomeRows,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  incrementView,
} = require("../controllers/contentController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllContent);
router.get("/categories", getHomeRows);
router.get("/:id", getContentById);
router.post("/:id/view", incrementView);

// Admin-only routes
router.post("/", protect, adminOnly, createContent);
router.put("/:id", protect, adminOnly, updateContent);
router.delete("/:id", protect, adminOnly, deleteContent);

module.exports = router;
