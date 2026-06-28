// Seeds the database with an admin account, a few demo users, and a catalog
// of sample movies/shows/sports so the frontend has real data to render.
//
// Run with: npm run seed

require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Content = require("../models/Content");

// Free, publicly hosted sample MP4s (Google's GTV test catalog + Mixkit) so
// playback works out of the box. Swap these for your own URLs any time —
// either edit this file before seeding, or update content from the Admin
// Dashboard after seeding.
const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
];

const poster = (seed) => `https://picsum.photos/seed/${seed}/400/600`;
const banner = (seed) => `https://picsum.photos/seed/${seed}-wide/1600/700`;

const movieTitles = [
  { title: "Crimson Horizon", genres: ["Action", "Thriller"] },
  { title: "Whispers of Avalon", genres: ["Fantasy", "Adventure"] },
  { title: "The Last Transmission", genres: ["Sci-Fi", "Drama"] },
  { title: "Monsoon Diaries", genres: ["Romance", "Drama"] },
  { title: "Steel & Smoke", genres: ["Action", "Crime"] },
  { title: "Paper Moonlight", genres: ["Comedy", "Romance"] },
  { title: "Echoes of Tomorrow", genres: ["Sci-Fi", "Mystery"] },
  { title: "The Quiet Storm", genres: ["Drama", "Thriller"] },
  { title: "Neon Streets", genres: ["Action", "Crime"] },
  { title: "Garden of Ash", genres: ["Horror", "Mystery"] },
  { title: "Royal Heist", genres: ["Comedy", "Action"] },
  { title: "Beneath the Banyan", genres: ["Drama", "Family"] },
  { title: "Velocity", genres: ["Action", "Sci-Fi"] },
  { title: "The Forgotten Letter", genres: ["Romance", "Drama"] },
  { title: "Carnival of Shadows", genres: ["Horror", "Thriller"] },
  { title: "Sunset Over Kerala", genres: ["Drama", "Family"] },
  { title: "Iron Lotus", genres: ["Action", "Adventure"] },
  { title: "The Boardroom", genres: ["Drama", "Thriller"] },
  { title: "Laugh Riot", genres: ["Comedy"] },
  { title: "Tides of Fortune", genres: ["Adventure", "Drama"] },
];

const showTitles = [
  { title: "City of Secrets", genres: ["Drama", "Mystery"] },
  { title: "Spice Route Diaries", genres: ["Drama", "Family"] },
  { title: "The Office Chronicles", genres: ["Comedy"] },
  { title: "Battleground", genres: ["Action", "War"] },
  { title: "Kitchen Wars", genres: ["Reality"] },
  { title: "Starlight Academy", genres: ["Drama", "Teen"] },
  { title: "The Detective's Notebook", genres: ["Crime", "Mystery"] },
  { title: "Family First", genres: ["Family", "Drama"] },
  { title: "Stand-Up Stories", genres: ["Comedy"] },
  { title: "Royal Affairs", genres: ["Drama", "Romance"] },
];

const sportsTitles = [
  { title: "IPL 2026: Mumbai vs Chennai Highlights", genres: ["Cricket"] },
  { title: "World Cup Qualifiers: India vs Afghanistan", genres: ["Cricket"] },
  { title: "Premier League Weekly Recap", genres: ["Football"] },
  { title: "Pro Kabaddi League Finals", genres: ["Kabaddi"] },
  { title: "Badminton World Championship Highlights", genres: ["Badminton"] },
  { title: "ATP Masters: Best Rallies of the Week", genres: ["Tennis"] },
];

const categories = [
  "New on PixelPlay",
  "Trending Now",
  "Popular Movies",
  "Comedy Movies",
  "Action & Thriller",
  "Award-Winning Dramas",
];

const pick = (arr, i) => arr[i % arr.length];

