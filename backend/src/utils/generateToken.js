const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    // Surfaces a clear, actionable message instead of jsonwebtoken's
    // generic "secretOrPrivateKey must have a value" error, which doesn't
    // explain that the real problem is a missing/unloaded .env file.
    throw new Error(
      "JWT_SECRET is not set. Check that backend/.env exists, is named exactly " +
        "\".env\" (not \".env.txt\"), and is in the backend/ folder, then restart the server."
    );
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

module.exports = { generateToken };
