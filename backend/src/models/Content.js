const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["movie", "show", "sports"],
      required: true,
      default: "movie",
    },
    genres: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      default: "English",
    },
    releaseYear: {
      type: Number,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    ageRating: {
      type: String,
      default: "U/A 13+",
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    posterUrl: {
      type: String,
      required: [true, "Poster image is required"],
    },
    bannerUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      default: "",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    category: {
      // free-form label used to group rows on the home page,
      // e.g. "New on PixelPlay", "Trending Movies", "Comedy Movies"
      type: String,
      default: "",
    },
    views: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// MongoDB's text index normally looks at a field named "language" on each
// document to decide which stemming rules to use. Our schema already has a
// "language" field for the movie/show's spoken language (e.g. "Hindi"),
// which isn't a valid Mongo text-search language and breaks inserts. The
// languageOverride option tells the text index to look at a different,
// nonexistent field instead, so it always falls back to the default
// language and leaves our own "language" field alone.
contentSchema.index(
  { title: "text", description: "text", genres: "text" },
  { language_override: "textIndexLanguage" }
);

module.exports = mongoose.model("Content", contentSchema);