const buildCatalog = () => {
  const items = [];

  movieTitles.forEach((m, i) => {
    items.push({
      title: m.title,
      description: `${m.title} is a gripping ${m.genres.join(" / ").toLowerCase()} film that keeps audiences on the edge of their seats from start to finish.`,
      type: "movie",
      genres: m.genres,
      language: pick(["Hindi", "English", "Tamil", "Telugu"], i),
      releaseYear: 2018 + (i % 8),
      rating: +(6 + Math.random() * 3.5).toFixed(1),
      ageRating: pick(["U", "U/A 7+", "U/A 13+", "U/A 16+", "A"], i),
      durationMinutes: 95 + (i % 6) * 10,
      posterUrl: poster(`movie-${i}`),
      bannerUrl: banner(`movie-${i}`),
      videoUrl: pick(SAMPLE_VIDEOS, i),
      cast: ["Lead Actor", "Lead Actress", "Supporting Actor"],
      director: "Director Name",
      isFeatured: i < 5,
      isTrending: i % 3 === 0,
      category: pick(categories, i),
      views: Math.floor(Math.random() * 5000),
    });
  });

  showTitles.forEach((s, i) => {
    items.push({
      title: s.title,
      description: `${s.title} follows an ensemble cast through an unforgettable ${s.genres.join(" / ").toLowerCase()} story, one episode at a time.`,
      type: "show",
      genres: s.genres,
      language: pick(["Hindi", "English", "Tamil"], i),
      releaseYear: 2020 + (i % 5),
      rating: +(6.5 + Math.random() * 3).toFixed(1),
      ageRating: pick(["U", "U/A 13+", "U/A 16+"], i),
      durationMinutes: 30 + (i % 4) * 10,
      posterUrl: poster(`show-${i}`),
      bannerUrl: banner(`show-${i}`),
      videoUrl: pick(SAMPLE_VIDEOS, i + 3),
      cast: ["Star One", "Star Two"],
      director: "Showrunner Name",
      isFeatured: i < 3,
      isTrending: i % 2 === 0,
      category: pick(categories, i + 2),
      views: Math.floor(Math.random() * 4000),
    });
  });

  sportsTitles.forEach((sp, i) => {
    items.push({
      title: sp.title,
      description: `Catch all the action, highlights, and analysis from ${sp.title}.`,
      type: "sports",
      genres: sp.genres,
      language: "English",
      releaseYear: 2026,
      rating: +(7 + Math.random() * 2).toFixed(1),
      ageRating: "U",
      durationMinutes: 20 + (i % 3) * 15,
      posterUrl: poster(`sports-${i}`),
      bannerUrl: banner(`sports-${i}`),
      videoUrl: pick(SAMPLE_VIDEOS, i + 6),
      cast: [],
      director: "",
      isFeatured: i === 0,
      isTrending: true,
      category: "Trending Now",
      views: Math.floor(Math.random() * 8000),
    });
  });

  return items;
};

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing existing content and demo users...");
    await Content.deleteMany({});
    await User.deleteMany({ email: { $ne: process.env.ADMIN_EMAIL } });

    // If a previous run of this script created the old, broken text index
    // (the one that collided with our "language" field), Mongoose won't
    // replace it on its own — an index only gets rebuilt if its definition
    // actually changed AND the old one is dropped first. Dropping here
    // makes this script self-healing if you've seeded before with an
    // older version of the Content model.
    console.log("Rebuilding indexes...");
    try {
      await Content.collection.dropIndexes();
    } catch (err) {
      // No indexes to drop on a fresh database - that's fine.
      if (err.codeName !== "NamespaceNotFound") {
        console.warn("Could not drop old indexes (continuing anyway):", err.message);
      }
    }
    await Content.syncIndexes();

    console.log("Creating admin account...");
    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || "Admin",
        email: process.env.ADMIN_EMAIL || "admin@pixelplay.com",
        password: process.env.ADMIN_PASSWORD || "Admin@12345",
        role: "admin",
      });
    } else {
      admin.role = "admin";
      await admin.save();
    }

    console.log("Creating a demo viewer account...");
    const demoUser = await User.create({
      name: "Demo Viewer",
      email: "viewer@pixelplay.com",
      password: "Viewer@123",
      role: "user",
    });

    console.log("Building content catalog...");
    const catalog = buildCatalog().map((item) => ({ ...item, createdBy: admin._id }));
    const created = await Content.insertMany(catalog);

    console.log("Adding a few items to the demo viewer's watchlist...");
    demoUser.watchlist = created.slice(0, 4).map((c) => c._id);
    demoUser.continueWatching = [
      { content: created[0]._id, progressSeconds: 320, durationSeconds: 5400 },
      { content: created[1]._id, progressSeconds: 1100, durationSeconds: 4800 },
    ];
    await demoUser.save();

    console.log("\nSeed complete!");
    console.log("----------------------------------------");
    console.log(`Admin login:  ${admin.email} / ${process.env.ADMIN_PASSWORD || "Admin@12345"}`);
    console.log(`Viewer login: viewer@pixelplay.com / Viewer@123`);
    console.log(`Content items created: ${created.length}`);
    console.log("----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();