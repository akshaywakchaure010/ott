const User = require("../models/User");
const Content = require("../models/Content");

// @route GET /api/watchlist
const getWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("watchlist");
    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/watchlist/:contentId
const addToWatchlist = async (req, res, next) => {
  try {
    const { contentId } = req.params;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    const user = await User.findById(req.user._id);
    const alreadyAdded = user.watchlist.some((id) => id.toString() === contentId);

    if (alreadyAdded) {
      return res.status(400).json({ message: "Already in your watchlist" });
    }

    user.watchlist.push(contentId);
    await user.save();

    res.status(200).json({ message: "Added to watchlist", watchlist: user.watchlist });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/watchlist/:contentId
const removeFromWatchlist = async (req, res, next) => {
  try {
    const { contentId } = req.params;

    const user = await User.findById(req.user._id);
    user.watchlist = user.watchlist.filter((id) => id.toString() !== contentId);
    await user.save();

    res.status(200).json({ message: "Removed from watchlist", watchlist: user.watchlist });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/watchlist/continue-watching/:contentId
// Upserts progress for "Continue Watching" row
const updateContinueWatching = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    const { progressSeconds, durationSeconds } = req.body;

    const user = await User.findById(req.user._id);
    const existingIndex = user.continueWatching.findIndex(
      (entry) => entry.content.toString() === contentId
    );

    if (existingIndex >= 0) {
      user.continueWatching[existingIndex].progressSeconds = progressSeconds;
      user.continueWatching[existingIndex].durationSeconds = durationSeconds;
      user.continueWatching[existingIndex].updatedAt = new Date();
    } else {
      user.continueWatching.push({
        content: contentId,
        progressSeconds,
        durationSeconds,
        updatedAt: new Date(),
      });
    }

    await user.save();
    res.status(200).json({ message: "Progress saved" });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/watchlist/continue-watching
const getContinueWatching = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("continueWatching.content");
    const items = user.continueWatching
      .filter((entry) => entry.content) // guard against deleted content
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.status(200).json({ continueWatching: items });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateContinueWatching,
  getContinueWatching,
};
