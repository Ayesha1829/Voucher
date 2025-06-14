const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
}); // Explicitly load .env from parent
const config = require("../config/config");

const MONGODB_URI = config.database.uri;

if (!MONGODB_URI) {
  console.error(
    "MongoDB URI is not defined. Please check your .env file and config."
  );
  process.exit(1);
}

async function seedAdmin() {
  await mongoose.connect(MONGODB_URI, config.database.options);
  const email = "admin@voucher.com";
  const password = "admin123";
  const name = "Nexagen";
  const role = "admin";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin user already exists.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(
    password,
    config.security.bcryptRounds
  );
  const admin = new User({ name, email, password: hashedPassword, role });
  await admin.save();
  console.log("Admin user created:", { email, password });
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
