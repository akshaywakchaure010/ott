const path = require("path");
const dotenvResult = require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Startup diagnostics: confirms .env was actually found and that the
// variables the app depends on came through. Doesn't print secret values,
// only whether each one is set, so it's safe to leave in / share in logs.
console.log("\n--- Environment check ---");
console.log("Looking for .env at:", path.resolve(process.cwd(), ".env"));
if (dotenvResult.error) {
  console.log("dotenv could not load a .env file:", dotenvResult.error.message);
} else {
  console.log(`.env loaded successfully (${Object.keys(dotenvResult.parsed || {}).length} variables found)`);
}
["MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN", "CLIENT_URL"].forEach((key) => {
  const value = process.env[key];
  console.log(`  ${key}: ${value ? "set (" + value.length + " chars)" : "MISSING"}`);
});
console.log("--------------------------\n");

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    console.error(
      "Refusing to start: JWT_SECRET is missing. Fix your backend/.env file " +
        "(see the path checked above) and restart.\n"
    );
    process.exit(1);
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Pixel Play API running on http://localhost:${PORT}`);
  });
};

startServer();

// Handle unexpected errors gracefully instead of crashing silently
process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err.message);
});
