const Content = require("../models/Content");

// @route GET /api/content
// Supports query params: type, genre, search, category, featured, trending, limit, page
const getAllContent = async (req, res, next) => {
  try {
    const { type, genre, search, category, featured, trending, limit, page } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (genre) filter.genres = genre;
    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    if (trending === "true") filter.isTrending = true;
    if (search) filter.$text = { $search: search };

    const pageSize = Math.min(parseInt(limit, 10) || 50, 100);
    const pageNum = parseInt(page, 10) || 1;

    const [items, total] = await Promise.all([
      Content.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Content.countDocuments(filter),
    ]);

    res.status(200).json({
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize) || 1,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/content/categories
// Groups content into the "rows" used on the Home page carousels
const getHomeRows = async (req, res, next) => {
  try {
    const distinctCategories = await Content.distinct("category", {
      category: { $ne: "" },
    });

    const rows = await Promise.all(
      distinctCategories.map(async (category) => {
        const items = await Content.find({ category }).limit(20).sort({ createdAt: -1 });
        return { title: category, items };
      })
    );

    res.status(200).json({ rows: rows.filter((r) => r.items.length > 0) });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/content/:id
const getContentById = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json({ content });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/content (admin only)
const createContent = async (req, res, next) => {
  try {
    const payload = { ...req.body, createdBy: req.user._id };
    const content = await Content.create(payload);
    res.status(201).json({ content });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/content/:id (admin only)
const updateContent = async (req, res, next) => {
  try {
    const content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json({ content });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/content/:id (admin only)
const deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/content/:id/view
// Increments the view counter - called when a user starts playback
const incrementView = async (req, res, next) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json({ views: content.views });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContent,
  getHomeRows,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  incrementView,
};
