const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Browsers automatically request this; respond with "no content" instead
// of letting it fall through to a 404 (this is an API with no favicon).
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Root route - lets Render's health checks (and anyone visiting the API
// URL directly in a browser) get a clear response instead of a 404.
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Pixel Play API is running. See /api/health for a health check.",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Pixel Play API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/admin", adminRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
