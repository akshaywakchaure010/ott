const User = require("../models/User");
const Content = require("../models/Content");

// @route GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalAdmins, totalContent, moviesCount, showsCount, sportsCount] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "admin" }),
        Content.countDocuments(),
        Content.countDocuments({ type: "movie" }),
        Content.countDocuments({ type: "show" }),
        Content.countDocuments({ type: "sports" }),
      ]);

    const topViewed = await Content.find().sort({ views: -1 }).limit(5).select("title views type");

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt role");

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalContent,
      breakdown: { movies: moviesCount, shows: showsCount, sports: sportsCount },
      topViewed,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ users: users.map((u) => u.toSafeObject()) });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/admin/users/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/admin/users/:id/status
// Toggle active / deactivated
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllUsers, updateUserRole, updateUserStatus, deleteUser };
