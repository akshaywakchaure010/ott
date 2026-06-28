const express = require("express");
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateContinueWatching,
  getContinueWatching,
} = require("../controllers/watchlistController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All watchlist routes require authentication
router.use(protect);

router.get("/", getWatchlist);
router.post("/:contentId", addToWatchlist);
router.delete("/:contentId", removeFromWatchlist);

router.get("/continue-watching", getContinueWatching);
router.post("/continue-watching/:contentId", updateContinueWatching);

module.exports = router;
