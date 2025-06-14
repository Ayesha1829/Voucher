const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const config = require('../config/config');

const MONGODB_URI = process.env.MONGODB_URI || config.database.uri;

async function seedAdmin() {
  await mongoose.connect(MONGODB_URI, config.database.options);
  const email = 'admin@voucher.com';
  const password = 'password123';
  const username = 'admin';
  const role = 'admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);
  const admin = new User({ username, email, password: hashedPassword, role });
  await admin.save();
  console.log('Admin user created:', { email, password });
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
